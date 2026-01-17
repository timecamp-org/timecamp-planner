import { Id } from '../../common/identifier';
import {
  CreateListResult,
  MoveAllTasksInListResult,
  CopyListResult,
  ListIdsByTaskIds,
  UpdateListResult,
  GetProjectListsAndListsFollowersResult,
  AddListFollowerResult,
  RemoveListFollowerResult,
  RemoveListsFollowerResult,
  ListNamesMap,
  ListMap,
  ListOrderByProjectId,
  CopyListOptions,
  UpdateListJson,
  CreateListJson,
  GetListResult,
} from '../types';

import { RemoveProjectFollowerEventData } from '../../projects/types';
import { QueryModifier } from '../../../../../services/types';

export interface ListServiceInterface {
  createList(id: Id, listJson: CreateListJson): Promise<CreateListResult>

  updateList(id: Id, listJson: UpdateListJson, actorId?: Id): Promise<UpdateListResult>

  getList(id: Id): Promise<GetListResult>;

  getProjectListsAndListsFollowers(projectId: Id): Promise<GetProjectListsAndListsFollowersResult>

  addListFollower(listId: Id, userId: Id): Promise<AddListFollowerResult>

  removeListFollower(listId: Id, userId: Id): Promise<RemoveListFollowerResult>

  removeListsFollower(listIds: Id[], userId: Id, trx?: Transaction): Promise<RemoveListsFollowerResult>

  removeProjectListsFollower(params: RemoveProjectFollowerEventData): Promise<RemoveListsFollowerResult>

  /**
   * Moves all task from source list to the end of destination list.
   * Tasks are moved within one project.
   *
   * @param {Id} sourceListId
   * @param {Id} destinationListId
   * @returns {Promise<MoveAllTasksInListResult>}
   */
  moveAllTasksInList(sourceListId: Id, destinationListId: Id, actorId: Id): Promise<MoveAllTasksInListResult>

  doMoveAllTasksInList(trx: Transaction, sourceListId: Id, destinationListId: Id, actorId: Id): Promise<MoveAllTasksInListResult>

  /**
   * Copies taskList along with listFollowers and tasks
   * Tasks are copied with taskFollowers and tagsIds
   */
  copyListWithTasks(sourceListId: Id, userId: Id, projectId?: Id, name?: string, order?: number, newListId?: Id, options?: CopyListOptions, trx?: Transaction): Promise<CopyListResult>

  getListIdsByTaskIdsFromProjects(projectIds: Id[], decorate?: QueryModifier): Promise<ListIdsByTaskIds>

  getListNamesByOrganizationId(organizationId: Id, decorate?: QueryModifier): Promise<ListNamesMap>

  getOrganizationListsMapsByParameters(organizationId: Id, keys: Array<string>, decorate?: QueryModifier): Promise<Array<ListMap>>

  getProjectsLastListsOrder(projectIds: Id[], trx?: Transaction): Promise<ListOrderByProjectId>
}
