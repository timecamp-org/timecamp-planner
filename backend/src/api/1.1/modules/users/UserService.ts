import { first, get, omit, uniq } from 'lodash';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { QueryModifier, UserJson } from '../../../../services/types';
import Table, { UniqueKey } from '../db/Table';

import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { violatesUniqueKey } from '../../../../utils';
import { CommonModule } from '../common/CommonModule';
import { EntityStatus, UserRegistrationStatus } from '../common/enum';
import { Id, generateId } from '../common/identifier';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { OrganizationRole, PublicUserDbRow, SubscriptionInOrganizationDbRow, UserDbRow } from '../db/schema';
import { MailerModule } from '../mailer/MailerModule';
import { MailerServiceInterface } from '../mailer/interfaces/MailerServiceInterface';
import { ResetPasswordMailConfig } from '../mailer/types';
import { PasswordModule } from '../password/PasswordModule';
import { PasswordServiceInterface } from '../password/PasswordServiceInterface';
import { TokenModule } from '../token/TokenModule';
import { TokenServiceInterface } from '../token/TokenServiceInterface';
import { TokenType } from '../token/types';
import { UserProviderInterface } from './UserProviderInterface';
import { UserServiceInterface } from './UserServiceInterface';
import { UsersModule } from './UsersModule';
import {
  CreateUserResult,
  CreateUserResultStatus,
  DeleteUserAvatarResult,
  DeleteUserAvatarStatus,
  GeneratePasswordResetLinkResult,
  GeneratePasswordResetLinkStatus,
  GetUserIsOnlineResult,
  SendResetPasswordLinkResult,
  SendResetPasswordLinkResultStatus,
  UpdateUserPasswordResult,
  UpdateUserPasswordResultStatus,
  UpdateUserResult,
  UpdateUserResultStatus,
} from './types';
import md5 = require('md5');

import { FrontendRoute } from '../../../../config/frontendRoutes.config';
import { UrlGeneratorInterface } from '../common/UrlGenerator';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import { FileStorageInterface } from '../fileStorage/FileStorageInterface';
import { FileStorageModule } from '../fileStorage/FileStorageModule';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { NotificationSettingsServiceInterface } from '../notifications/interfaces/NotificationSettingsServiceInterface';
import { NotificationsModule } from '../notifications/NotificationsModule';
import { DEFAULT_DELIVERY_SETTINGS } from '../notifications/types';

const MIN_PASSWORD_LENGTH = 3;

const nonEditableFields = ['id', 'password', 'createdAt', 'modifiedAt', 'status'];

@injectable()
class UserService implements UserServiceInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PasswordModule.PasswordServiceInterface)
    private passwordService: PasswordServiceInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(TokenModule.TokenServiceInterface)
    private tokenService: TokenServiceInterface,
    @inject(MailerModule.MailerServiceInterface)
    private mailerService: MailerServiceInterface,
    @inject(UsersModule.UserProviderInterface)
    private userProvider: UserProviderInterface,
    @inject(FileStorageModule.FileStorageInterface)
    private fileStorage: FileStorageInterface,
    @inject(CommonModule.UrlGenerator)
    private urlGenerator: UrlGeneratorInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(NotificationsModule.NotificationSettingsServiceInterface)
    private notificationSettingsService: NotificationSettingsServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    void this.userInOrganizationProvider;
  }

  /**
   * Returns user object IFF email and password match a registerd user.
   * Null otherwise.
   *
   * @param email
   * @param password
   * @return {Promise<Partial<UserDbRow>>}
   */
  async getUserByLoginAndPassword(email, password): Promise<PublicUserDbRow> {
    const user: UserDbRow = await this.connection
      .getQueryBuilder()
      .select()
      .from(Table.USER)
      .leftOuterJoin(Table.USER_ONLINE, 'id', 'user_id')
      .where('email', email)
      .andWhere('status', EntityStatus.EXISTS)
      .first();

    if (!user || !user.passwordHash) {
      return null;
    }

    if (!(await this.passwordService.passwordMatches(password, user.passwordHash))) {
      return null;
    }

    return this.getPublicUserData(user);
  }

  /**
   * @param id
   * @param {UserJson} user
   * @return {Promise<CreateUserResult>}
   */
  async createUser(id: Id, user: UserJson): Promise<CreateUserResult> {
    return await this.connection.getConnection().transaction((trx) => {
      return this.doCreateUser(trx, id, user);
    });
  }

  /**
   *
   * @param {Knex.Transaction} trx
   * @param {UserJson} user
   * @returns {Promise<CreateUserResult>}
   */
  async doCreateUser(trx: Transaction, id: Id, user: UserJson): Promise<CreateUserResult> {
    if (user.password && user.password.length < MIN_PASSWORD_LENGTH) {
      return {
        status: CreateUserResultStatus.PASSWORD_TOO_SHORT,
      };
    }

    // Password service is responsible for generating salted hash.
    const passwordHash = user.password ? await this.passwordService.getHash(user.password) : null;
    // User is registered as soon as he sets his password.
    // If no password is set then this is invitation.
    const isUserRegistered = passwordHash != null;
    const userRow: Partial<UserDbRow> = {
      id: id || generateId(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      passwordHash: passwordHash,
      registrationStatus:
        user.registrationStatus ||
        (isUserRegistered ? UserRegistrationStatus.REGISTERED : UserRegistrationStatus.PENDING),
      ipAddress: user.ipAddress,
      referrer: user.referrer
    };

    try {
      const users = await this.connection
        .getQueryBuilder()
        .transacting(trx)
        .insert(userRow)
        .into(Table.USER)
        .returning('*');
      if (users.length < 1) {
        return null;
      } else {
        // Events to fire on USER_CREATED
        if (isUserRegistered) {
          this.mailerService.sendWelcomeMail(users[0]).then(
            () => {},
            (error) => this.logger.error(error)
          );
        }
        return { status: CreateUserResultStatus.OK, user: users[0] };
      }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.USER_EMAIL)) {
        // User already registered
        return { status: CreateUserResultStatus.EMAIL_TAKEN };
      }
      throw error;
    }
  }

  async getUserById(id: Id, trx?: Transaction): Promise<UserDbRow> {
    return await this.userProvider.getUserById(id, trx);
  }

  /**
   * Returns all users with given ids. If registeredOnly is set, then
   * users are not returned if they haven't finished registration process
   * (eg. have been invited, but did not follow the invitation link).
   *
   * @param {Id[]} ids
   * @param {boolean} registeredOnly
   * @return {Promise<void>}
   */
  async getUsersByIds(ids: Id[], registeredOnly: boolean = true, trx?: Transaction): Promise<UserDbRow[]> {
    const query = this.connection
      .getQueryWithTransaction(trx)
      .select()
      .from(Table.USER)
      .whereIn('id', ids)
      .where('status', EntityStatus.EXISTS);
    if (registeredOnly) {
      query.whereIn('registrationStatus', [UserRegistrationStatus.REGISTERED, UserRegistrationStatus.VERIFIED]);
    }

    return await query;
  }

  async getUserByEmail(email: string, trx?: Transaction): Promise<UserDbRow> {
    return this.userProvider.getUserByEmail(email, trx);
  }

  async updateUser(id: Id, user: UserJson): Promise<UpdateUserResult> {
    const updatedFields: Partial<UserDbRow> = omit(
      {
        ...user,
      },
      nonEditableFields
    );
    updatedFields.modifiedAt = this.timeService.getCurrentTime();
    await this.connection.getQueryBuilder().from(Table.USER).where('id', id).update(updatedFields);
    return {
      status: UpdateUserResultStatus.OK,
    };
  }

  async changeUserPassword(
    userId: Id,
    currentPassword: string,
    newPassword: string
  ): Promise<UpdateUserPasswordResult> {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return {
        status: UpdateUserPasswordResultStatus.PASSWORD_TOO_SHORT,
      };
    }

    const user = await this.getUserById(userId);

    if (
      (user.passwordHash && !(await this.passwordService.passwordMatches(currentPassword, user.passwordHash))) ||
      (!user.passwordHash && currentPassword)
    ) {
      return {
        status: UpdateUserPasswordResultStatus.PASSWORD_DOESNT_MATCH,
      };
    }

    await this.doUpdatePassword(user, newPassword);

    return {
      status: UpdateUserPasswordResultStatus.OK,
      userEmail: user.email,
    };
  }

  async changeUserPasswordForToken(token: string, newPassword: string): Promise<UpdateUserPasswordResult> {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return {
        status: UpdateUserPasswordResultStatus.PASSWORD_TOO_SHORT,
      };
    }

    const user = await this.getValidUserFromToken(token);

    if (!user) {
      return {
        status: UpdateUserPasswordResultStatus.RESOURCE_NOT_FOUND,
      };
    }

    await this.doUpdatePassword(user, newPassword);

    return {
      status: UpdateUserPasswordResultStatus.OK,
      userEmail: user.email,
    };
  }

  private async doUpdatePassword(user: UserDbRow, newPassword: string) {
    if (!newPassword) {
      return;
    }
    const passwordHash = await this.passwordService.getHash(newPassword);
    const userWasUnregistered = user.passwordHash == null;

    await this.connection.getQueryBuilder().from(Table.USER).where('id', user.id).update({
      modifiedAt: this.timeService.getCurrentTime(),
      passwordHash,
      registrationStatus: UserRegistrationStatus.REGISTERED,
    });

    if (userWasUnregistered) {
      await this.ensureUserInInvitedOrganizations(user.id);
      this.mailerService.sendWelcomeMail(user).then(
        () => {},
        (error) => this.logger.error(error)
      );
    }
  }

  private async ensureUserInInvitedOrganizations(userId: Id): Promise<void> {
    await this.connection.getConnection().transaction(async (trx) => {
      const invitedOrganizations = await this.connection
        .getQueryWithTransaction(trx)
        .select(`${Table.USER_INVITATION}.organizationId`)
        .from(Table.USER_INVITATION)
        .where(`${Table.USER_INVITATION}.invitedUserId`, userId);

      const organizationIds = uniq(invitedOrganizations.map((row) => row.organizationId)).filter(Boolean);

      if (!organizationIds.length) {
        return;
      }

      for (const organizationId of organizationIds) {
        const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId, trx);

        if (!userInOrganization) {
          await this.userInOrganizationProvider.createUserInOrganization(
            {
              userId,
              organizationId,
              role: OrganizationRole.MEMBER,
              entityStatus: EntityStatus.EXISTS,
            },
            trx
          );
          await this.notificationSettingsService.doUpdateNotificationDeliverySettings(
            trx,
            userId,
            organizationId,
            DEFAULT_DELIVERY_SETTINGS
          );
          continue;
        }

        if (userInOrganization.entityStatus === EntityStatus.DELETED) {
          await this.userInOrganizationProvider.updateUserInOrganization(
            organizationId,
            userId,
            { entityStatus: EntityStatus.EXISTS },
            trx
          );
          await this.notificationSettingsService.doUpdateNotificationDeliverySettings(
            trx,
            userId,
            organizationId,
            DEFAULT_DELIVERY_SETTINGS
          );
        }
      }
    });
  }

  async getValidUserFromToken(token: string): Promise<UserDbRow> {
    const parseTokenResult = this.tokenService.parseInternalJsonWebToken(TokenType.RESET_PASSWORD, token);
    const userId = get(parseTokenResult, 'token.payload.userId');
    if (userId) {
      return await this.getUserById(userId);
    }
    return null;
  }

  async deleteUser(id: Id): Promise<UpdateUserResult> {
    const userRow = await this.connection.getQueryBuilder().select().from(Table.USER).where('id', id).first();
    if (!userRow || userRow.status !== EntityStatus.EXISTS) {
      return { status: UpdateUserResultStatus.RESOURCE_NOT_FOUND };
    }
    const updatedFields: Partial<UserDbRow> = {
      modifiedAt: this.timeService.getCurrentTime(),
      status: EntityStatus.DELETED,
      email: this.scrambleEmail(userRow.email),
    };
    await this.connection.getQueryBuilder().from(Table.USER).where('id', id).update(updatedFields);
    return {
      status: UpdateUserResultStatus.OK,
    };
  }

  async isUserAccountDeleted(id: Id, trx?: Transaction): Promise<boolean> {
    const user = await this.userProvider.getUserById(id, trx);
    return !user || user.status === EntityStatus.DELETED;
  }

  async sendPasswordResetLink(user: Partial<UserDbRow>): Promise<SendResetPasswordLinkResult> {
    const token = this.tokenService.createToken(TokenType.RESET_PASSWORD, {
      userId: user.id,
    });
    const jwt = this.tokenService.createJsonWebToken(token);

    const resetPasswordMailConfig: ResetPasswordMailConfig = {
      resetPasswordToken: jwt.tokenString,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
    this.mailerService.sendResetPasswordMail(resetPasswordMailConfig);
    return { status: SendResetPasswordLinkResultStatus.OK };
  }

  async generatePasswordResetLink(email: string): Promise<GeneratePasswordResetLinkResult> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return {
        status: GeneratePasswordResetLinkStatus.USER_NOT_FOUND,
      };
    }
    const token = this.tokenService.createToken(TokenType.RESET_PASSWORD, {
      userId: user.id,
    });
    const jwt = this.tokenService.createJsonWebToken(token);

    const url = this.urlGenerator.generate(FrontendRoute.RESET_PASSWORD, {
      token: jwt.tokenString,
    });

    return {
      status: GeneratePasswordResetLinkStatus.OK,
      url,
    };
  }

  public async getUsersForQuery(
    decorate: QueryModifier,
    trx?: Transaction,
    columnNames?: Array<keyof PublicUserDbRow>
  ): Promise<PublicUserDbRow[]> {
    const users = await this.userProvider.getUsersForQuery(decorate, trx, columnNames);
    return users.map(this.getPublicUserData);
  }

  getPublicUserData(user: UserDbRow): PublicUserDbRow {
    return omit(user, ['passwordHash']);
  }

  async getPublicUserDataByUserId(userId: Id, trx?: Transaction): Promise<PublicUserDbRow> {
    const users = await this.userProvider.getUsersForQuery((q) => q.where({ [`${Table.USER}.id`]: userId }), trx);

    return first(users);
  }

  async getPublicUsersDataByUserIds(userIds: Id[], trx?: Transaction): Promise<PublicUserDbRow[]> {
    return await this.userProvider.getUsersForQuery((q) => q.whereIn(`${Table.USER}.id`, userIds), trx);
  }

  async getUserOnlineStatus(userIds: Id[]): Promise<Array<GetUserIsOnlineResult>> {
    return await this.connection.getQueryBuilder().from(Table.USER_ONLINE).select().whereIn('user_id', userIds);
  }

  public async getAllUsersFromOrganizationsForUser(userId: Id): Promise<Array<Id>> {
    const userIds = await this.connection
      .getQueryBuilder()
      .select('user_id')
      .from(Table.USER_IN_ORGANIZATION)
      .whereIn('organizationId', function () {
        this.select('organizationId').from(Table.USER_IN_ORGANIZATION).where('user_id', userId);
      })
      .pluck('user_id');

    return uniq(userIds);
  }

  /**
   * Scrambles deleted user's email so that it is: unique and reversible (as long as user
   * provides the original email).
   *
   * @param email
   */
  private scrambleEmail(email: string) {
    const hash = md5(email.toLowerCase());
    const stamp = Math.floor(this.timeService.getCurrentEpoch());
    return `deleted.account+${hash}.${stamp}@timecamp.com`;
  }

  public async deleteUserAvatar(userId: Id): Promise<DeleteUserAvatarResult> {
    const user = await this.getUserById(userId);

    if (!user) {
      return {
        status: DeleteUserAvatarStatus.USER_NOT_FOUND,
      };
    }

    const avatarUrl = user.avatarUrl;
    if (!avatarUrl) {
      return {
        status: DeleteUserAvatarStatus.AVATAR_NOT_FOUND,
      };
    }

    await this.fileStorage.deleteFile(avatarUrl);

    return {
      status: DeleteUserAvatarStatus.OK,
    };
  }

  public async filterOutBots(userIds: Id[], trx?: Transaction): Promise<Id[]> {
    return await this.userProvider.filterOutBots(userIds, trx);
  }

  public async getUserOrganizationSubscriptions(userId: Id): Promise<SubscriptionInOrganizationDbRow[]> {
    return [];
  }

  public static getUserFullName(user: UserDbRow): string {
    if (user) {
      return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.email}`;
    } else {
      return '';
    }
  }
}

export default UserService;
