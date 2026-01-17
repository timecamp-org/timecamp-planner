import { Id } from '../common/identifier';
import OpenIdTokenValidator from './OpenIdTokenValidator'
import {
  CreateOAuthUserBindingResult,
  CreateOAuthUserBindingResultStatus,
  CreateUserFromTokenResult,
  CreateUserFromTokenResultStatus,
  GetUserFromTokenResult,
  GetUserFromTokenResultStatus,
  OpenIdSubjectInterface,
  ValidatedSubjectResult,
  ValidatedSubjectResultStatus
} from './types';
import { EntityStatus, UserRegistrationStatus } from '../common/enum';

import Table, { UniqueKey } from '../db/Table';
import { get } from 'lodash'
import { violatesUniqueKey } from '../../../../utils'
import { UserServiceInterface } from '../users/UserServiceInterface';
import { CreateUserResult, CreateUserResultStatus } from '../users/types';
import { TokenServiceInterface } from '../token/TokenServiceInterface';
import { inject, injectable } from 'inversify';
import { TokenModule } from '../token/TokenModule';
import { UsersModule } from '../users/UsersModule';
import { OpenIdServiceInterface } from './OpenIdServiceInterface';
import { UserJson } from '../../../../services/types';

import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

@injectable()
export class OpenIdService implements OpenIdServiceInterface {

  private tokenService: TokenServiceInterface;
  private userService: UserServiceInterface;
  private tokenValidator: OpenIdTokenValidator;

  constructor(
    @inject(TokenModule.TokenServiceInterface) tokenService: TokenServiceInterface,
    @inject(UsersModule.UserServiceInterface) userService: UserServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.tokenService = tokenService;
    this.userService = userService;
    this.tokenValidator = new OpenIdTokenValidator(this.tokenService);
  }

  async createUserFromToken(userId: Id, token: string, ipAddress: string): Promise<CreateUserFromTokenResult> {
    const tokenSubjectResult: ValidatedSubjectResult = await this.tokenValidator.getSubjectFromToken(token);
    if (tokenSubjectResult.status === ValidatedSubjectResultStatus.INVALID_ID_TOKEN || !tokenSubjectResult.subject) {
      return { status: CreateUserFromTokenResultStatus.INVALID_ID_TOKEN }
    }

    const subject = tokenSubjectResult.subject;

    const boundUserId = await this.getBoundUserId(subject);

    if (boundUserId) {
      return { status: CreateUserFromTokenResultStatus.OPENID_ALREADY_EXISTS }
    }

    const [firstName, lastName] = subject.name.split(' ')
    const user: UserJson = {
      email: subject.email,
      firstName,
      lastName,
      registrationStatus: UserRegistrationStatus.REGISTERED,
      ipAddress,
    }

    return this.connection.getConnection().transaction(async (trx) => {
      const createUserResult: CreateUserResult = await this.userService.doCreateUser(trx, userId, user);

      if (createUserResult.status === CreateUserResultStatus.EMAIL_TAKEN) {
        return { status: CreateUserFromTokenResultStatus.EMAIL_TAKEN }
      }

      const userBindingResult = await this.createOAuthUserBinding(userId, subject, trx);

      if (userBindingResult.status === CreateOAuthUserBindingResultStatus.OPENID_ALREADY_EXISTS) {
        return { status: CreateUserFromTokenResultStatus.OPENID_ALREADY_EXISTS }
      }

      return { status: CreateUserFromTokenResultStatus.OK, user: createUserResult.user }
    })
  }

  async getUserFromToken(token: string): Promise<GetUserFromTokenResult> {
    const tokenSubjectResult: ValidatedSubjectResult = await this.tokenValidator.getSubjectFromToken(token);
    if (tokenSubjectResult.status === ValidatedSubjectResultStatus.INVALID_ID_TOKEN || !tokenSubjectResult.subject) {
      return { status: GetUserFromTokenResultStatus.INVALID_ID_TOKEN }
    }

    const subject = tokenSubjectResult.subject;
    const boundUserId = await this.getBoundUserId(subject);
    if (!boundUserId) {
      const userFromEmail = await this.userService.getUserByEmail(subject.email);

      if (userFromEmail) {
        const userBindingResult = await this.createOAuthUserBinding(userFromEmail.id, subject);
        if (userBindingResult.status === CreateOAuthUserBindingResultStatus.OPENID_ALREADY_EXISTS) {
          return { status: GetUserFromTokenResultStatus.OPENID_ALREADY_EXISTS, user: userFromEmail }
        }
        if (userFromEmail.registrationStatus === UserRegistrationStatus.PENDING) {
          await this.userService.updateUser(userFromEmail.id, { registrationStatus: UserRegistrationStatus.REGISTERED })
        }
      }
      return { status: GetUserFromTokenResultStatus.OK, user: userFromEmail }
    }
    const user = await this.userService.getUserById(boundUserId);

    if (!user) {
      return { status: GetUserFromTokenResultStatus.USER_NOT_FOUND }
    }

    if (user.status === EntityStatus.DELETED) {
      return { status: GetUserFromTokenResultStatus.ACCOUNT_DELETED }
    }

    return { status: GetUserFromTokenResultStatus.OK, user: this.userService.getPublicUserData(user) }
  }

  async createOAuthUserBinding(userId: Id, subject: OpenIdSubjectInterface, trx?: Transaction): Promise<CreateOAuthUserBindingResult> {
    try {
      await this.connection.getQueryWithTransaction(trx)
        .insert({
          userId: userId,
          subjectId: subject.subjectId,
          providerCode: subject.providerCode,
        })
        .into(Table.OAUTH_USER_BINDING)
      return { status: CreateOAuthUserBindingResultStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.OAUTH_USER_BINDING_USER_SUBJECT_ID)) {
        return { status: CreateOAuthUserBindingResultStatus.OPENID_ALREADY_EXISTS }
      }
      throw error;
    }
  }

  async deleteOAuthBindings(userId: Id): Promise<void> {
    await this.connection.getQueryBuilder()
      .del()
      .from(Table.OAUTH_USER_BINDING)
      .where({
        userId
      })
    ;
  }

  async getBoundUserId(subject: OpenIdSubjectInterface): Promise<Id> {
    const userIdResult = await this.connection.getQueryBuilder()
      .select('user_id')
      .from(Table.OAUTH_USER_BINDING)
      .where({
        subjectId: subject.subjectId,
        providerCode: subject.providerCode,
      }).first()

    return get(userIdResult, 'userId')
  }
}
