import { Id } from '../../common/identifier';
import { Dict } from '../../common/types';
import { GroupDbRow } from '../../db/schema';
import {
  AddUserToGroupResult,
  CreateGroupResult,
  DeleteGroupResult,
  RemoveUserFromGroupResult,
  UpdateGroupResult,
} from '../types';

export interface OrganizationGroupsServiceInterface {
  createGroup(
    organizationId: Id,
    name: string,
    slug: string
  ): PromiseLike<CreateGroupResult>;

  updateGroup(
    id: Id,
    name: string,
    slug: string
  ): PromiseLike<UpdateGroupResult>;

  deleteGroup(id: Id): PromiseLike<DeleteGroupResult>;

  getGroups(organizationId: Id): PromiseLike<GroupDbRow[]>;

  getGroupsPeople(organizationId: Id): PromiseLike<Dict<Id>>;

  addUserToGroup(groupId: Id, userId: Id): PromiseLike<AddUserToGroupResult>;

  removeUserFromGroup(
    groupId: Id,
    userId: Id
  ): PromiseLike<RemoveUserFromGroupResult>;

  getGroupUserIds(groupId: Id): PromiseLike<Id[]>;
}
