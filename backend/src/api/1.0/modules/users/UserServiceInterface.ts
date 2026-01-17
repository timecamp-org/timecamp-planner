import { UserDbRow, PublicUserDbRow, SubscriptionInOrganizationDbRow } from '../db/schema';
import { UserJson, QueryModifier } from '../../../../services/types';
import { Id } from '../common/identifier';
import {
  CreateUserResult,
  UpdateUserResult,
  SendResetPasswordLinkResult,
  UpdateUserPasswordResult,
  GetUserIsOnlineResult,
  DeleteUserAvatarResult,
  GeneratePasswordResetLinkResult
} from './types';


export interface UserServiceInterface {
  /**
   * Returns user object IFF email and password match a registerd user.
   * Null otherwise.
   *
   * @param email
   * @param password
   * @return {PromiseLike<Partial<UserDbRow>>}
   */
  getUserByLoginAndPassword(email, password): PromiseLike<Partial<UserDbRow>>;

  /**
   * Creates user only if email is not yet registered.
   *
   * @param {Id} id
   * @param {UserJson} user
   * @return {PromiseLike<CreateUserResult>}
   */
  createUser(id: Id, user: UserJson): PromiseLike<CreateUserResult>;

  /**
   * @param {Transaction} trx
   * @param {Id} id
   * @param {UserJson} user
   * @return {PromiseLike<CreateUserResult>}
   */
  doCreateUser(trx: Transaction, id: Id, user: UserJson): PromiseLike<CreateUserResult>;

  /**
   * Updates user.
   *
   * @param {Id} id
   * @param {UserJson} user
   * @return {PromiseLike<UpdateUserResult>}
   */
  updateUser(id: Id, user: UserJson): PromiseLike<UpdateUserResult>;


  /**
   * Sets user status to deleted.
   *
   * @param {Id} id
   * @return {PromiseLike<UpdateUserResult>}
   */
  deleteUser(id: Id): PromiseLike<UpdateUserResult>;

  /**
   * @param {Id} id
   * @return {PromiseLike<Partial<UserDbRow>>}
   */
  getUserById(id: Id, trx?: Transaction): PromiseLike<UserDbRow>;

  /**
   * @param {string} email
   * @return {PromiseLike<Partial<UserDbRow>>}
   */
  getUserByEmail(email: string, trx?: Transaction): PromiseLike<UserDbRow>;

  /**
   * @param {Partial<UserDbRow>} user
   * @return {PromiseLike<SendResetPasswordLinkResult>}
   */
  sendPasswordResetLink(user: Partial<UserDbRow>): PromiseLike<SendResetPasswordLinkResult>;

  /**
   * @param {Partial<UserDbRow>} user
   * @return {PromiseLike<string>}
   */
  generatePasswordResetLink(email: string): PromiseLike<GeneratePasswordResetLinkResult>;

  /**
   * @param {Id} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @return {PromiseLike<UpdateUserPasswordResult>}
   */
  changeUserPassword(userId: Id, currentPassword: string, newPassword: string): PromiseLike<UpdateUserPasswordResult>;

  /**
   * @param {string} token
   * @param {string} newPassword
   * @return {PromiseLike<UpdateUserPasswordResult>}
   */
  changeUserPasswordForToken(token: string, newPassword: string): PromiseLike<UpdateUserPasswordResult>;

  /**
   * Get user data without sensitive fields.
   * @param {Partial<UserDbRow>} user
   * @return {Partial<UserDbRow>}
   */
  getPublicUserData(user: Partial<UserDbRow>): Partial<UserDbRow>;

  getPublicUserDataByUserId(userId: Id, trx?: Transaction): PromiseLike<PublicUserDbRow>

  getPublicUsersDataByUserIds(userIds: Id[], trx?: Transaction): PromiseLike<PublicUserDbRow[]>

  /**
   * @return {PromiseLike<Partial<UserDbRow>[]>>}
   * @param decorate
   */
  getUsersForQuery(
    decorate: QueryModifier,
    trx?: Transaction,
    columnNames?: Array<keyof PublicUserDbRow>
  ): PromiseLike<PublicUserDbRow[]>

  /**
   * @param {Id | Array<Id>} user
   * @return {PromiseLike<Array<GetUserIsOnlineResult>>}
   */
  getUserOnlineStatus(users: Array<Id>): PromiseLike<Array<GetUserIsOnlineResult>>

  /**
   * @param {Id} userId
   * @return {PromiseLike<Array<Id>>}
   */
  getAllUsersFromOrganizationsForUser(userId: Id): PromiseLike<Array<Id>>

  /**
   * Returns all users with given ids. If registeredOnly is set, then
   * users are not returned if they haven't finished registration process
   * (eg. have been invited, but did not follow the invitation link).
   *
   * @param {Id[]} ids
   * @param {boolean} registeredOnly
   * @return {PromiseLike<void>}
   */
  getUsersByIds(ids: Id[], registeredOnly?: boolean, trx?: Transaction): PromiseLike<UserDbRow[]>

  /**
   * @param {Id} userId
   * @return {PromiseLike<DeleteUserAvatarResult>}
   */
  deleteUserAvatar(userId: Id): PromiseLike<DeleteUserAvatarResult>

      /**
   * @param {Id[]} userIds
   * @return {PromiseLike<Id[]>}
   */
  filterOutBots(userIds: Id[], trx?: Transaction): PromiseLike<Id[]>
  
      /**
   * @param {Id[]} userId
   * @return {PromiseLike<SubscriptionInOrganizationDbRow[]>}
   */
  getUserOrganizationSubscriptions(userId: Id): PromiseLike<SubscriptionInOrganizationDbRow[]>

  isUserAccountDeleted(id: Id, trx?: Transaction): PromiseLike<boolean>

}
