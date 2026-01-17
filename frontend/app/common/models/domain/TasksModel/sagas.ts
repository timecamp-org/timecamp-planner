import { defaultDebounceTime } from 'common/utils/debounceTimes';
import { i18n } from 'i18n';
import { fromJS, List, Map } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import { all, call, cps, delay, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import calculateOrder from '../../../utils/CalculateOrder';
import generateId from '../../../utils/generate-pushid';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';

import { Task } from './models';

import { batchActions } from 'redux-batched-actions';
import * as A from './actions';
import * as C from './constants';
import { allowedReactions } from './constants/taskReactionsColonFormat';
import { parseTaskRecurrency, parseTaskRecurrencyDependency } from './helpers';
import * as S from './selectors';
import { CopyCardOptionsInterface, TaskCreateSource, TaskInterface, TaskStatus } from './types';

import { getTaskRecordFromRestResponse } from 'common/utils/fetchResultToRecord';
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import * as ChecklistActions from '../ChecklistsModel/actions';
import * as FilesModelActions from '../FilesModel/actions';
import * as ListsModelActions from '../ListsModel/actions';
import * as ListsModelSagas from '../ListsModel/sagas';
import * as ListsModelSelectors from '../ListsModel/selectors';
import * as ProjectsModelActions from '../ProjectsModel/actions';
import { ProjectPeopleRole } from '../ProjectsModel/types';
import * as RequestModelSagas from '../RequestModel/sagas';
import * as UsersSelectors from '../UsersModel/selectors/domain';
import { TaskPeopleRole } from './types';

import calculateSourceIndexBySublistItemIndex from '../../../utils/CalculateSourceIndexBySublistItemIndex';
import { makeFilterId } from '../../component/FiltersModel/utils';
import * as EntityModelSelectors from '../EntityModel/selectors';
import { EntityType } from '../EntityModel/types';
import { ExtensionNamespace, RelationType, TargetType } from '../ExtensionsModel/types';
import * as MessagesModelConstants from '../MessagesModel/constants';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';

import { timestampToDate } from 'common/utils/date';
import { HeySpaceClient as client, UserTracker } from '../../../services';
import * as ExtensionsModelActions from '../ExtensionsModel/actions';
import { getCustomFieldsMap } from '../ExtensionsModel/utils';
import { selectProjectPeople } from '../ProjectsModel/selectors/domain';
import { onBatchRecurrenceDedependency, onSetTaskRecurrenceSuccess } from '../TaskRecurrenceModel/actions';
import { TaskRecurrenceSettings } from '../TaskRecurrenceModel/models';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';

import { AnyDict, Maybe, PartialPayloadAction } from 'common/types';
import { Id } from 'common/utils/identifier';
import endOfDay from 'date-fns/end_of_day';
import startOfDay from 'date-fns/start_of_day';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import * as PopUpAlertsModelActions from '../../component/PopUpAlertsModel/actions';
import { createUserIfNotExisting } from '../OrganizationsModel/sagas';
import { parsePeopleRoles } from '../RequestModel/dataParsers';
import { onFetchTaskTimeEstimate } from '../TaskTimeEstimateModel/sagas';
import { startDateEarlierThanDueDateErrorMessage } from './constants/humanMessages';

import saveFile from 'common/utils/saveFile';
import * as FilesSelectors from 'models/domain/FilesModel/selectors';
import * as TasksSelectors from 'models/domain/TasksModel/selectors';
const emptyList = List();
const emptyMap = Map();

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onTaskCreate, onTaskCreate);
    });
    yield fork(function* () {
      yield takeEvery(C.onCreateTaskInEmptyList, onCreateTaskInEmptyList);
    });
    yield fork(function* () {
      yield takeLatest(C.onTaskUpdate, onTaskUpdate);
    });
    yield fork(function* () {
      yield takeLatest(C.onChangeStatus, onChangeStatus);
    });
    yield fork(function* () {
      yield takeEvery(C.onChangeDueDate, onChangeDueDate);
    });
    yield fork(function* () {
      yield takeEvery(C.onChangeStartDate, onChangeStartDate);
    });
    yield fork(function* () {
      yield takeEvery(C.onResizeTaskTimePeriod, onResizeTaskTimePeriod);
    });
    yield fork(function* () {
      yield takeEvery(C.onMoveTaskTimespan, onMoveTaskTimespan);
    });
    yield fork(function* () {
      yield takeEvery(C.onAddToTaskPeople, onAddToTaskPeople);
    });
    yield fork(function* () {
      yield takeEvery(C.onRemoveFromTaskPeople, onRemoveFromTaskPeople);
    });
    yield fork(function* () {
      yield takeLatest(C.onArchiveTask, onArchiveTask);
    });
    yield fork(function* () {
      yield takeLatest(C.onUnarchiveTask, onUnarchiveTask);
    });
    yield fork(function* () {
      yield takeLatest(C.onCopyCard, onCopyCard);
    });
    yield fork(function* () {
      yield takeLatest(C.onChangeDescription, onChangeDescription);
    });
    yield fork(function* () {
      yield takeLatest(C.onChangeProgressEstimate, onChangeProgressEstimate);
    });
    yield fork(function* () {
      yield takeEvery(C.onMoveTask, onMoveTask);
    });
    yield fork(function* () {
      yield takeEvery(C.onMoveTaskInSections, onMoveTaskInSections);
    });
    yield fork(function* () {
      yield takeEvery(C.onCreateUserAndAddToSubscribers, onCreateUserAndAddToSubscribers);
    });
    yield fork(function* () {
      yield takeEvery(C.onAddFilesToTaskAttachments, onAddFilesToTaskAttachments);
    });
    yield fork(function* () {
      yield takeEvery(C.onAddFileToTaskAttachments, onAddFileToTaskAttachments);
    });
    yield fork(function* () {
      yield takeEvery(C.onDeleteTaskAttachment, onDeleteTaskAttachment);
    });
    yield fork(function* () {
      yield takeEvery(
        C.onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard,
        onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard,
      );
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchAllTaskAttachments, onFetchAllTaskAttachments);
    });
    yield fork(function* () {
      yield takeEvery(C.onFetchTaskDetails, onFetchTaskDetails);
    });
    yield fork(function* () {
      yield takeEvery(C.onAddUserToTaskFollowers, onAddUserToTaskFollowers);
    });
    yield fork(function* () {
      yield takeEvery(C.onRemoveUserFromTaskFollowers, onRemoveUserFromTaskFollowers);
    });
    yield fork(function* () {
      yield takeEvery(C.onAddTaskReaction, onAddTaskReaction);
    });
    yield fork(function* () {
      yield takeEvery(C.onRemoveTaskReaction, onRemoveTaskReaction);
    });
    yield fork(function* () {
      yield takeEvery(C.onSetUserLatestTaskVisitDate, onSetUserLatestTaskVisitDate);
    });
    yield fork(function* () {
      yield takeEvery(MessagesModelConstants.onCreateMessageAttachmentsIds, onBatchTaskFileIds);
    });
    yield fork(function* () {
      yield takeEvery(C.onSetTaskPriority, onSetTaskPriority);
    });
  },
];

export function* onTaskCreate({
  payload: {
    taskFields,
    destinationTaskId,
    createBelowDestination = true,
    createAtTheEnd = false,
    createAtTheBeginning = false,
    listId,
    taskPeople = emptyMap,
    taskFollowerIds = emptyList,
    taskCreateSource,
  },
}: PartialPayloadAction) {
  const id = taskFields.id || generateId();
  try {
    // Initialize new task with minimum data needed in redux
    const rawTaskFields: TaskInterface = {
      id,
      name: '',
      ...taskFields,
    };

    yield put(onSetRequestStatus(RequestTypesConstants.createTask, id, RequestStatus.LOADING));

    // Extract normalized task fields and other fields
    const { projectId, description, ...sanitizedTaskFields } = rawTaskFields;

    const sectionTaskIdsInOrder = yield select(ListsModelSelectors.selectTaskIdsInOrderByListId, { listId });
    let index = sectionTaskIdsInOrder.indexOf(destinationTaskId);

    if (createAtTheEnd) {
      index = sectionTaskIdsInOrder.size;
    } else if (createAtTheBeginning) {
      index = 0;
    } else if (createBelowDestination) {
      index++;
    }

    const task = new Task(sanitizedTaskFields);

    let people = emptyList as List<Id>;
    let peopleRole = emptyMap as Map<Id, TaskPeopleRole>;

    taskPeople.forEach((role, userId) => {
      people = people.push(userId);
      peopleRole = peopleRole.set(userId, role);
    });

    const listTasksOrder = yield select(ListsModelSelectors.selectAllTasksOrderByListId, { listId });
    const updatedOrders = yield call(calculateOrder, id, index, listTasksOrder);
    const order = updatedOrders.get(id);

    const actionsBatch = [];
    actionsBatch.push(
      A.onTaskCreateSuccess(
        makeActionResult({
          isOk: true,
          code: 'onTaskCreateSuccess',
          data: {
            task,
            people,
            peopleRole,
            taskFollowerIds,
            index: order,
            taskId: task.id,
            projectId: projectId,
            description: description || '',
            sourceMessageId: rawTaskFields.sourceMessageId,
          },
        }),
      ),
    );

    actionsBatch.push(ListsModelActions.onSetTaskOrdersInList(null, listId, updatedOrders));
    yield put(batchActions(actionsBatch));

    yield cps(client.restApiClient.createTask, rawTaskFields.id, {
      projectId,
      name: rawTaskFields.name,
      description: description || '',
      order,
      taskListId: listId,
      sourceMessageId: rawTaskFields.sourceMessageId,
      isArchived: rawTaskFields.isArchived,
      status: TaskStatus.ACTIVE,
      progress: rawTaskFields.progress,
      dueDate: rawTaskFields.dueDate,
      startDate: rawTaskFields.startDate,
    });

    yield all(
      Object.keys(peopleRole.toJS()).map((userId) =>
        cps(client.restApiClient.addUserToTaskPeople, task.id, userId, peopleRole.get(userId)),
      ),
    );

    yield all(
      taskFollowerIds.toJS().map((userId) => cps(client.restApiClient.addUserToTaskFollowers, task.id, userId)),
    );

    const projectPeople = yield select(selectProjectPeople, { projectId });

    for (let i = 0; i < people.size; i++) {
      const userId = people.get(i);
      if (!projectPeople.includes(userId)) {
        yield cps(client.restApiClient.addUserToProjectPeople, projectId, userId, ProjectPeopleRole.MEMBER);
      }
    }
    UserTracker.track(UserTrackerEvent.cardCreated, {
      source: rawTaskFields.sourceMessageId ? TaskCreateSource.CHAT : taskCreateSource,
    });

    yield put(onSetRequestStatus(RequestTypesConstants.createTask, id, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { taskFields });
    yield put(onSetRequestStatus(RequestTypesConstants.createTask, id, RequestStatus.FAILURE, error));
  }
}

export function* onTaskUpdate({ payload: { taskId, taskFields = {}, ignoreDebounce = false } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateTask, taskId, RequestStatus.LOADING));

    if (!ignoreDebounce) {
      yield delay(defaultDebounceTime);
    }

    if (taskFields.progress === 0) {
      taskFields.status = TaskStatus.ACTIVE;
    } else if (taskFields.progress === 100) {
      taskFields.status = TaskStatus.COMPLETED;
    }

    const taskData = {
      name: taskFields.name,
      description: taskFields.description,
      sourceMessageId: taskFields.source,
      isArchived: taskFields.isArchived,
      status: taskFields.status,
      progress: taskFields.progress,
      dueDate: getTaskDate(taskFields.dueDate),
      startDate: getTaskDate(taskFields.startDate),
      taskPriorityType: taskFields.taskPriorityType,
    };
    const { dueDate, startDate } = taskData;

    yield cps(client.restApiClient.updateTask, taskId, taskData);

    yield put(onSetRequestStatus(RequestTypesConstants.updateTask, taskId, RequestStatus.SUCCESS));

    trackTaskUpdate(taskFields);
  } catch (error) {
    handleError(error, { taskId, taskFields });
    yield put(onSetRequestStatus(RequestTypesConstants.updateTask, taskId, RequestStatus.FAILURE, error));
  }
}

function trackTaskUpdate(taskFields: TaskInterface) {
  Object.keys(taskFields)
    .filter((field) => !['isArchived', 'status'].includes(field))
    .forEach((field) => UserTracker.track(UserTrackerEvent.cardEdited, { what: field }));

  if (taskFields.progress === 100) {
    UserTracker.track(UserTrackerEvent.cardEdited, { what: 'complete' });
  }
}

function getTaskDate(date: number): Maybe<Date | number> {
  return date ? timestampToDate(date) : date;
}

function* onChangeStatus({ payload: { taskId, status, ignoreDebounce = false } }: PartialPayloadAction) {
  try {
    let progress;
    if (status === TaskStatus.COMPLETED) {
      progress = 100;
    } else {
      progress = 0;
    }
    yield put(A.onTaskUpdate(taskId, { status, progress }, ignoreDebounce));
  } catch (error) {
    handleError(error, { taskId, status });
  }
}

function* onChangeDueDate({ payload: { taskId, dueDate, ignoreDebounce = false } }: PartialPayloadAction) {
  try {
    const startDate = yield select(S.selectTaskStartDate, { taskId });
    const isValid = yield call(onValidateTask, { startDate, dueDate });
    if (!isValid) {
      return;
    }

    yield put(A.onTaskUpdate(taskId, { dueDate }, ignoreDebounce));
  } catch (error) {
    handleError(error, { taskId, dueDate, ignoreDebounce });
  }
}

function* onChangeStartDate({ payload: { taskId, startDate, ignoreDebounce = false } }: PartialPayloadAction) {
  try {
    const dueDate = yield select(S.selectTaskDueDate, { taskId });
    const isValid = yield call(onValidateTask, { startDate, dueDate });
    if (!isValid) {
      return;
    }

    yield put(A.onTaskUpdate(taskId, { startDate }, ignoreDebounce));
  } catch (error) {
    handleError(error, { taskId, startDate, ignoreDebounce });
  }
}

function* onResizeTaskTimePeriod({
  payload: { taskId, timestamp, edge, taskEndTime, taskStartTime },
}: PartialPayloadAction) {
  try {
    const currentDueDate = (yield select(S.selectTaskDueDate, { taskId })) ?? taskEndTime;
    const currentStartDate = (yield select(S.selectTaskStartDate, { taskId })) ?? taskStartTime;
    let newStartDate;
    let newDueDate;

    if (edge === 'left') {
      newDueDate = currentDueDate || endOfDay(currentStartDate).getTime();
      newStartDate = timestamp;
    } else {
      newStartDate = currentStartDate || startOfDay(currentDueDate).getTime();
      newDueDate = timestamp;
    }

    const isValid = yield call(onValidateTask, {
      startDate: newStartDate,
      dueDate: newDueDate,
    });
    if (!isValid) {
      return;
    }

    const taskDates = { startDate: newStartDate, dueDate: newDueDate };
    yield put(A.onTaskUpdate(taskId, taskDates));
  } catch (error) {
    handleError(error);
  }
}

function* onMoveTaskTimespan({
  payload: { taskId, startDate, ignoreDebounce = false, taskStartTime, taskEndTime },
}: PartialPayloadAction) {
  try {
    const currentDueDate = (yield select(S.selectTaskDueDate, { taskId })) ?? taskEndTime;
    const currentStartDate = (yield select(S.selectTaskStartDate, { taskId })) ?? taskStartTime;
    const isAllDayTask = !currentDueDate || !currentStartDate;

    let newStartDate = startDate;
    let newDueDate;

    if (isAllDayTask) {
      newStartDate = startOfDay(startDate).getTime();
      newDueDate = endOfDay(startDate).getTime();
    } else {
      const timeDelta = startDate - currentStartDate;
      newDueDate = currentDueDate + timeDelta;
    }

    const isValid = yield call(onValidateTask, {
      startDate: newStartDate,
      dueDate: newDueDate,
    });
    if (!isValid) {
      return;
    }

    yield put(A.onTaskUpdate(taskId, { startDate: newStartDate, dueDate: newDueDate }, ignoreDebounce));
  } catch (error) {
    handleError(error, { taskId, startDate, ignoreDebounce });
  }
}

function* onValidateTask(fields: Partial<TaskInterface>) {
  const { dueDate, startDate } = fields;
  if (dueDate && startDate && startDate > dueDate) {
    yield put(
      PopUpAlertsModelActions.onAddAlert({
        humanMessage: startDateEarlierThanDueDateErrorMessage,
      }),
    );
    return false;
  }
  return true;
}

function* onAddToTaskPeople({ payload: { taskId, userId, role, userIds } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToTaskPeople, taskId, RequestStatus.LOADING));

    const taskPeople = yield select(S.selectTaskPeople, { taskId });
    const taskPeopleRole = yield select(S.selectTaskPeopleRole, { taskId });
    const projectId = yield select(S.selectProjectIdByTaskId, { taskId });

    if (taskPeople.includes(userId)) {
      const updatedPeopleRole = taskPeopleRole.set(userId, role);
      yield put(A.onUpdateTaskPeopleRole(taskId, updatedPeopleRole));

      yield cps(client.restApiClient.updateTaskPeopleRole, taskId, userId, role);
    } else {
      const updatedPeople = taskPeople.push(userId);
      const updatedPeopleRole = taskPeopleRole.set(userId, role);

      // add user to project as collaborator
      if (projectId) {
        const projectPeople = yield select(selectProjectPeople, { projectId });
        if (projectPeople.indexOf(userId) === -1) {
          yield put(ProjectsModelActions.onMemberAdd(projectId, userId, ProjectPeopleRole.MEMBER));
        }
      }

      yield put(A.onUpdateTaskPeopleIds(taskId, updatedPeople));
      yield put(A.onUpdateTaskPeopleRole(taskId, updatedPeopleRole));

      yield cps(client.restApiClient.addUserToTaskPeople, taskId, userId, role);

      UserTracker.track(UserTrackerEvent.cardEdited, { what: 'assignee' });
      UserTracker.track(UserTrackerEvent.followerAdded, { where: 'task' });
    }

    yield put(onSetRequestStatus(RequestTypesConstants.addUserToTaskPeople, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToTaskPeople, taskId, RequestStatus.FAILURE, error));
    handleError(error, { taskId, userId, role });
  }
}

function* onRemoveFromTaskPeople({ payload: { taskId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskPeopleRole, taskId, RequestStatus.LOADING));

    const taskPeople = yield select(S.selectTaskPeople, { taskId });
    const taskPeopleRole = yield select(S.selectTaskPeopleRole, { taskId });
    const index = taskPeople.indexOf(userId);

    if (index !== -1) {
      const updatedPeople = taskPeople.remove(index);
      const updatedPeopleRole = taskPeopleRole.remove(userId);

      yield put(A.onUpdateTaskPeopleIds(taskId, updatedPeople));
      yield put(A.onUpdateTaskPeopleRole(taskId, updatedPeopleRole));

      yield cps(client.restApiClient.removeTaskPeopleRole, taskId, userId);

      UserTracker.track(UserTrackerEvent.cardEdited, { what: 'assignee' });
    } else {
      // do nothing, user is not in task people
    }
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskPeopleRole, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { taskId, userId });
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskPeopleRole, taskId, RequestStatus.FAILURE, error));
  }
}

function* onAddUserToTaskFollowers({ payload: { taskId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToTaskFollowers, taskId, RequestStatus.LOADING));

    const taskFollowers = yield select(S.selectTaskFollowerIds, { taskId });
    const projectId = yield select(S.selectProjectIdByTaskId, { taskId });

    if (taskFollowers.includes(userId)) {
      // do nothing, user is already in task followers
    } else {
      const updatedFollowers = taskFollowers.push(userId);

      // add user to project as collaborator
      if (projectId) {
        const projectPeople = yield select(selectProjectPeople, { projectId });
        if (projectPeople.indexOf(userId) === -1) {
          yield put(ProjectsModelActions.onMemberAdd(projectId, userId, ProjectPeopleRole.MEMBER));
        }
      }

      yield put(
        A.onAddUserToTaskFollowersSuccess(
          makeActionResult({
            isOk: true,
            code: 'onAddUserToTaskFollowersSuccess',
            data: { taskId, taskFollowerIds: updatedFollowers },
          }),
        ),
      );

      yield cps(client.restApiClient.addUserToTaskFollowers, taskId, userId);

      UserTracker.track(UserTrackerEvent.followerAdded, { where: 'task' });
    }
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToTaskFollowers, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { taskId, userId });
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToTaskFollowers, taskId, RequestStatus.FAILURE, error));
  }
}

function* onRemoveUserFromTaskFollowers({ payload: { taskId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskFollower, taskId, RequestStatus.LOADING));

    const taskFollowers = yield select(S.selectTaskFollowerIds, { taskId });
    if (!taskFollowers.includes(userId)) {
      // do nothing, user is not in task Followers
    } else {
      const updatedFollowers = taskFollowers.filter((followerId) => followerId !== userId);

      yield put(
        A.onRemoveUserFromTaskFollowersSuccess(
          makeActionResult({
            isOk: true,
            code: 'onRemoveUserFromTaskFollowersSuccess',
            data: { taskId, taskFollowerIds: updatedFollowers },
          }),
        ),
      );

      yield cps(client.restApiClient.removeTaskFollower, taskId, userId);
    }
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskFollower, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { taskId, userId });
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskFollower, taskId, RequestStatus.FAILURE, error));
  }
}

function* onArchiveTask({ payload: { taskId } }: PartialPayloadAction) {
  try {
    yield put(A.onTaskUpdate(taskId, { isArchived: true }, true));
  } catch (error) {
    handleError(error, { taskId });
  }
}

function* onUnarchiveTask({ payload: { taskId } }: PartialPayloadAction) {
  try {
    yield put(A.onTaskUpdate(taskId, { isArchived: false }, true));
  } catch (error) {
    handleError(error, { taskId });
  }
}

function* onCopyCard({ payload: { taskId, newName, options } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.copyTask, taskId, RequestStatus.LOADING));
    const taskListId = yield select(ListsModelSelectors.selectListIdByTaskId, {
      taskId,
    });
    // select all tasks orders (even archived ones) to prevent falling into duplicated order trap
    const listTasksOrder = yield select(ListsModelSelectors.selectAllTasksOrderByListId, { listId: taskListId });

    const sortedTaskIds = listTasksOrder
      .sort((a, b) => a - b)
      .keySeq()
      .toList();

    const indexToInsertAt = sortedTaskIds.indexOf(taskId) + 1;

    const newTaskId = generateId();
    const updatedOrders = calculateOrder(newTaskId, indexToInsertAt, listTasksOrder);
    const newOrder = updatedOrders.get(newTaskId);

    yield put(ListsModelActions.onSetTaskOrdersInList(null, taskListId, updatedOrders));

    let newTaskName = newName;
    if (!newName) {
      newTaskName = yield select(S.selectTaskName, { taskId });
      newTaskName = `${newTaskName} COPY`;
    }

    const copyOptions: CopyCardOptionsInterface = {
      ...C.DEFAULT_COPY_CARD_OPTIONS,
      ...options,
    };

    yield cps(client.restApiClient.copyTask, taskId, newTaskName, newOrder, newTaskId, copyOptions);
    yield put(onSetRequestStatus(RequestTypesConstants.copyTask, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.copyTask, taskId, RequestStatus.FAILURE, error));
    handleError(error, { taskId });
  }
}

function* onChangeDescription({ payload: { taskId, description } }: PartialPayloadAction) {
  try {
    yield put(A.onTaskUpdate(taskId, { description }));
  } catch (error) {
    handleError(error, { taskId });
  }
}

function* onChangeProgressEstimate({
  payload: { taskId, progressEstimate, ignoreDebounce = false, debounceTimeout = defaultDebounceTime },
}: PartialPayloadAction) {
  try {
    yield put(A.onSetIsWaitingToUpdateProgress(true));
    if (!ignoreDebounce) {
      yield delay(debounceTimeout);
    }
    yield put(A.onSetIsWaitingToUpdateProgress(false));

    yield cps(client.restApiClient.updateTask, taskId, {
      status: progressEstimate === 100 ? TaskStatus.COMPLETED : TaskStatus.ACTIVE,
      progress: progressEstimate,
    });
  } catch (error) {
    handleError(error, { taskId });
  }
}

function* onMoveTask({
  payload: {
    sourceTaskId,
    destinationTaskId,
    destinationListId,
    sourceProjectId,
    destinationProjectId,
    moveBelowDestination = false,
  },
}: PartialPayloadAction) {
  try {
    const sourceListId = yield select(ListsModelSelectors.selectListIdByTaskId, { taskId: sourceTaskId });
    if (!destinationListId) {
      destinationListId = yield select(ListsModelSelectors.selectListIdByTaskId, { taskId: destinationTaskId });
    }

    const sourceListTasksOrder = yield select(ListsModelSelectors.selectTaskIdsInOrderByListId, {
      listId: sourceListId,
    });
    const destinationListTasksOrder = yield select(ListsModelSelectors.selectTaskIdsInOrderByListId, {
      listId: destinationListId,
    });

    const sourceTaskIndex = sourceListTasksOrder.indexOf(sourceTaskId);
    const destinationTaskIndex = destinationTaskId ? destinationListTasksOrder.indexOf(destinationTaskId) : 0;

    if (sourceProjectId === destinationProjectId) {
      yield call(onMoveTaskInSections, {
        payload: {
          taskId: sourceTaskId,
          sourceListTaskIndex: sourceTaskIndex,
          destinationListTaskIndex: destinationTaskIndex,
          sourceListId,
          destinationListId,
          destinationProjectId,
        },
      });
    } else {
      // @ts-ignore
      yield call(RequestModelSagas.onFetchProjectViewData, {
        payload: { projectId: destinationProjectId },
      });
      const destinationProjectSections = yield select(ListsModelSelectors.selectProjectNotArchivedListIdsInOrder, {
        projectId: destinationProjectId,
      });
      if (destinationProjectSections.size > 0) {
        destinationListId = destinationProjectSections.first();
      } else {
        destinationListId = generateId();
        yield call(ListsModelSagas.onCreateList, {
          payload: {
            id: destinationListId,
            name: 'Section',
            projectId: destinationProjectId,
          },
        });
      }

      yield put(
        A.onMoveTaskSuccess(
          makeActionResult({
            isOk: true,
            code: 'onMoveTaskSuccess',
            data: { projectId: destinationProjectId, taskId: sourceTaskId },
          }),
        ),
      );

      yield call(onMoveTaskInSections, {
        payload: {
          taskId: sourceTaskId,
          sourceListTaskIndex: sourceTaskIndex,
          destinationListTaskIndex: destinationTaskIndex,
          sourceListId,
          destinationListId,
        },
      });
    }
  } catch (error) {
    handleError(error, {
      sourceTaskId,
      destinationTaskId,
      sourceProjectId,
      destinationProjectId,
      moveBelowDestination,
    });
  }
}

function* onMoveTaskInSections({
  payload: {
    taskId,
    sourceListTaskIndex,
    destinationListTaskIndex,
    sourceListId,
    destinationListId,
    destinationProjectId,
  },
}: PartialPayloadAction) {
  let requestPayload = {};
  try {
    const isArchived = yield select(S.selectIsTaskArchived, { taskId });
    if (isArchived) {
      return;
    }

    const sourceProjectId = yield select(ListsModelSelectors.selectProjectIdByListId, { listId: sourceListId });
    if (!destinationProjectId) {
      destinationProjectId = yield select(ListsModelSelectors.selectProjectIdByListId, { listId: destinationListId });
    }

    if (!destinationListId) {
      destinationListId = generateId();
      yield call(ListsModelSagas.onCreateList, {
        payload: {
          id: destinationListId,
          name: 'Section',
          projectId: destinationProjectId,
        },
      });
    }

    const currentUserId = yield select(UsersSelectors.selectCurrentUserId);
    const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.KANBAN, destinationProjectId);
    const taskIds = yield select(ListsModelSelectors.selectFilteredTaskIdsByListId, {
      listId: destinationListId,
      projectId: destinationProjectId,
    });
    const filteredTaskIds = yield select(ListsModelSelectors.selectFilteredTaskIdsByListId, {
      listId: destinationListId,
      filterId,
      projectId: destinationProjectId,
    });

    const indexToInsertAt = calculateSourceIndexBySublistItemIndex(
      taskId,
      destinationListTaskIndex,
      taskIds,
      filteredTaskIds,
    );

    yield put(onSetRequestStatus(RequestTypesConstants.updateTask, taskId, RequestStatus.LOADING));
    const destinationListTasksOrder = yield select(ListsModelSelectors.selectAllTasksOrderByListId, {
      listId: destinationListId,
    });
    const updatedOrders = calculateOrder(taskId, indexToInsertAt, destinationListTasksOrder);
    const order = updatedOrders.get(taskId);
    yield put(ListsModelActions.onSetTaskOrdersInList(sourceListId, destinationListId, updatedOrders));

    requestPayload = {
      order,
      taskListId: sourceListId !== destinationListId ? destinationListId : undefined,
      projectId: sourceProjectId !== destinationProjectId ? destinationProjectId : undefined,
    };

    yield cps(client.restApiClient.updateTask, taskId, requestPayload);
    yield put(onSetRequestStatus(RequestTypesConstants.updateTask, taskId, RequestStatus.SUCCESS));
    UserTracker.track(UserTrackerEvent.cardEdited, {
      what: 'position-changed',
    });
  } catch (error) {
    handleError(error, {
      taskId,
      sourceListTaskIndex,
      destinationListTaskIndex,
      sourceListId,
      destinationListId,
      ...requestPayload,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.updateTask, taskId, RequestStatus.FAILURE, error));
  }
}

function* onCreateUserAndAddToSubscribers({ payload: { taskId, email, role, userId } }: PartialPayloadAction) {
  try {
    userId = yield call(createUserIfNotExisting, email, userId);
    yield put(A.onAddToTaskPeople(taskId, userId, role));
  } catch (error) {
    handleError(error, {
      taskId,
      email,
      role,
      userId,
    });
  }
}

export function* onFetchAllTaskAttachments({ payload: { taskId } }: PartialPayloadAction) {
  try {
    const fileIds = yield select((state) =>
      TasksSelectors.selectSortedTaskAttachmentsIds(state, {
        taskId,
      }),
    );
    const files = yield select((state) =>
      FilesSelectors.selectFiles(state, {
        fileIds,
      }),
    );

    const promises = files.map(
      (file) =>
        new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            saveFile(blob, file.name);
            resolve(response.status);
          } catch (error) {
            reject(error);
          }
        }),
    );
    yield call(async () => await Promise.allSettled(promises));
  } catch (error) {
    handleError(error);
  }
}

export function* onAddFilesToTaskAttachments({ payload: { files, taskId } }: PartialPayloadAction) {
  yield put(FilesModelActions.onQueueFilesAndStartUploading(files, taskId, taskId, A.onAddFileToTaskAttachments));
}

export function* onAddFileToTaskAttachments({ payload: { fileId, taskId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addTaskAttachment, taskId, RequestStatus.LOADING));
    yield put(A.onAddFileToTaskAttachmentsSuccess(fileId, taskId));

    yield cps(client.restApiClient.addTaskAttachment, taskId, fileId);
    yield put(onSetRequestStatus(RequestTypesConstants.addTaskAttachment, taskId, RequestStatus.SUCCESS));
    UserTracker.track(UserTrackerEvent.cardEdited, {
      what: 'attachment-added',
    });
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.addTaskAttachment, taskId, RequestStatus.FAILURE, error));
    // TODO: failure
  }
}

export function* onDeleteTaskAttachment({ payload: { fileId, taskId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskAttachment, taskId, RequestStatus.LOADING));
    yield put(A.onDeleteTaskAttachmentSuccess(fileId, taskId));

    yield cps(client.restApiClient.removeTaskAttachment, taskId, fileId);
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskAttachment, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.removeTaskAttachment, taskId, RequestStatus.FAILURE, error));
    // TODO: failure
  }
}

export function* onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard({
  payload: { spaceId, listId, userId, cardName },
}: PartialPayloadAction) {
  try {
    const currentUserId: Id = yield select(UsersSelectors.selectCurrentUserId);
    let destinationSpaceId = spaceId;
    let destinationListId = listId;
    if (!spaceId) {
      destinationSpaceId = generateId();
      let spacePeople = List().push(currentUserId);
      if (userId) {
        spacePeople = spacePeople.push(userId);
      }
      yield put(
        ProjectsModelActions.onProjectCreate(
          {
            id: destinationSpaceId,
            name: 'New project',
          },
          spacePeople as List<Id>,
        ),
      );
    }

    if (!listId) {
      destinationListId = generateId();
      yield call(ListsModelSagas.onCreateList, {
        payload: {
          id: destinationListId,
          name: 'New list',
          projectId: destinationSpaceId,
        },
      });
    } else {
      yield call(RequestModelSagas.onFetchListTasksData, {
        payload: { listId: destinationListId },
      });
    }

    let taskPeople = emptyMap as Map<Id, TaskPeopleRole>;
    let taskFollowerIds = emptyList as List<Id>;

    taskFollowerIds = taskFollowerIds.push(currentUserId);
    if (userId) {
      taskPeople = taskPeople.set(userId, TaskPeopleRole.ASSIGNEE);
      if (userId !== currentUserId) {
        taskFollowerIds = taskFollowerIds.push(userId);
      }
    }

    yield put(
      A.onTaskCreate(
        {
          id: generateId(),
          name: cardName,
          projectId: destinationSpaceId,
        },
        null,
        false,
        true,
        false,
        destinationListId,
        taskPeople,
        taskFollowerIds,
      ),
    );
  } catch (error) {
    handleError(error);
  }
}

export function* onFetchTaskDetails({ payload: { taskId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getTaskDetails, taskId, RequestStatus.LOADING));

    const result = yield cps(client.restApiClient.getTaskDetails, taskId);

    let taskData;
    let taskDescription;
    let taskAttachments = emptyList;
    let projectId;
    let taskFollowerIds = emptyList;
    let taskPeopleIds = emptyList;
    let taskPeopleRole = emptyMap;
    let taskTagIds = emptyMap;

    const actionsBatch = [];
    if (result) {
      if (!isEmpty(result.task)) {
        taskData = getTaskRecordFromRestResponse(result.task);
        taskDescription = result.task.description;
        projectId = result.task.projectId; // eslint-disable-line
      }
      if (!isEmpty(result.attachments)) {
        actionsBatch.push(FilesModelActions.onBatchFilesData(result.attachments));
        taskAttachments = List(result.attachments.map((file) => file.id));
      }
      if (!isEmpty(result.followers)) {
        taskFollowerIds = List(result.followers);
      }
      if (!isEmpty(result.people)) {
        const { peopleIds, peopleRole } = parsePeopleRoles<TaskPeopleRole>(result.people);
        taskPeopleIds = peopleIds;
        taskPeopleRole = peopleRole;
      }
      if (!isEmpty(result.checklist)) {
        actionsBatch.push(ChecklistActions.onBatchChecklistItemsData(result.checklist, taskId));
      }
      if (!isEmpty(result.checklistItemsAssignees)) {
        actionsBatch.push(ChecklistActions.onBatchChecklistItemsAssignees(result.checklistItemsAssignees));
      }
      if (!isEmpty(result.tasksTagsIds)) {
        taskTagIds = fromJS(result.tasksTagsIds);
      }
      if (!isEmpty(result.customFields)) {
        const customFields = getCustomFieldsMap(result.customFields, TargetType.TASK);
        actionsBatch.push(ExtensionsModelActions.onBatchCustomFieldValues(customFields));
      }
      if (!isEmpty(result.extensionsData)) {
        const taskRecurrencySettings = parseTaskRecurrency(result.extensionsData);
        if (taskRecurrencySettings) {
          actionsBatch.push(onSetTaskRecurrenceSuccess(new TaskRecurrenceSettings(fromJS(taskRecurrencySettings))));
        }

        const taskRecurrencyDependency = parseTaskRecurrencyDependency(result.extensionsData);
        if (taskRecurrencyDependency) {
          actionsBatch.push(onBatchRecurrenceDedependency(taskRecurrencyDependency));
        }
      }
      if (!isEmpty(result.parentList)) {
        actionsBatch.push(ListsModelActions.onCreateListData(result.parentList));
      }
    }

    actionsBatch.push(
      A.onFetchTaskDetailsSuccess(
        makeActionResult({
          isOk: true,
          code: 'onFetchTaskDetailsSuccess',
          data: {
            taskId,
            taskData,
            taskAttachments,
            taskDescription,
            projectId,
            taskFollowerIds,
            taskPeopleIds,
            taskPeopleRole,
            taskTagIds,
          },
        }),
      ),
    );

    yield put(batchActions(actionsBatch));
    yield call(onFetchTaskTimeEstimate, { payload: { taskId } });

    yield put(onSetRequestStatus(RequestTypesConstants.getTaskDetails, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { taskId });
    yield put(onSetRequestStatus(RequestTypesConstants.getTaskDetails, taskId, RequestStatus.FAILURE, error));
  }
}

export function* onAddTaskReaction({ payload: { taskId, emojiCode } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateExtensionRelation, taskId, RequestStatus.LOADING));
    if (!allowedReactions.includes(emojiCode)) {
      throw new Error('Invalid task reaction');
    }

    const userId = yield select(UsersSelectors.selectCurrentUserId);
    yield put(
      A.onAddTaskReactionSuccess(
        makeActionResult({
          isOk: true,
          code: 'onAddTaskReactionSuccess',
          data: {
            taskId,
            userId,
            emojiCode,
          },
        }),
      ),
    );

    yield cps(client.restApiClient.updateExtensionRelation, ExtensionNamespace.TASK_VOTING, RelationType.REACTION, {
      userId,
      taskId,
      emojiCode,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.updateExtensionRelation, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, {
      taskId,
      emojiCode,
    });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateExtensionRelation, taskId, RequestStatus.FAILURE, error, {
        extensionNamespace: ExtensionNamespace.TASK_VOTING,
      }),
    );
  }
}

export function* onRemoveTaskReaction({ payload: { taskId, emojiCode } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteExtensionRelation, taskId, RequestStatus.LOADING));
    const userId = yield select(UsersSelectors.selectCurrentUserId);
    yield put(
      A.onRemoveTaskReactionSuccess(
        makeActionResult({
          isOk: true,
          code: 'onRemoveTaskReactionSuccess',
          data: {
            taskId,
            userId,
          },
        }),
      ),
    );

    yield cps(client.restApiClient.deleteExtensionRelation, ExtensionNamespace.TASK_VOTING, RelationType.REACTION, {
      userId,
      taskId,
      emojiCode,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.deleteExtensionRelation, taskId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, {
      taskId,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.deleteExtensionRelation, taskId, RequestStatus.FAILURE, error));
  }
}

export function* onSetUserLatestTaskVisitDate({ payload: { taskId, date } }: PartialPayloadAction) {
  try {
    const currentUserId = yield select(selectCurrentUserId);

    yield cps(client.restApiClient.setUserLatestTaskVisitDate, taskId, date, currentUserId);
  } catch (error) {
    handleError(error, { taskId, date });
  }
}

function* onBatchTaskFileIds({ containerId, messageAttachmentsIds }: AnyDict) {
  try {
    const containerType = yield select(EntityModelSelectors.selectEntityType, {
      entityId: containerId,
    });
    if (containerType === EntityType.TASK_DATA) {
      yield put(A.onBatchTaskFileIds(List(messageAttachmentsIds), containerId));
    }
  } catch (error) {
    handleError(error);
  }
}

function* onCreateTaskInEmptyList({ payload: { taskFields, taskPeople, taskCreateSource } }: PartialPayloadAction) {
  try {
    const listId = generateId();
    yield call(ListsModelSagas.onCreateList, {
      payload: {
        id: listId,
        projectId: taskFields.projectId,
        name: i18n.t('New list'),
      },
    });
    yield call(onTaskCreate, {
      payload: {
        taskFields,
        listId,
        taskPeople,
        taskCreateSource,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

function* onSetTaskPriority({ payload: { taskPriorityType, taskId } }: PartialPayloadAction) {
  try {
    yield put(A.onTaskUpdate(taskId, { taskPriorityType }));
  } catch (error) {
    handleError(error);
  }
}
