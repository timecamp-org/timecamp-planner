import { getTaskRecordFromRestResponse } from '../../../utils/fetchResultToRecord';
import { fromJS, List, Map } from 'immutable';
import { UserProjectSettings } from '../ProjectsSettingsModel/models';
import { stringify } from 'query-string';
import { TaskInterface } from '../TasksModel/types';
import { Id } from '../../../utils/identifier';
import { NormalizedTasksDataInterface, NormalizedListsDataInterface, RequestStatus } from './types';
import { TaskListInterface } from '../ListsModel/types';
import { AnyDict } from '../../../types';
import { ChecklistItemBasicData, ChecklistItemInterface } from '../ChecklistsModel/types';
import { ChecklistItem } from '../ChecklistsModel/models';
import { UserProjectSettingsDbRow, UserProjectSettingsInterface } from '../ProjectsSettingsModel/types';
import { TaskTimeEstimate } from '../TaskTimeEstimateModel/models';

const emptyMap = Map();
const emptyList = List();

export function normalizeTasksDataFromAPI(tasks: TaskInterface[]): NormalizedTasksDataInterface {
  let tasksData = emptyMap as Map<Id, TaskInterface>;
  let tasksOrderByListId = emptyMap as Map<Id, Map<Id, number>>;
  let listIdByTaskId = emptyMap as Map<Id, Id>;
  let projectIdsByTaskIds = emptyMap as Map<Id, Id>;

  tasks.forEach((task) => {
    tasksData = tasksData.set(task.id, getTaskRecordFromRestResponse(task));
    tasksOrderByListId = tasksOrderByListId.setIn([task.taskListId, task.id], task.order);
    listIdByTaskId = listIdByTaskId.set(task.id, task.taskListId);
    projectIdsByTaskIds = projectIdsByTaskIds.set(task.id, task.projectId);
  });

  return {
    tasksData,
    tasksOrderByListId,
    listIdByTaskId,
    projectIdsByTaskIds,
  };
}

export function normalizeListsDataFromAPI(listsData: TaskListInterface[]): NormalizedListsDataInterface {
  let listsOrderByProjectId = emptyMap as Map<Id, Map<Id, number>>;

  const normalizedListsData = listsData.reduce(
    (result, currentList) => {
      const { id, name, order, isArchived, projectId } = currentList;

      listsOrderByProjectId = listsOrderByProjectId.setIn([projectId, id], order);

      return result
        .setIn(['names', id], name)
        .setIn(['orders', id], order)
        .setIn(['isArchivedStatuses', id], isArchived)
        .setIn(['projectIdsByListIds', id], projectId);
    },
    fromJS({
      names: {},
      orders: {},
      isArchivedStatuses: {},
      projectIdsByListIds: {},
    })
  );

  return {
    normalizedListsData,
    listsOrderByProjectId,
  };
}

export function normalizeChecklistsItemsBasicDataFromAPI(checklistsItems: ChecklistItemBasicData[]) {
  let checklistItemsData = emptyMap as Map<Id, ChecklistItemInterface>;
  let checklistsByTaskId = emptyMap as Map<Id, List<Id>>;
  let taskIdByChecklistItemId = emptyMap as Map<Id, Id>;

  checklistsItems.forEach((checklistItem) => {
    const { id, isChecked, taskId } = checklistItem;
    const immutableChecklistItem = new ChecklistItem({ id, isChecked });

    checklistItemsData = checklistItemsData.set(id, immutableChecklistItem);
    checklistsByTaskId = checklistsByTaskId.update(
      taskId,
      (checklistItemIds = emptyList as List<Id>) => checklistItemIds.push(id) as List<Id>
    );
    taskIdByChecklistItemId = taskIdByChecklistItemId.set(id, taskId);
  });

  return {
    checklistItemsData,
    checklistsByTaskId,
    taskIdByChecklistItemId,
  };
}

export function normalizeUserProjectSettingsDataFromAPI(
  userProjectSettingsData: UserProjectSettingsDbRow
): UserProjectSettingsInterface {
  const { userId, projectId, ...userProjectSettings } = userProjectSettingsData;
  return new UserProjectSettings(userProjectSettings);
}

export function getRequestTypeWithParams(requestType: string, params: AnyDict = {}): string {
  const stringifiedParams = stringify(params, { arrayFormat: 'comma' });
  return `${requestType}${stringifiedParams ? `?${stringifiedParams}` : ''}`;
}

export function isRequestRepetable(requestStatus: RequestStatus, isRequestDirty: boolean): boolean {
  return !requestStatus || requestStatus === RequestStatus.FAILURE || isRequestDirty;
}

export function isEntityContainedRequestRepetable(
  requestStatus: RequestStatus,
  isRequestDirty: boolean,
  containerAccessLossTimestamp?: number,
  requestTimestamp?: number
): boolean {
  const isRepeatable = isRequestRepetable(requestStatus, isRequestDirty);
  const isContainerLostAccess =
    containerAccessLossTimestamp && requestTimestamp && containerAccessLossTimestamp > requestTimestamp;
  return isRepeatable || isContainerLostAccess;
}

export function normalizeTaskTimeEstimatesDataFromAPI(taskTimeEstimates: TaskTimeEstimate[]) {
  const tasksTimeEstimatesByTaskIdData = taskTimeEstimates.reduce((result, taskTimeEstimate: TaskTimeEstimate) => {
    const immutableTaskTimeEstimate = new TaskTimeEstimate({ ...taskTimeEstimate });
    return result.set(taskTimeEstimate.taskId, immutableTaskTimeEstimate);
  }, fromJS({}));

  return tasksTimeEstimatesByTaskIdData;
}
