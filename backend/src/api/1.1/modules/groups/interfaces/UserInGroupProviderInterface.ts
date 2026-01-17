import { Id } from '../../common/identifier';
import { Dict } from '../../common/types';
import { UserInGroupDbRow } from '../../db/schema';

export interface UserInGroupProviderInterface {
  addUserToGroup(
    groupId: Id,
    userInOrganization: Id,
    trx?: Transaction
  ): PromiseLike<void>;

  updateUserInGroup(
    groupId: Id,
    userInOrganization: Id,
    trx?: Transaction
  ): PromiseLike<void>;

  removeUserFromGroup(
    groupId: Id,
    userInOrganization: Id,
    trx?: Transaction
  ): PromiseLike<void>;

  getUserInGroup(
    userInOrganization: Id,
    trx?: Transaction
  ): PromiseLike<UserInGroupDbRow>;

  getGroupUserIds(groupId: Id): PromiseLike<Id[]>;

  getGroupsPeople(organizationId: Id): PromiseLike<Dict<Id>>;
}
