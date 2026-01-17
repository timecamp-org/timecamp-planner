
import { Id } from '../../common/identifier';
import { QueryModifier } from '../../../../../services/types';
import { UserInProjectDbRow } from '../../db/schema';
import { Dict } from '../../common/types';

export interface UserInProjectProviderInterface {
  getUserProjectIds(organizationId: Id, userId: Id, decorate?: QueryModifier, trx?: Transaction): PromiseLike<Id[]>;
  getUserInProject(userId: Id, projectId: Id, trx?: Transaction): PromiseLike<UserInProjectDbRow>;
  checkIfUserIsProjectManagerOrOwner(userId: Id, projectId: Id, trx?: Transaction): PromiseLike<boolean>;
  getProjectPeople(projectId: Id, trx?: Transaction): PromiseLike<UserInProjectDbRow[]>;
  getProjectsPeople(projectIds: Id[], trx?: Transaction): PromiseLike<UserInProjectDbRow[]>
  getUsersInProjects(organizationId: Id, userIds: Id[], decorate?: QueryModifier, trx?: Transaction): PromiseLike<Dict<Id[]>>
  getUsersInProjectsFull(organizationId: Id, userIds: Id[], decorate?: QueryModifier, trx?: Transaction): PromiseLike<UserInProjectDbRow[]>
  removeUserFromProjects(userId: Id, projectIds: Id[], trx?: Transaction): PromiseLike<void>
}
