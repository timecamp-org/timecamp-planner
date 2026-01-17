import { generateId, Id } from '../common/identifier'

import Table, { ForeignKey, UniqueKey } from '../db/Table'
import { first } from 'lodash'

import {
  OrganizationDbRow,
  OrganizationRole,
  UserDbRow,
  UserInOrganizationDbRow,
} from '../db/schema'
import { QueryModifier } from '../../../../services/types'
import { EventDelegate } from '../../../../utils/EventDelegate'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import { UserServiceInterface } from '../users/UserServiceInterface'
import { inject, injectable } from 'inversify'
import { UsersModule } from '../users/UsersModule'
import { CreateUserResultStatus } from '../users/types'
import { NotificationSettingsServiceInterface } from '../notifications/interfaces/NotificationSettingsServiceInterface'
import { DEFAULT_DELIVERY_SETTINGS } from '../notifications/types'
import { OrganizationServiceInterface } from './interfaces/OrganizationServiceInterface'
import {
  CreateInvitationDataResult,
  CreateInvitationDataResultStatus,
  CreateOrganizationResult,
  CreateOrganizationResultStatus,
  GenerateInvitationLinkResult,
  GenerateInvitationLinkStatus,
  GetOrganizationProjectsResult,
  GetOrganizationProjectsResultStatus,
  GetOrganizationResult,
  GetOrganizationResultStatus,
  InviteUserToOrganizationResult,
  InviteUserToOrganizationResultStatus,
  OrganizationJson,
  PrepareAndSendInvitationMailResult,
  PrepareAndSendInvitationMailSatus,
  ReactivateUserFromWorkspaceStatus,
  UpdateOrganizationResult,
  UpdateOrganizationResultStatus,
  UserAddedToOrganizationEventData,
  UserInvitationJson,
} from './types'
import { NotificationsModule } from '../notifications/NotificationsModule'
import { MailerModule } from '../mailer/MailerModule'
import { MailerServiceInterface } from '../mailer/interfaces/MailerServiceInterface'
import { TokenServiceInterface } from '../token/TokenServiceInterface'
import { TokenType } from '../token/types'
import { TokenModule } from '../token/TokenModule'
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'
import { EntityStatus, UserRegistrationStatus } from '../common/enum'
import { UserInOrganizationProviderInterface } from './interfaces/UserInOrganizationProviderInterface'
import { OrganizationsModule } from './OrganizationsModule'
import { UserInvitationProviderInterface } from './interfaces/UserInvitationProviderInterface'
import { CommonModule } from '../common/CommonModule'
import { UrlGeneratorInterface } from '../common/UrlGenerator'
import { FrontendRoute } from '../../../../config/frontendRoutes.config'
import { Dict, Maybe } from '../common/types'
import { OrganizationProviderInterface } from './interfaces/OrganizationProviderInterface'
import { UserInOrganizationServiceInterface } from './interfaces/UserInOrganizationServiceInterface'
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'
import { ProjectsModule } from '../projects/ProjectsModule'
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface'
import { TasksModule } from '../tasks/TasksModule'
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface'
import { ListsModule } from '../lists/ListsModule'
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface'

/**
 * Main organization operations.
 */
@injectable()
export class OrganizationService
implements OrganizationServiceInterface {
  public userAddedToOrganizationEvent: EventDelegate<UserAddedToOrganizationEventData>;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private provider: OrganizationProviderInterface,
    @inject(MailerModule.MailerServiceInterface)
    private mailerService: MailerServiceInterface,
    @inject(TokenModule.TokenServiceInterface)
    private tokenService: TokenServiceInterface,
    @inject(NotificationsModule.NotificationSettingsServiceInterface)
    private notificationSettingsService: NotificationSettingsServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(OrganizationsModule.UserInvitationProviderInterface)
    private userInvitationProvider: UserInvitationProviderInterface,
    @inject(CommonModule.UrlGenerator)
    private urlGenerator: UrlGeneratorInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {
    this.userAddedToOrganizationEvent = new EventDelegate<UserAddedToOrganizationEventData>(logger);
  }

  /**
   * @param {Id} organizationId
   * @return {Promise<GetOrganizationResult>}
   */
  async getOrganization(organizationId: Id, trx?: Transaction): Promise<GetOrganizationResult> {
    const organization = await this.provider.getOrganization(organizationId, trx);

    if (!organization) {
      return {
        status: GetOrganizationResultStatus.ORGANIZATION_NOT_FOUND
      }
    }

    return {
      status: GetOrganizationResultStatus.OK,
      organization,
    }
  }

  /**
   * @param {Transaction} trx
   * @param {Id} creatorId
   * @param {OrganizationJson} organizationJson
   * @param {Id} organizationId
   * @return {Promise<CreateOrganizationResult>}
   */
  async doCreateOrganization(
    trx: Transaction,
    creatorId: Id,
    organizationJson: OrganizationJson,
    organizationId?: Id
  ): Promise<CreateOrganizationResult> {
    try {
      const organizationRow: Partial<OrganizationDbRow> = {
        id: (organizationId || generateId()),
        name: organizationJson.name
      }
      const user =
        await this.connection.getQueryBuilder()
          .table(Table.USER)
          .select()
          .where('id', creatorId)
          .transacting(trx)
          .then<UserDbRow>(first)

      if (!user) {
        return {
          status: CreateOrganizationResultStatus.USER_NOT_FOUND,
        }
      }

      const organization =
        await this.connection.getQueryBuilder()
          .insert(organizationRow, '*')
          .into(Table.ORGANIZATION)
          .transacting(trx)
          .then<OrganizationDbRow>(first)

      const userInOrganization = await this.doAddUserToOrganization(trx, organizationRow.id, user.id, OrganizationRole.OWNER);

      return {
        status: CreateOrganizationResultStatus.OK,
        organization: organization,
        userInOrganization,
      }

    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.ORGANIZATION_ID)) {
        return {
          status: CreateOrganizationResultStatus.ORGANIZATION_ALREADY_EXISTS
        }
      }
      throw error
    }
  }

  /**
   * Creates organization and adds given user to organization with role OWNER.
   *
   * @param {Id} creatorId
   * @param {OrganizationJson} organizationJson
   * @param {Id} organizationId
   * @return {Promise<CreateOrganizationResult>}
   */
  async createOrganization(
    creatorId: Id,
    organizationJson: OrganizationJson,
    organizationId?: Id
  ): Promise<CreateOrganizationResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      return this.doCreateOrganization(trx, creatorId, organizationJson, organizationId)
    })
  }

  /**
   * Updates organization
   *
   * @param {OrganizationJson} organizationJson
   * @param {Id} organizationId
   * @return {Promise<UpdateOrganizationResult>}
   */
  async updateOrganization(organizationJson: OrganizationJson, organizationId: Id): Promise<UpdateOrganizationResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      const result = await this.connection.getQueryBuilder()
        .table(Table.ORGANIZATION)
        .where({ 'id': organizationId })
        .update(organizationJson)
        .transacting(trx)

      if (result === 0) {
        return {
          status: UpdateOrganizationResultStatus.ORGANIZATION_NOT_FOUND,
        }
      } else {
        return {
          status: UpdateOrganizationResultStatus.OK,
        }
      }
    })
  }

  /**
   * @param {Id} organizationId
   * @param decorate
   * @return {Promise<GetOrganizationProjectsResult>}
   */
  async getOrganizationProjects(organizationId: Id, decorate?: QueryModifier, trx?: Transaction): Promise<GetOrganizationProjectsResult> {
    const { organization } = await this.getOrganization(organizationId, trx)

    if (!organization) {
      return {
        status: GetOrganizationProjectsResultStatus.ORGANIZATION_NOT_FOUND,
      }
    }

    const query = this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.PROJECT)
      .where({ 'organization_id': organizationId })
    if (decorate) {
      decorate(query);
    }
    const organizationProjects = await query;

    return {
      status: GetOrganizationProjectsResultStatus.OK,
      organizationProjects
    }
  }

  /**
   * @param {Id} inviterId
   * @param {Id} organizationId
   * @param email
   * @param {Id} userId?
   * @return {Promise<InviteUserToOrganizationResult>}
   */
  async inviteUserToOrganization(
    inviterId: Id,
    organizationId: Id,
    email: string,
    userId?: Id
  ): Promise<InviteUserToOrganizationResult> {
    return await this.connection.getConnection().transaction(trx => {
      return this.doInviteUserToOrganization(
        trx,
        inviterId,
        organizationId,
        email,
        userId
      );
    })
  }

  /**
   *
   * @param {Id} inviterId
   * @param {Knex.Transaction} trx
   * @param {Id} organizationId
   * @param {string} email
   * @param {Id} userId
   * @returns {Promise<InviteUserToOrganizationResult>}
   */
  public async doInviteUserToOrganization(
    trx: Transaction,
    inviterId: Id,
    organizationId: Id,
    email: string,
    userId?: Id,
    role?: OrganizationRole,
  ): Promise<InviteUserToOrganizationResult> {

    let user: Partial<UserDbRow> = await this.userService.getUserByEmail(email, trx)

    if (!user) {
      const createUserResult = await this.userService.doCreateUser(trx, userId, { email })

      if (createUserResult.status === CreateUserResultStatus.EMAIL_TAKEN) {
        return {
          status: InviteUserToOrganizationResultStatus.EMAIL_TAKEN,
        }
      }

      user = createUserResult.user
      await this.prepareAndSendInvitationMail(inviterId, user.id, organizationId, false, trx);
    }

    const createInvitationDataResult = await this.doCreateInvitationData(trx, inviterId, user.id, organizationId)

    switch (createInvitationDataResult.status) {
      case CreateInvitationDataResultStatus.ORGANIZATION_NOT_FOUND: {
        return { status: InviteUserToOrganizationResultStatus.ORGANIZATION_NOT_FOUND }
      }
      case CreateInvitationDataResultStatus.INVITER_NOT_FOUND: {
        return { status: InviteUserToOrganizationResultStatus.INVITER_NOT_FOUND }
      }
      case CreateInvitationDataResultStatus.INVITED_USER_NOT_FOUND: {
        return { status: InviteUserToOrganizationResultStatus.INVITED_USER_NOT_FOUND }
      }
      default: {
        // ok
      }
    }

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(user.id, organizationId, trx)

    if (userInOrganization) {
      switch (userInOrganization.entityStatus) {
        case EntityStatus.DELETED: {
          const reactivateResult = await this.userInOrganizationService.reactivateUserFromWorkspace(inviterId, userId || user.id, organizationId, role, trx);
          switch (reactivateResult.status) {
            case ReactivateUserFromWorkspaceStatus.OK:
              return {
                status: InviteUserToOrganizationResultStatus.USER_REACTIVATED,
                user
              }
            case ReactivateUserFromWorkspaceStatus.FORBIDDEN:
              return {
                status: InviteUserToOrganizationResultStatus.USER_IS_NOT_WORKSPACE_OWNER,
              }
            case ReactivateUserFromWorkspaceStatus.USER_NOT_FOUND:
              return {
                status: InviteUserToOrganizationResultStatus.INVITED_USER_NOT_FOUND
              }
            default:
              throw new Error('Error while reactivating user')
          }
        }
        case EntityStatus.EXISTS:
          return {
            status: InviteUserToOrganizationResultStatus.USER_ALREADY_IN_ORGANIZATION,
          }
      }
    } else {
      await this.doAddUserToOrganization(trx, organizationId, user.id, role || OrganizationRole.MEMBER);
    }

    return {
      status: InviteUserToOrganizationResultStatus.OK,
      user
    }
  }

  private async doCreateInvitationData(
    trx: Transaction,
    inviterId: Id,
    invitedUserId: Id,
    organizationId: Id,
  ): Promise<CreateInvitationDataResult> {
    try {
      const invitation: UserInvitationJson = {
        inviterId,
        invitedUserId,
        organizationId,
      }
      await this.userInvitationProvider.createInvitation(invitation, trx)

      return { status: CreateInvitationDataResultStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.USER_INVITATION_INVITER_ID_FK)) {
        return { status: CreateInvitationDataResultStatus.INVITER_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_INVITATION_INVITED_USER_ID_FK)) {
        return { status: CreateInvitationDataResultStatus.INVITED_USER_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_INVITATION_ORGANIZATION_ID_FK)) {
        return { status: CreateInvitationDataResultStatus.ORGANIZATION_NOT_FOUND }
      }

      throw error;
    }
  }

  /**
   * Organization and user must exits.
   *
   * @param trx
   * @param {Id} organizationId
   * @param {Id} userId
   * @param role
   * @return {Promise<UserInOrganizationDbRow>}
   */
  async doAddUserToOrganization(
    trx: Transaction,
    organizationId: Id,
    userId: Id,
    role: OrganizationRole
  ): Promise<UserInOrganizationDbRow> {
    const organization = await this.provider.getOrganization(organizationId, trx)

    if (!organization || organization.status !== EntityStatus.EXISTS) {
      throw new Error('Organization archived')
    }

    const userInOrganization: Partial<UserInOrganizationDbRow> = {
      userId: userId,
      organizationId: organizationId,
      role: role,
    }
    const [userInOrganizationDbRow] = await Promise.all([
      // [0]
      this.userInOrganizationProvider.createUserInOrganization(userInOrganization, trx),
      // [1]
      this.notificationSettingsService.doUpdateNotificationDeliverySettings(
        trx,
        userId,
        organizationId,
        DEFAULT_DELIVERY_SETTINGS
      )
    ]);

    await this.userAddedToOrganizationEvent.triggerEvent({
      trx,
      userId,
      organizationId
    });

    return userInOrganizationDbRow;
  }

  async getOrganizationUserCount(
    organizationId: Id,
    withoutBot: boolean = true,
    trx?: Transaction,
    decorate?: QueryModifier,
  ): Promise<number> {
    let query = this.connection.getQueryWithTransaction(trx);
    query = query
      .count('*')
      .from(Table.USER_IN_ORGANIZATION)
      .join(Table.USER, `${Table.USER_IN_ORGANIZATION}.userId`, `${Table.USER}.id`)
      .where({ 'organization_id': organizationId })
    ;

    if (decorate) {
      decorate(query)
    }

    if (withoutBot) {
      query = query.andWhere(`${Table.USER}.isBot`, false)
    }

    const result = await query.first()
    return parseInt(result.count as string)
  }

  async getOrganizationsForUser(userId: Id, trx?: Transaction, decorateQuery?: QueryModifier): Promise<OrganizationDbRow[]> {
    return await this.provider.getOrganizationsForUser(userId, trx, decorateQuery)
  }

  async getOrganizationRolesForUser(userId: Id): Promise<Dict<OrganizationRole>> {
    return await this.userInOrganizationProvider.getOrganizationRolesForUser(userId)
  }

  async prepareAndSendInvitationMail(inviterId: Id, invitedUserId: Id, organizationId: Id, isResent = false, trx?: Transaction): Promise<PrepareAndSendInvitationMailResult> {
    const inviter = await this.userService.getUserById(inviterId, trx);

    if (!inviter) {
      return {
        status: PrepareAndSendInvitationMailSatus.INVITER_NOT_FOUND
      }
    }

    const invitedUser = await this.userService.getUserById(invitedUserId, trx);

    if (!invitedUser) {
      return {
        status: PrepareAndSendInvitationMailSatus.INVITED_USER_NOT_FOUND
      }
    }

    const { organization } = await this.getOrganization(organizationId, trx)

    if (!organization) {
      return {
        status: PrepareAndSendInvitationMailSatus.ORGANIZATION_NOT_FOUND
      }
    }

    const invitationLinkResult = await this.generateInvitationLink(invitedUserId, trx)

    switch (invitationLinkResult.status) {
      case GenerateInvitationLinkStatus.OK:
        break;
      case GenerateInvitationLinkStatus.INVITED_USER_NOT_FOUND:
        return {
          status: PrepareAndSendInvitationMailSatus.INVITED_USER_NOT_FOUND
        }
      case GenerateInvitationLinkStatus.USER_ALREADY_REGISTERED:
        return {
          status: PrepareAndSendInvitationMailSatus.USER_ALREADY_REGISTERED
        }
    }

    this.mailerService.sendInvitationMail({
      inviter,
      recipient: invitedUser,
      organizationName: organization.name,
      invitationLink: invitationLinkResult.invitationLink,
      isResent,
    })

    return {
      status: PrepareAndSendInvitationMailSatus.OK
    }
  }

  async generateInvitationLink(invitedUserId: Id, trx?: Transaction): Promise<GenerateInvitationLinkResult> {
    const connection = trx || this.connection.getConnection()
    return connection.transaction(async (trx) => {
      const invitedUser = await this.userService.getUserById(invitedUserId, trx);

      if (!invitedUser) {
        return {
          status: GenerateInvitationLinkStatus.INVITED_USER_NOT_FOUND
        }
      }

      if (invitedUser.registrationStatus === UserRegistrationStatus.REGISTERED) {
        return {
          status: GenerateInvitationLinkStatus.USER_ALREADY_REGISTERED
        }
      }

      const token = this.tokenService.createToken(TokenType.RESET_PASSWORD, { userId: invitedUserId });
      const jwt = this.tokenService.createJsonWebToken(token);
      const linkRegister = this.urlGenerator.generate(
        FrontendRoute.REGISTER,
        {
          token: jwt.tokenString,
          email: invitedUser.email
        }
      );

      return {
        status: GenerateInvitationLinkStatus.OK,
        invitationLink: linkRegister,
      }
    })
  }

  async getOrganizationIdByProjectId(projectId: Id, trx?: Transaction): Promise<Maybe<Id>> {
    const project = await this.projectProvider.getProject(projectId, trx)
    if (project) {
      return project.organizationId
    }
  }

  async getOrganizationIdByListId(listId: Id, trx?: Transaction): Promise<Maybe<Id>> {
    const list = await this.listProvider.getList(listId, trx)
    if (list) {
      return await this.getOrganizationIdByProjectId(list.projectId)
    }
  }

  async getOrganizationIdByTaskId(taskId: Id, trx?: Transaction): Promise<Maybe<Id>> {
    const task = await this.taskProvider.getTaskById(taskId, trx)
    if (task) {
      return await this.getOrganizationIdByProjectId(task.projectId)
    }
  }
}
