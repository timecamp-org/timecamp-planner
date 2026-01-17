import { fromJS, List } from 'immutable';
import * as Constants from './constants';
import * as CurrentUserConstants from '../CurrentUserModel/constants';
import * as RequestModel from '../RequestModel/constants';
import * as TasksModelConstants from '../TasksModel/constants';
import * as ProjectsModelConstants from '../ProjectsModel/constants';
import * as AppModelConstants from '../AppModel/constants';
import * as NotificationsModelConstants from '../NotificationsModel/constants';
import { TaskListsState } from './types';
import { Reducer } from 'redux';
import { PayloadAction } from '../../../types';

const cleanInitialState: TaskListsState = fromJS({
  projectIdsByListIds: {},
  projectIdsByListIdsChangedAt: {},
  listIdsOrderByProject: {},
  listNames: {},
  listIsArchivedStatuses: {},
  tasksOrderByListId: {},
  listIdByTaskId: {},
  listIdByTaskIdChangedAt: {},
  listFollowers: {},
  listLimits: {},
});

const emptyList = List();

const reducer: Reducer<TaskListsState, PayloadAction> = (
  state: TaskListsState = cleanInitialState,
  action: PayloadAction
): TaskListsState => {
  switch (action.type) {
    case Constants.onCreateListSuccess: {
      const {
        id,
        name,
        isArchived = false,
        projectId,
        order,
      } = action.payload.taskList;
      return state
        .setIn(['projectIdsByListIds', id], projectId)
        .setIn(['listNames', id], name)
        .setIn(['listIsArchivedStatuses', id], isArchived)
        .setIn(['listIdsOrderByProject', projectId, id], order)
        .setIn(['listFollowers', id], emptyList);
    }

    case Constants.onUpdateListSuccess: {
      const {
        id,
        updatedFields: { name, isArchived },
      } = action.payload;
      return state
        .setIn(['listNames', id], name)
        .setIn(['listIsArchivedStatuses', id], isArchived);
    }

    case Constants.onUpdateListsOrder: {
      const { sourceProjectId, destinationProjectId, updatedOrders } =
        action.payload;
      let updatedState = state;
      updatedOrders.forEach((order, id) => {
        if (sourceProjectId === destinationProjectId) {
          updatedState = updatedState.setIn(
            ['listIdsOrderByProject', sourceProjectId, id],
            order
          );
        } else {
          updatedState = updatedState
            .setIn(['listIdsOrderByProject', destinationProjectId, id], order)
            .deleteIn(['listIdsOrderByProject', sourceProjectId, id])
            .setIn(['projectIdsByListIds', id], destinationProjectId);
        }
      });

      return updatedState;
    }

    case RequestModel.onFetchConversationViewDataSuccess:
    case RequestModel.onFetchProjectViewDataSuccess: {
      const {
        data: {
          normalizedListsData,
          listFollowers,
          tasksOrderByListId,
          listIdByTaskId,
          listsOrderByProjectId,
          listLimits,
        },
      } = action.payload;

      return state
        .set(
          'listNames',
          state.get('listNames').merge(normalizedListsData.get('names'))
        )
        .set(
          'listIsArchivedStatuses',
          state
            .get('listIsArchivedStatuses')
            .merge(normalizedListsData.get('isArchivedStatuses'))
        )
        .set(
          'projectIdsByListIds',
          state
            .get('projectIdsByListIds')
            .merge(normalizedListsData.get('projectIdsByListIds'))
        )
        .set('listFollowers', state.get('listFollowers').merge(listFollowers))
        .set(
          'tasksOrderByListId',
          state.get('tasksOrderByListId').mergeDeep(tasksOrderByListId)
        )
        .set(
          'listIdByTaskId',
          state.get('listIdByTaskId').mergeDeep(listIdByTaskId)
        )
        .set(
          'listIdsOrderByProject',
          state.get('listIdsOrderByProject').mergeDeep(listsOrderByProjectId)
        )
        .set('listLimits', state.get('listLimits').merge(listLimits));
    }

    case Constants.onSetCardLimit: {
      const { listId, limit } = action.payload;

      return state.setIn(['listLimits', listId], parseInt(limit));
    }

    case Constants.onUpdateListCardsLimitData: {
      const { taskListId, cardsLimit } = action.payload;

      return state.setIn(['listLimits', taskListId], parseInt(cardsLimit));
    }

    case Constants.onRemoveListCardsLimitData: {
      return state.deleteIn(['listLimits', action.payload.taskListId]);
    }

    case Constants.onPurgeTaskListsOrder: {
      const { listIds } = action.payload;
      return state.update('tasksOrderByListId', (tasksOrderByListId) =>
        tasksOrderByListId.filter((order, listId) => !listIds.includes(listId))
      );
    }

    case RequestModel.onFetchListTasksDataSuccess:
    case RequestModel.onFetchProjectTasksDataSuccess: {
      const { tasksOrderByListId, listIdByTaskId } = action.payload.data;

      return state
        .set(
          'tasksOrderByListId',
          state.get('tasksOrderByListId').mergeDeep(tasksOrderByListId)
        )
        .set(
          'listIdByTaskId',
          state.get('listIdByTaskId').mergeDeep(listIdByTaskId)
        );
    }

    case RequestModel.onFetchProjectListsDataSuccess: {
      const { normalizedListsData, listsOrderByProjectId, listFollowers } =
        action.payload.data;

      return state
        .set(
          'listNames',
          state.get('listNames').merge(normalizedListsData.get('names'))
        )
        .set(
          'listIsArchivedStatuses',
          state
            .get('listIsArchivedStatuses')
            .merge(normalizedListsData.get('isArchivedStatuses'))
        )
        .set(
          'projectIdsByListIds',
          state
            .get('projectIdsByListIds')
            .merge(normalizedListsData.get('projectIdsByListIds'))
        )
        .set('listFollowers', state.get('listFollowers').merge(listFollowers))
        .set(
          'listIdsOrderByProject',
          state.get('listIdsOrderByProject').mergeDeep(listsOrderByProjectId)
        );
    }

    case TasksModelConstants.onCreateTaskData: {
      const { taskListId, order, taskData } = action.payload;
      return state
        .setIn(['listIdByTaskId', taskData.id], taskListId)
        .setIn(['tasksOrderByListId', taskListId, taskData.id], order);
    }

    case TasksModelConstants.onFetchTaskDetailsSuccess: {
      const { taskData, taskId } = action.payload.data;
      return state.setIn(['listIdByTaskId', taskId], taskData.taskListId);
    }

    case TasksModelConstants.onUpdateTaskData: {
      const { taskListId, order, taskData } = action.payload;
      const oldListId = state.getIn(['listIdByTaskId', taskData.id]);
      let currentState = state;
      if (taskListId && taskListId !== oldListId) {
        currentState = currentState.deleteIn([
          'tasksOrderByListId',
          oldListId,
          taskData.id,
        ]);
      }
      // DO NOT update if value passed to action is undefined (accept null)
      return currentState
        .updateIn(['listIdByTaskId', taskData.id], (currentTaskListId) =>
          taskListId !== undefined ? taskListId : currentTaskListId
        )
        .updateIn(
          ['tasksOrderByListId', taskListId, taskData.id],
          (currentOrder) => (order !== undefined ? order : currentOrder)
        );
    }

    case Constants.onSetTaskOrdersInList: {
      const { sourceListId, destinationListId, updatedOrders } = action.payload;
      let currentState = state;
      updatedOrders.forEach((order, taskId) => {
        const prevTaskOrderInList = currentState.getIn([
          'tasksOrderByListId',
          sourceListId,
          taskId,
        ]);
        const isDestinationListIdDifferentFromSource =
          destinationListId && destinationListId !== sourceListId;

        if (isDestinationListIdDifferentFromSource) {
          currentState = currentState.deleteIn([
            'tasksOrderByListId',
            sourceListId,
            taskId,
          ]);
        }
        // Card can be moved while we're currently dragging it - if that happens then when we drop card it's sourceListId is not up to date - we need to collect listId from state and delete order in it to ensure there is no duplicates
        if (!prevTaskOrderInList) {
          const currentTaskListId = currentState.getIn([
            'listIdByTaskId',
            taskId,
          ]);
          currentState = currentState.deleteIn([
            'tasksOrderByListId',
            currentTaskListId,
            taskId,
          ]);
        }
        currentState = currentState
          .setIn(['tasksOrderByListId', destinationListId, taskId], order)
          .setIn(['listIdByTaskId', taskId], destinationListId);
      });

      return currentState;
    }

    case Constants.onAddUserToTaskListFollowersData:
    case Constants.onAddUserToTaskListFollowersSuccess: {
      const { listId, userId } = action.payload;

      const followers = state.getIn(['listFollowers', listId]);

      return state.setIn(
        ['listFollowers', listId],
        followers ? followers.push(userId) : List([userId])
      );
    }

    case Constants.onRemoveUserFromTaskListFollowersData:
    case Constants.onRemoveUserFromTaskListFollowersSuccess: {
      const { listId, userId } = action.payload;
      const userIdIndexInFollowersList = state
        .getIn(['listFollowers', listId])
        .indexOf(userId);
      return state.deleteIn([
        'listFollowers',
        listId,
        userIdIndexInFollowersList,
      ]);
    }

    case ProjectsModelConstants.onFollowerRemoveSuccess: {
      const { listsFollowerIds } = action.payload.data;
      return state.set(
        'listFollowers',
        state.get('listFollowers').merge(listsFollowerIds)
      );
    }

    case Constants.onCreateListData:
    case Constants.onUpdateListData: {
      const { id, order, isArchived, name, projectId } =
        action.payload.listEntity;

      const oldListProjectId = state.getIn(['projectIdsByListIds', id]);

      let modifiedState = state
        .setIn(['projectIdsByListIds', id], projectId)
        .setIn(['listNames', id], name)
        .setIn(['listIsArchivedStatuses', id], isArchived)
        .setIn(['listIdsOrderByProject', projectId, id], order);

      if (oldListProjectId !== projectId) {
        modifiedState = modifiedState.deleteIn([
          'listIdsOrderByProject',
          oldListProjectId,
          id,
        ]);
      }

      return modifiedState;
    }

    case Constants.onMoveAllTasksInListSuccess: {
      const { sourceListId } = action.payload;
      return state.deleteIn(['tasksOrderByListId', sourceListId]);
    }

    case Constants.onBatchProjectIdsByListIds: {
      const { projectIdsByListIds } = action.payload;
      return state.set(
        'projectIdsByListIds',
        state.get('projectIdsByListIds').merge(projectIdsByListIds)
      );
    }

    case Constants.onBatchListIdsByTaskIds: {
      const { listIdsByTaskIds } = action.payload;
      return state.set(
        'listIdByTaskId',
        state.get('listIdByTaskId').merge(listIdsByTaskIds)
      );
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return cleanInitialState;

    case NotificationsModelConstants.onUpdateNotificationData:
    case NotificationsModelConstants.onCreateNotificationData: {
      const { externalData } = action.payload;
      const taskId = externalData.get('taskId');
      const projectId = externalData.get('projectId');
      const listId = externalData.get('taskListId');
      let currentState = state;
      if (taskId && listId) {
        currentState = currentState.setIn(['listIdByTaskId', taskId], listId);
      }

      if (listId && projectId) {
        currentState = currentState.setIn(
          ['projectIdsByListIds', listId],
          projectId
        );
      }

      return currentState;
    }
    case NotificationsModelConstants.onBatchNotificationsData: {
      const { notificationsData, notificationsExternalData } = action.payload;
      let listIdByTaskId = state.get('listIdByTaskId');
      let listIdByTaskIdChangedAt = state.get('listIdByTaskIdChangedAt');
      let projectIdsByListIds = state.get('projectIdsByListIds');
      let projectIdsByListIdsChangedAt = state.get(
        'projectIdsByListIdsChangedAt'
      );

      notificationsData.valueSeq().forEach((notification) => {
        const externalData = notificationsExternalData.get(notification.id);
        const taskId = externalData.get('taskId');
        const listId = externalData.get('taskListId');
        const projectId = externalData.get('projectId');

        const listIdChangedAt = listIdByTaskIdChangedAt.get(taskId);
        if (
          taskId &&
          listId &&
          (!listIdChangedAt || listIdChangedAt < notification.creationTimestamp)
        ) {
          listIdByTaskId = listIdByTaskId.set(taskId, listId);
          listIdByTaskIdChangedAt = listIdByTaskIdChangedAt.set(
            taskId,
            notification.creationTimestamp
          );
        }

        const projectIdChangedAt = projectIdsByListIdsChangedAt.get(listId);
        if (
          listId &&
          projectId &&
          (!projectIdChangedAt ||
            projectIdChangedAt < notification.creationTimestamp)
        ) {
          projectIdsByListIds = projectIdsByListIds.set(listId, projectId);
          projectIdsByListIdsChangedAt = projectIdsByListIdsChangedAt.set(
            listId,
            notification.creationTimestamp
          );
        }
      });
      return state
        .set(
          'listIdByTaskId',
          state.get('listIdByTaskId').mergeDeep(listIdByTaskId)
        )
        .set(
          'projectIdsByListIds',
          state.get('projectIdsByListIds').mergeDeep(projectIdsByListIds)
        );
    }

    default: {
      return state;
    }
  }
};

export default reducer;
