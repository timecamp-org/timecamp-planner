import { Id } from '../../common/identifier';
import { UserInOrganizationDbRow, OrganizationRole } from '../../db/schema';

import { QueryModifier } from '../../../../../services/types';
import { UserInOrganizationJson, UsersInOrganizationsMap } from '../types';
import { Dict } from '../../common/types';

export interface UserInOrganizationProviderInterface {
  /**
* @param {Id} userId
* @param {Id} organizationId
* @param trx
* @return {PromiseLike<Id[]>}
*/
  getUserInOrganization(userId: Id, organizationId: Id, trx?: Transaction): PromiseLike<UserInOrganizationDbRow>;

  /**
 * @param {Id} id
 * @param trx
 * @return {PromiseLike<Id[]>}
 */
  getUserInOrganizationById(id: Id, trx?: Transaction): PromiseLike<UserInOrganizationDbRow>;

  /**
 * @param {Id} organizationId
 * @param trx
 * @return {PromiseLike<Id[]>}
 */
  getOrganizationUserIds(organizationId: Id, trx?: Transaction, decorate?: QueryModifier): PromiseLike<Id[]>

  getOrganizationUsersByOrganizationId(organizationId: Id, trx?: Transaction, decorate?: QueryModifier): PromiseLike<UserInOrganizationDbRow[]>

  /**
   * @param {Id} organizationId
   * @param trx
   * @return {PromiseLike<Id[]>}
   */
  getOrganizationUserIdsWithoutBot(organizationId: Id, trx?: Transaction): PromiseLike<Id[]>
  /**
   * @param {Id} organizationId
   * @param trx
   * @return {PromiseLike<Id[]>}
   */
  getOrganizationActiveUserIds(organizationId: Id, trx?: Transaction): PromiseLike<Id[]>

  getOrganizationActiveMemberIds(organizationId: Id, trx?: Transaction): PromiseLike<Id[]>

  getOrganizationUsersWithoutGuests(organizationId: Id, trx?: Transaction): PromiseLike<UserInOrganizationDbRow[]>

  getOrganizationGuests(organizationId: Id, trx?: Transaction): PromiseLike<UserInOrganizationDbRow[]>

  updateUserInOrganization(organizationId: Id, userId: Id, userInOrganizationJson: UserInOrganizationJson, trx?: Transaction): PromiseLike<UserInOrganizationDbRow>;

  createUserInOrganization(userInOrganizationJson: UserInOrganizationJson, trx?: Transaction): PromiseLike<UserInOrganizationDbRow>;

  getOrganizationOwner(organizationId: Id, trx?: Transaction): PromiseLike<Id>;

  getOrganizationAdminUserIds(organizationId: Id, trx?: Transaction): PromiseLike<Id[]>;

  getOccupiedGuestSeatCountForOrganization(organizationId: Id, trx?: Transaction): PromiseLike<number>;

  filterOutDeactivatedUsers(organizationId: Id, userIds: Id[], trx?: Transaction): PromiseLike<Id[]>;

  checkIfUserIsInOrganization(organizationId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>;

  getUsersOrganizationIds(userIds: Id[]): PromiseLike<UsersInOrganizationsMap>;

  getUserOrganizationIds(userIds: Id, decorate?: QueryModifier): PromiseLike<Id[]>;

  getOrganizationRolesForUser(userId: Id): PromiseLike<Dict<OrganizationRole>>;

  getUserOwnedOrganizationIds(userId: Id): PromiseLike<Id[]>;

  getOrganizationsPeopleCountWithoutBot(organizationIds: Id[]): PromiseLike<Dict<number>>;

  getOrganizationGuestsForGivenProject(organizationId: Id, projectId: Id, trx?: Transaction): PromiseLike<UserInOrganizationDbRow[]>

  getGuestsInvitedByUser(
    userId: Id,
    organizationId: Id,
    decorate?: QueryModifier,
    trx?: Transaction,
  ): PromiseLike<UserInOrganizationDbRow[]>

  getOrganizationUsersInSpecifiedProjects(
    organizationId: Id,
    projectIds: Id[],
    decorate?: QueryModifier,
    trx?: Transaction,
  ): PromiseLike<UserInOrganizationDbRow[]>
  getOrganizationsPeopleCountWithoutBot(organizationIds: Id[]): Promise<Dict<number>>;

  getProjectUsersInOrganizationWithoutSharedProjects(
    userId: Id,
    projectId: Id,
    organizationId: Id,
    decorate?: QueryModifier
  ): PromiseLike<UserInOrganizationDbRow[]>

  getMemberUserIdsFromAllProjectsShardedWithUser(userId: Id, organizationId: Id): Promise<Id[]>

  getUserInviterInOrganization(userId: Id, organizationId: Id): PromiseLike<UserInOrganizationDbRow>

  getUsersInOrganizations(organizationIds: Id[], decorate?: QueryModifier): PromiseLike<UserInOrganizationDbRow[]>;
}
