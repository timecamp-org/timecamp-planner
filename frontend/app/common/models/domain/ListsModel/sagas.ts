import { put, select, fork, takeEvery, cps } from 'redux-saga/effects';
import { Map, List } from 'immutable';
import omit from 'lodash/omit';
import generateId from '../../../utils/generate-pushid';
import handleError from '../../../utils/handleError';
import calculateOrder from '../../../utils/CalculateOrder';

import * as Actions from './actions';
import * as TasksModelActions from '../TasksModel/actions';
import * as TasksModelSelectors from '../TasksModel/selectors';
import * as Constants from './constants';
import * as Selectors from './selectors';
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';
import * as UsersSelectors from '../UsersModel/selectors/domain';

import { HeySpaceClient as client, UserTracker } from '../../../services';
import { PartialPayloadAction } from '../../../types';
import { TaskListInterface, CreateListInterface } from './types';
import { Id } from '../../../utils/identifier';
import makeActionResult from 'common/utils/makeActionResult';
import { ExtensionNamespace, RelationType } from '../ExtensionsModel/types';

const emptyMap = Map();

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onCreateList, onCreateList);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateList, onUpdateList);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onMoveList, onMoveList);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(
        Constants.onAddUserToTaskListFollowers,
        onAddUserToTaskListFollowers
      );
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(
        Constants.onRemoveUserFromTaskListFollowers,
        onRemoveUserFromTaskListFollowers
      );
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onCopyList, onCopyList);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onMoveAllTasksInList, onMoveAllTasksInList);
    });
  },
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onSetCardLimit, onSetCardLimit);
    });
  },
];

export function* onCreateList({
  payload: {
    id = generateId(),
    name,
    projectId,
    destinationListId,
    createBelowDestination = true,
    createAtTheBottom = false,
    createAtTheTop = false,
  },
}: PartialPayloadAction<CreateListInterface>) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createList,
        id,
        RequestStatus.LOADING
      )
    );

    const projectListIdsInOrder = yield select(
      Selectors.selectProjectListIdsInOrder,
      { projectId }
    );
    let indexToInsertAt = projectListIdsInOrder.indexOf(destinationListId);

    if (createAtTheBottom) {
      indexToInsertAt = projectListIdsInOrder.size;
    } else if (createAtTheTop) {
      indexToInsertAt = 0;
    } else if (
      (createBelowDestination && projectListIdsInOrder.size > 1) ||
      indexToInsertAt === -1
    ) {
      indexToInsertAt++;
    }

    const listsOrder = yield select(Selectors.selectListsOrderByProjectId, {
      projectId,
    });
    const updatedOrders = calculateOrder(id, indexToInsertAt, listsOrder);
    const order = updatedOrders.get(id);

    yield put(Actions.onUpdateListsOrder(null, projectId, updatedOrders));

    const newList: TaskListInterface = {
      id,
      name,
      projectId,
      order,
      isArchived: false,
    };
    yield put(Actions.onCreateListSuccess(newList));

    yield cps(client.restApiClient.createList, id, {
      ...newList,
      order,
      projectId,
    });
    UserTracker.track(UserTrackerEvent.spaceListCreated);

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createList,
        id,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createList,
        id,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onUpdateList({
  payload: { id, updatedFields },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateList,
        id,
        RequestStatus.LOADING
      )
    );

    const oldListData = yield select(Selectors.selectListData, { listId: id });
    const updatedList = {
      ...oldListData,
      ...updatedFields,
    };

    yield cps(client.restApiClient.updateList, id, updatedList);

    yield put(
      Actions.onUpdateListSuccess(id, omit(updatedList, ['projectId', 'order']))
    );
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateList,
        id,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateList,
        id,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onMoveList({
  payload: { listId, selectedPosition, destinationProjectId },
}: PartialPayloadAction) {
  try {
    const isArchived = yield select(Selectors.selectListIsArchived, {
      listId: listId,
    });
    if (isArchived) {
      return;
    }

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateList,
        listId,
        RequestStatus.LOADING
      )
    );

    const sourceProjectId = yield select(Selectors.selectProjectIdByListId, {
      listId,
    });
    destinationProjectId = destinationProjectId
      ? destinationProjectId
      : sourceProjectId;

    const listsOrder = yield select(Selectors.selectListsOrderByProjectId, {
      projectId: destinationProjectId,
    });
    const updatedOrders = calculateOrder(listId, selectedPosition, listsOrder);
    const order = updatedOrders.get(listId);

    yield put(
      Actions.onUpdateListsOrder(
        sourceProjectId,
        destinationProjectId,
        updatedOrders
      )
    );

    const requestPayload = {
      order,
      projectId:
        sourceProjectId !== destinationProjectId
          ? destinationProjectId
          : undefined,
    };

    yield cps(client.restApiClient.updateList, listId, requestPayload);

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateList,
        listId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateList,
        listId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onAddUserToTaskListFollowers({
  payload: { listId, userId },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.addUserToTaskListFollowers,
        listId,
        RequestStatus.LOADING
      )
    );
    yield put(Actions.onAddUserToTaskListFollowersSuccess(listId, userId));

    yield cps(client.restApiClient.addUserToTaskListFollowers, listId, userId);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.addUserToTaskListFollowers,
        listId,
        RequestStatus.SUCCESS
      )
    );
    UserTracker.track(UserTrackerEvent.followerAdded, { where: 'list' });
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.addUserToTaskListFollowers,
        listId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onRemoveUserFromTaskListFollowers({
  payload: { listId, userId },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.removeTaskListFollower,
        listId,
        RequestStatus.LOADING
      )
    );
    yield put(Actions.onRemoveUserFromTaskListFollowersSuccess(listId, userId));
    const taskIds = yield select(Selectors.selectTaskIdsInOrderByListId, {
      listId,
    });
    let tasksFollowerIds = emptyMap as Map<Id, List<Id>>;
    for (let taskIndex = 0; taskIndex < taskIds.size; taskIndex++) {
      const taskId = taskIds.get(taskIndex);
      const taskFollowers = yield select(
        TasksModelSelectors.selectTaskFollowerIds,
        { taskId }
      );
      tasksFollowerIds = tasksFollowerIds.set(
        taskId,
        taskFollowers.filter((followerId) => followerId !== userId)
      );
    }
    yield put(
      TasksModelActions.onRemoveUserFromTasksFollowers(tasksFollowerIds)
    );

    yield cps(client.restApiClient.removeTaskListFollower, listId, userId);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.removeTaskListFollower,
        listId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.removeTaskListFollower,
        listId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onCopyList({
  payload: { listId, newName },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.copyListWithTasks,
        listId,
        RequestStatus.LOADING
      )
    );

    const projectId = yield select(Selectors.selectProjectIdByListId, {
      listId,
    });
    const projectListIdsInOrder = yield select(
      Selectors.selectProjectListIdsInOrder,
      { projectId }
    );
    const listsOrder = yield select(Selectors.selectListsOrderByProjectId, {
      projectId,
    });

    const indexToInsertAt = projectListIdsInOrder.indexOf(listId) + 1;

    const newListId = generateId();
    const updatedOrders = calculateOrder(
      newListId,
      indexToInsertAt,
      listsOrder
    );
    const copiedListOrder = updatedOrders.get(newListId);

    yield put(Actions.onUpdateListsOrder(null, projectId, updatedOrders));

    // Rest list copying logic other than calculating order is handled on backend, we don't wait for response here because changes feed will populate copied list and all related data (tasks, tags etc)

    yield cps(
      client.restApiClient.copyListWithTasks,
      listId,
      newName,
      copiedListOrder,
      newListId
    );
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.copyListWithTasks,
        listId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.copyListWithTasks,
        listId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onMoveAllTasksInList({
  payload: { sourceListId, destinationListId },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.moveAllTasksInList,
        sourceListId,
        RequestStatus.LOADING
      )
    );

    yield cps(
      client.restApiClient.moveAllTasksInList,
      sourceListId,
      destinationListId
    );
    yield put(
      Actions.onMoveAllTasksInListSuccess(sourceListId, destinationListId)
    );
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.moveAllTasksInList,
        sourceListId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.moveAllTasksInList,
        sourceListId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onSetCardLimit({
  payload: { listId, limit },
}: PartialPayloadAction) {
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionRelation,
        listId,
        RequestStatus.LOADING
      )
    );

    const userId = yield select(UsersSelectors.selectCurrentUserId);
    yield put(
      Actions.onSetCardLimitSuccess(
        makeActionResult({
          isOk: true,
          code: 'onSetCardLimitSuccess',
          data: {
            listId,
            limit,
          },
        })
      )
    );

    yield cps(
      client.restApiClient.updateExtensionRelation,
      ExtensionNamespace.KANBAN_LIMITS,
      RelationType.CARDS_LIMIT,
      {
        userId,
        taskListId: listId,
        cardsLimit: limit,
      }
    );
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionRelation,
        listId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error, {
      listId,
      limit,
    });
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateExtensionRelation,
        listId,
        RequestStatus.FAILURE,
        error,
        {
          extensionNamespace: ExtensionNamespace.KANBAN_LIMITS,
        }
      )
    );
  }
}
