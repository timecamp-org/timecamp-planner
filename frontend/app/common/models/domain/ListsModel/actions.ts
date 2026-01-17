import * as C from './constants';
import { action } from 'typesafe-actions';
import { TaskListInterface, CreateListInterface } from './types';
import { Id } from '../../../utils/identifier';
import { Map, List } from 'immutable';
import { ActionResultInterface } from '../ActionResultModel';
import { EntityInterface } from '../EntityModel/types';

export const onCreateList = (data: CreateListInterface) =>
  action(C.onCreateList, data);

export const onCreateListSuccess = (taskList: TaskListInterface) =>
  action(C.onCreateListSuccess, { taskList });

export const onCreateListData = (listEntity: TaskListInterface) =>
  action(C.onCreateListData, { listEntity });

export const onUpdateListData = (listEntity: TaskListInterface) =>
  action(C.onUpdateListData, { listEntity });

export const onUpdateList = (id: Id, updatedFields: TaskListInterface) =>
  action(C.onUpdateList, { id, updatedFields });

export const onUpdateListSuccess = (
  id: Id,
  updatedFields: Partial<TaskListInterface>
) => action(C.onUpdateListSuccess, { id, updatedFields });

export const onMoveList = (
  listId: Id,
  selectedPosition: number,
  destinationProjectId?: Id
) => action(C.onMoveList, { listId, selectedPosition, destinationProjectId });

export const onUpdateListsOrder = (
  sourceProjectId: Id,
  destinationProjectId: Id,
  updatedOrders: Map<Id, number>
) =>
  action(C.onUpdateListsOrder, {
    sourceProjectId,
    destinationProjectId,
    updatedOrders,
  });

export const onSetTaskOrdersInList = (
  sourceListId: Id,
  destinationListId: Id,
  updatedOrders: Map<Id, number>
) =>
  action(C.onSetTaskOrdersInList, {
    sourceListId,
    destinationListId,
    updatedOrders,
  });

export const onAddUserToTaskListFollowers = (listId: Id, userId: Id) =>
  action(C.onAddUserToTaskListFollowers, { listId, userId });

export const onAddUserToTaskListFollowersSuccess = (listId: Id, userId: Id) =>
  action(C.onAddUserToTaskListFollowersSuccess, { listId, userId });

export const onAddUserToTaskListFollowersData = (listId: Id, userId: Id) =>
  action(C.onAddUserToTaskListFollowersData, { listId, userId });

export const onRemoveUserFromTaskListFollowers = (listId: Id, userId: Id) =>
  action(C.onRemoveUserFromTaskListFollowers, { listId, userId });

export const onRemoveUserFromTaskListFollowersSuccess = (
  listId: Id,
  userId: Id
) => action(C.onRemoveUserFromTaskListFollowersSuccess, { listId, userId });

export const onRemoveUserFromTaskListFollowersData = (listId: Id, userId: Id) =>
  action(C.onRemoveUserFromTaskListFollowersData, { listId, userId });

export const onCopyList = (listId: Id, newName: string = '') =>
  action(C.onCopyList, { listId, newName });

export const onMoveAllTasksInList = (sourceListId: Id, destinationListId: Id) =>
  action(C.onMoveAllTasksInList, { sourceListId, destinationListId });

export const onMoveAllTasksInListSuccess = (
  sourceListId: Id,
  destinationListId: Id
) => action(C.onMoveAllTasksInListSuccess, { sourceListId, destinationListId });

export const onBatchProjectIdsByListIds = (projectIdsByListIds: Map<Id, Id>) =>
  action(C.onBatchProjectIdsByListIds, { projectIdsByListIds });

export const onBatchListIdsByTaskIds = (listIdsByTaskIds: Map<Id, Id>) =>
  action(C.onBatchListIdsByTaskIds, { listIdsByTaskIds });

export const onPurgeTaskListsOrder = (listIds: List<Id>) =>
  action(C.onPurgeTaskListsOrder, { listIds });

export const onSetCardLimit = (listId: Id, limit?: number) =>
  action(C.onSetCardLimit, { listId, limit });

export const onSetCardLimitSuccess = (actionResult: ActionResultInterface) =>
  action(C.onSetCardLimitSuccess, actionResult);

export const onUpdateListCardsLimitData = (entity: EntityInterface) => {
  const { taskListId, cardsLimit } = entity.body;
  return action(C.onUpdateListCardsLimitData, {
    taskListId,
    cardsLimit,
  });
};

export const onRemoveListCardsLimitData = (entity: EntityInterface) => {
  const { taskListId } = entity.body;
  return action(C.onRemoveListCardsLimitData, {
    taskListId,
  });
};
