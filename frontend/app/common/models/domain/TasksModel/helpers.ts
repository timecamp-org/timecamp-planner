import { mergeLists } from 'common/utils/immutableUtils';
import { compareNumbers, comparePriorities, compareString } from 'common/utils/sort';
import { addHours, differenceInCalendarDays, differenceInCalendarMonths, getTime, isWeekend } from 'date-fns';
import addMonths from 'date-fns/add_months';
import addWeeks from 'date-fns/add_weeks';
import endOfDay from 'date-fns/end_of_day';
import endOfMonth from 'date-fns/end_of_month';
import endOfWeek from 'date-fns/end_of_week';
import endOfYesterday from 'date-fns/end_of_yesterday';
import isAfter from 'date-fns/is_after';
import isBefore from 'date-fns/is_before';
import isThisMonth from 'date-fns/is_this_month';
import isThisWeek from 'date-fns/is_this_week';
import isToday from 'date-fns/is_today';
import isTomorrow from 'date-fns/is_tomorrow';
import isWithinRange from 'date-fns/is_within_range';
import { default as getStartOfDay, default as startOfDay } from 'date-fns/start_of_day';
import { List, Map } from 'immutable';
import { concat, flatten, get } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { FilterByType, ListFilterByType, SortOrder, StringFilterByType } from 'models/component/FiltersModel/types';
import { epochNow } from '../../../utils/epoch';
import { Id } from '../../../utils/identifier';
import * as ExtensionDataTypes from '../ExtensionsModel/constants/extensionDataTypes';
import { ExtensionsData } from '../ExtensionsModel/types';
import { OverwatchTileViewSettingsRecordInterface } from '../OverwatchModel/types';
import {
  TaskRecurrenceDependencyInterface,
  TaskRecurrenceSettingsDbRow,
  TaskRecurrenceSettingsInterface,
} from '../TaskRecurrenceModel/types';
import { SumPeriod } from '../TaskTimeEstimateModel/types';
import {
  DueDateFilterKey,
  DueDateGroupsKeys,
  GroupedTasksType,
  TaskFilterForPathPayload,
  TaskFilterPayload,
  TaskGroupBy,
  TaskInterface,
  TaskPriorityTypes,
  TaskStatusFilterType,
  TaskTimelineItem,
  TasksData,
  TasksRelatedData,
} from '../TasksModel/types';
import { TaskListData, TaskPeopleRole, TaskSortKey, TaskStatus } from './types';

const emptyList = List();
const emptyMap = Map();
const defaultStatusFilter = Map({ status: TaskStatusFilterType.ALL });

export function filterTasks({
  taskIds,
  taskStatuses,
  taskDueDates,
  taskProgressEstimates,
  taskIsArchivedStatuses,
  filterBy,
  tagsByObjectId,
  projectIdsByTaskIds,
  taskPeopleRole,
  defaultFilterBy = defaultStatusFilter,
  weekStartsOn,
  listIsArchivedStatuses,
  listIdByTaskId,
}: TaskFilterPayload): List<Id> {
  if (taskIds && !taskIds.isEmpty()) {
    let filteredTaskIds = taskIds;
    filteredTaskIds = filterByTags(filteredTaskIds, filterBy as ListFilterByType, tagsByObjectId);
    filteredTaskIds = filterByProjects(filteredTaskIds, filterBy as ListFilterByType, projectIdsByTaskIds);
    filteredTaskIds = filterByStatus(
      filteredTaskIds,
      taskStatuses,
      taskProgressEstimates,
      taskIsArchivedStatuses,
      filterBy as StringFilterByType,
      defaultFilterBy as StringFilterByType,
      listIsArchivedStatuses,
      listIdByTaskId
    );
    filteredTaskIds = filterByDueDate(
      filteredTaskIds,
      taskDueDates,
      filterBy as ListFilterByType,
      defaultFilterBy as ListFilterByType,
      weekStartsOn
    );
    filteredTaskIds = filterByAssigneeIds(filteredTaskIds, filterBy as ListFilterByType, taskPeopleRole);
    return filteredTaskIds;
  } else {
    return emptyList as List<Id>;
  }
}

export function filterByTags(
  taskIds: List<Id>,
  filterBy: ListFilterByType,
  tagsByObjectId: Map<Id, List<Id>>
): List<Id> {
  const tagsFilter = filterBy ? filterBy.get('tags') : null;
  if (tagsFilter && !tagsFilter.isEmpty()) {
    return taskIds.filter((taskId) => {
      const taskTagIds = tagsByObjectId.get(taskId);
      if (taskTagIds && !taskTagIds.isEmpty()) {
        return taskTagIds.some((tagId) => tagsFilter.includes(tagId));
      } else if (tagsFilter.includes('none')) {
        return !taskTagIds || taskTagIds.isEmpty();
      } else {
        return false;
      }
    }) as List<Id>;
  } else {
    return taskIds;
  }
}

export function filterByProjects(
  taskIds: List<Id>,
  filterBy: ListFilterByType,
  projectIdsByTaskIds: Map<Id, Id>
): List<Id> {
  const projectsFilter = filterBy ? filterBy.get('projects') : null;
  if (projectIdsByTaskIds && projectsFilter && !projectsFilter.isEmpty()) {
    return taskIds.filter((taskId) => {
      const projectId = projectIdsByTaskIds.get(taskId);
      if (projectId && projectsFilter.includes(projectId)) {
        return true;
      } else {
        return false;
      }
    }) as List<Id>;
  } else {
    return taskIds;
  }
}

export function filterByStatus(
  taskIds: List<Id>,
  taskStatuses: Map<Id, TaskStatus>,
  taskProgressEstimates: Map<Id, number>,
  taskIsArchivedStatuses: Map<Id, boolean>,
  filterBy: StringFilterByType,
  defaultFilterBy: StringFilterByType,
  listIsArchivedStatuses: Map<Id, boolean>,
  listIdByTaskId: Map<Id, Id>
): List<Id> {
  let statusFilter = filterBy ? filterBy.get('status') : null;
  if (!statusFilter) {
    statusFilter = defaultFilterBy.get('status');
  }
  if (!statusFilter) {
    return taskIds;
  }

  return taskIds.filter((taskId) => {
    const status = taskStatuses.get(taskId) as unknown as TaskStatusFilterType;
    const progressEstimate = taskProgressEstimates.get(taskId);
    const isArchived = taskIsArchivedStatuses.get(taskId);
    const listId = listIdByTaskId.get(taskId);
    const isListArchived = listIsArchivedStatuses.get(listId);
    switch (statusFilter) {
      case TaskStatusFilterType.ACTIVE:
        return status === TaskStatusFilterType.ACTIVE && progressEstimate !== 100 && !isArchived && !isListArchived;
      case TaskStatusFilterType.COMPLETED:
        return status === TaskStatusFilterType.COMPLETED && progressEstimate === 100 && !isArchived && !isListArchived;
      case TaskStatusFilterType.ARCHIVED: {
        return isListArchived || isArchived === true;
      }
      default:
        return !isArchived && !isListArchived;
    }
  }) as List<Id>;
}

export function filterByDueDate(
  taskIds: List<Id>,
  taskDueDates: Map<Id, number>,
  filterBy: ListFilterByType,
  defaultFilterBy: ListFilterByType,
  weekStartsOn: number
): List<Id> {
  let dueDateFilters = filterBy ? filterBy.get('dueDate') : null;
  if (!dueDateFilters) {
    dueDateFilters = defaultFilterBy.get('dueDate');
  }

  if (dueDateFilters && !dueDateFilters.isEmpty()) {
    return taskIds.filter((taskId) => {
      let isMatching = false;
      dueDateFilters.forEach((dueDateKey: DueDateFilterKey) => {
        if (filterByDueDateKey(dueDateKey, taskDueDates.get(taskId), weekStartsOn)) {
          isMatching = true;
        }
      });
      return isMatching;
    }) as List<Id>;
  } else {
    return taskIds;
  }
}

function filterByDueDateKey(dueDateKey: DueDateFilterKey, dueDate: number, weekStartsOn: number): boolean {
  const now = epochNow();
  switch (dueDateKey) {
    case 'today':
      return isToday(dueDate);
    case 'tomorrow':
      return isTomorrow(dueDate);
    case 'next-week': {
      const isAfterEndOfThisWeek = isAfter(dueDate, endOfWeek(now, { weekStartsOn }));
      const endOfThisWeek = endOfWeek(now, { weekStartsOn });
      const endOfNextWeek = endOfWeek(addWeeks(endOfThisWeek, 1), {
        weekStartsOn,
      });
      const isBeforeEndOfNextWeek = isBefore(dueDate, endOfNextWeek);

      return isAfterEndOfThisWeek && isBeforeEndOfNextWeek;
    }
    case 'this-week': {
      return isThisWeek(dueDate);
    }
    case 'this-month': {
      return isThisMonth(dueDate);
    }
    case 'next-month': {
      const isAfterEndOfThisMonth = isAfter(dueDate, endOfMonth(now));
      const endOfThisMonth = endOfMonth(now);
      const endOfNextMonth = endOfMonth(addMonths(endOfThisMonth, 1));
      const isBeforeEndOfNextMonth = isBefore(dueDate, endOfNextMonth);
      return isAfterEndOfThisMonth && isBeforeEndOfNextMonth;
    }
    case 'overdue':
      return dueDate && dueDate < endOfYesterday().getTime();
    case 'none':
      return !dueDate;
    default:
      return true;
  }
}

export function filterByAssigneeIds(
  taskIds: List<Id>,
  filterBy: ListFilterByType,
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>
): List<Id> {
  const assigneeIdsFilter = filterBy ? filterBy.get('assigneeId') : null;
  if (assigneeIdsFilter && !assigneeIdsFilter.isEmpty()) {
    return taskIds.filter((taskId) => {
      const taskAssigneeIds = getTaskAssigneeIdsFromTaskPeopleRole(taskId, taskPeopleRole);
      if (taskAssigneeIds && !taskAssigneeIds.isEmpty()) {
        return taskAssigneeIds.some((assigneeId) => assigneeIdsFilter.includes(assigneeId));
      } else if (assigneeIdsFilter.includes('none')) {
        return !taskAssigneeIds || taskAssigneeIds.isEmpty();
      } else {
        return false;
      }
    }) as List<Id>;
  } else {
    return taskIds;
  }
}

export function getTaskFiltersResultsForPath({
  taskIds,
  taskStatuses,
  taskDueDates,
  taskProgressEstimates,
  taskIsArchivedStatuses,
  filterBy,
  tagsByObjectId,
  projectIdsByTaskIds,
  taskPeopleRole,
  filterPath,
  defaultFilterBy = defaultStatusFilter,
  weekStartsOn,
  listIsArchivedStatuses,
  listIdByTaskId,
}: TaskFilterForPathPayload) {
  if (!filterBy) {
    filterBy = emptyMap as FilterByType;
  }
  if (filterPath && filterPath.length > 0 && filterBy) {
    const [filterKey, filterValue] = filterPath;
    let modifiedFilterBy;
    switch (filterKey) {
      case 'assigneeId':
      case 'projects':
      case 'dueDate':
      case 'tags': {
        modifiedFilterBy = (<ListFilterByType>filterBy).set(filterKey, List([filterValue]));
        break;
      }
      default: {
        modifiedFilterBy = (<StringFilterByType>filterBy).set(filterKey, filterValue);
        break;
      }
    }
    return filterTasks({
      taskIds,
      taskStatuses,
      taskDueDates,
      taskProgressEstimates,
      taskIsArchivedStatuses,
      filterBy: modifiedFilterBy,
      tagsByObjectId,
      projectIdsByTaskIds,
      taskPeopleRole,
      defaultFilterBy,
      weekStartsOn,
      listIsArchivedStatuses,
      listIdByTaskId,
    });
  } else {
    return taskIds;
  }
}

export function getTaskAssigneeIdsFromTaskPeopleRole(taskId: Id, taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>) {
  const taskRoles = taskPeopleRole.get(taskId);
  if (!taskRoles) {
    return emptyList as List<Id>;
  }
  let assigneeIds = emptyList as List<Id>;
  taskRoles.entrySeq().forEach(([userId, role]) => {
    if (role === TaskPeopleRole.ASSIGNEE) {
      assigneeIds = assigneeIds.push(userId);
    }
  });
  return assigneeIds;
}

export function parseTaskRecurrency(extensionsData: ExtensionsData): TaskRecurrenceSettingsInterface {
  if (!isEmpty(extensionsData)) {
    const taskRecurrences: TaskRecurrenceSettingsDbRow[] = extensionsData[ExtensionDataTypes.TASK_RECURRENCE_SETTINGS];
    if (taskRecurrences && taskRecurrences.length > 0) {
      const recurrence = taskRecurrences[0];
      return {
        id: recurrence.id,
        nextRecurrenceAt: recurrence.nextRecurrenceAt,
        taskId: recurrence.taskId,
        ...recurrence.value,
      };
    }
    return null;
  }
  return null;
}

export function parseTaskRecurrencyDependency(extensionsData: ExtensionsData): Map<Id, Id> {
  let dependencyMap = emptyMap as Map<Id, Id>;
  if (!isEmpty(extensionsData)) {
    const dependencies: TaskRecurrenceDependencyInterface[] =
      extensionsData[ExtensionDataTypes.TASK_RECURRENCE_DEPENDENCY];
    if (dependencies) {
      dependencies.forEach((dependency) => {
        dependencyMap = dependencyMap
          .set(dependency.taskId, dependency.recurrencySettingsId)
          .set(dependency.targetTaskId, dependency.recurrencySettingsId);
      });
    }
  }
  return dependencyMap;
}

export function sortTaskAssignees(
  assigneeIds: List<string>,
  usersName: Map<Id, string>,
  currentUserId: Id
): List<string> {
  return assigneeIds.sort((userIdA, userIdB) => {
    if (userIdA === currentUserId) {
      return -1;
    }
    if (userIdB === currentUserId) {
      return 1;
    }

    if (userIdA === 'none') {
      return 1;
    }
    if (userIdB === 'none') {
      return -1;
    }

    const userNameA = usersName.get(userIdA);
    const userNameB = usersName.get(userIdB);
    return userNameA < userNameB ? -1 : userNameA > userNameB ? 1 : 0;
  }) as List<string>;
}

export function getUniqueAssigneeIdsForTaskIds(
  taskIds: List<Id>,
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>
): List<Id> {
  if (taskIds) {
    let assigneeIds = emptyList as List<Id>;
    taskIds.forEach((taskId) => {
      assigneeIds = mergeLists(assigneeIds, getTaskAssigneeIdsFromTaskPeopleRole(taskId, taskPeopleRole));
    });
    return assigneeIds;
  } else {
    return emptyList as List<Id>;
  }
}

export function sortTasks(
  taskIds: List<Id>,
  taskRelatedData: TasksRelatedData,
  sortBy: Map<string, SortOrder>,
  defaultSortBy: Map<string, SortOrder>
): List<Id> {
  const primarySortedTaskIds = sortTasksByOrderInLists(taskIds, taskRelatedData.tasksOrderByList);
  const finalSortBy = sortBy && !sortBy.isEmpty() ? sortBy : defaultSortBy;

  if (!finalSortBy) {
    return primarySortedTaskIds;
  }
  const entry = finalSortBy.entrySeq().first() as [TaskSortKey, SortOrder];
  if (!entry) {
    return primarySortedTaskIds;
  }

  const [sortKey, sortOrder] = entry;
  if (!sortKey || !sortOrder) {
    return primarySortedTaskIds;
  }

  const { taskNames, taskListNames, taskProjectNames, taskProgressEstimates, taskDueDates, taskPriorities } =
    taskRelatedData;

  switch (sortKey) {
    case TaskSortKey.NAME: {
      return sortTasksByKey(primarySortedTaskIds, taskNames, sortOrder, compareString);
    }
    case TaskSortKey.DATE: {
      return sortTasksByKey(primarySortedTaskIds, taskDueDates, sortOrder, compareNumbers);
    }
    case TaskSortKey.PROGRESS: {
      return sortTasksByKey(primarySortedTaskIds, taskProgressEstimates, sortOrder, compareNumbers);
    }
    case TaskSortKey.SPACE: {
      return sortTasksByKey(primarySortedTaskIds, taskProjectNames, sortOrder, compareString);
    }
    case TaskSortKey.LIST: {
      return sortTasksByKey(primarySortedTaskIds, taskListNames, sortOrder, compareString);
    }
    case TaskSortKey.PRIORITY: {
      return sortTasksByKey(primarySortedTaskIds, taskPriorities, sortOrder, comparePriorities);
    }
    default: {
      return primarySortedTaskIds;
    }
  }
}

type CompareFunction = (valueA: any, valueB: any, sortOrder: SortOrder) => number;

function sortTasksByKey(
  taskIds: List<Id>,
  taskRelatedData: Map<Id, any>,
  sortOrder: SortOrder,
  compareFn: CompareFunction
): List<Id> {
  return taskIds.sort((taskIdA: Id, taskIdB: Id) => {
    const taskValueA = taskRelatedData.get(taskIdA);
    const taskValueB = taskRelatedData.get(taskIdB);
    return compareFn(taskValueA, taskValueB, sortOrder);
  }) as List<Id>;
}

export function sortTasksByOrderInLists(taskIds: List<Id>, tasksOrderByList: Map<Id, Map<Id, number>>): List<Id> {
  let sortedTaskIds = emptyList as List<Id>;
  tasksOrderByList.forEach((taskOrders: Map<Id, number>) => {
    const sortedTaskOrders = taskOrders
      .toOrderedMap()
      .sortBy((order: number) => order)
      .keySeq()
      .filter((taskId) => taskIds.includes(taskId));

    sortedTaskIds = sortedTaskIds.concat(sortedTaskOrders) as List<Id>;
  });
  return sortedTaskIds;
}

export function buildTimelineItemsFromTasks(taskIds: List<Id>, tasksData: TasksData) {
  return taskIds.map((taskId) => {
    const taskData = tasksData.get(taskId);
    return mapTaskDataToTimelineItem(taskData);
  }) as List<ReturnType<typeof mapTaskDataToTimelineItem>>;
}

export function mapTaskDataToTimelineItem(taskData: TaskInterface, groupId?: string) {
  const isAllDay = !taskData.startDate || !taskData.dueDate;
  let timelineItem: TaskTimelineItem;
  const group = groupId || taskData.projectId;
  const id = `${taskData.id}/${group}`;

  if (isAllDay) {
    timelineItem = {
      taskId: taskData.id,
      id,
      group,
      start_time: startOfDay(taskData.startDate || taskData.dueDate).getTime(),
      end_time: endOfDay(taskData.startDate || taskData.dueDate).getTime(),
    };
  } else {
    timelineItem = {
      taskId: taskData.id,
      id,
      group,
      start_time: taskData.startDate,
      end_time: taskData.dueDate,
    };
  }
  return timelineItem;
}

export function mapUserIdToGroupItem(userId: string) {
  return { id: userId, title: userId };
}

export function filterTasksByViewSettings(
  tasksData: TasksData,
  taskId: Id,
  viewSettingsBody: OverwatchTileViewSettingsRecordInterface,
  filteredTaskIds: List<Id>
): boolean {
  const taskData = tasksData.get(taskId);
  if (!taskData) {
    return false;
  }
  const hasAnyDate = Boolean(taskData.startDate || taskData.dueDate);
  if (!hasAnyDate) {
    return false;
  }
  const hasBothDates = Boolean(taskData.startDate && taskData.dueDate);
  const visibleTimeStart = viewSettingsBody && viewSettingsBody.visibleTimeStart;
  const visibleTimeEnd = viewSettingsBody && viewSettingsBody.visibleTimeEnd;
  const isInTimelineRange =
    isWithinRange(taskData.startDate, visibleTimeStart, visibleTimeEnd) ||
    isWithinRange(taskData.dueDate, visibleTimeStart, visibleTimeEnd);
  const isInTaskRange =
    hasBothDates &&
    (isWithinRange(visibleTimeStart, taskData.startDate, taskData.dueDate) ||
      isWithinRange(visibleTimeEnd, taskData.startDate, taskData.dueDate));

  return filteredTaskIds.includes(taskId) && (isInTimelineRange || isInTaskRange);
}

export const mapTasksToGroupTimelineItems = (
  tasksData: Map<string, TaskInterface>,
  usersByTasks: Map<string, List<string>>
) => {
  const taskDataByUser = tasksData.reduce((acc, task) => {
    if (!task.startDate) {
      return acc;
    }

    const assignees = usersByTasks.get(task.id);

    if (assignees.isEmpty()) {
      return acc;
    }

    assignees.forEach((assignee) => {
      (acc[assignee] || (acc[assignee] = [])).push(mapTaskDataToTimelineItem(task, assignee));
    });

    return acc;
  }, {});
  const userGroups = Object.keys(taskDataByUser).map(mapUserIdToGroupItem);
  const timelineItems = List(flatten(Object.values<TaskTimelineItem>(taskDataByUser)));

  return { userGroups, timelineItems, taskDataByUser };
};

export const getTimeAmountPerDate = ({
  currentDate,
  dateEnd,
  dateStart,
  skipWeekends,
  sumPeriod,
  timeEstimate,
}: {
  dateStart: number;
  dateEnd: number;
  currentDate: number;
  sumPeriod: SumPeriod;
  skipWeekends: boolean;
  timeEstimate: number;
}): number => {
  if (isWeekend(currentDate) && skipWeekends) {
    return 0;
  }

  const isTotal = sumPeriod === SumPeriod.TOTAL;

  if (isTotal && skipWeekends) {
    const businessDaysCount = differenceInCalendarDays(dateStart, dateEnd);
    return Math.ceil(timeEstimate / businessDaysCount);
  } else if (isTotal && !skipWeekends) {
    const totalDaysAmount = differenceInCalendarDays(dateStart, dateEnd);
    return Math.ceil(timeEstimate / totalDaysAmount);
  }

  return timeEstimate;
};

export const mapToTimeMarkerItem = ({ day, group, hours }: { day: number | string; hours: number; group: string }) => ({
  id: `${group}/${day}`,
  group,
  start_time: getTime(day),
  end_time: addHours(day, 23).getTime(),
  timeEstimate: hours,
  taskId: '',
  canMove: false,
  canChangeGroup: false,
  canResize: false,
});

const sortByDueDate = (groupKeys: string[]) => {
  const overdueKey = (groupKeys as DueDateGroupsKeys[]).filter((key) => key === 'overdue');
  const thisMonthKey = (groupKeys as DueDateGroupsKeys[]).filter((key) => key === 'thisMonth');
  const nextMonthKey = (groupKeys as DueDateGroupsKeys[]).filter((key) => key === 'nextMonth');
  const featureKey = (groupKeys as DueDateGroupsKeys[]).filter((key) => key === 'future');
  const noDueDateKey = (groupKeys as DueDateGroupsKeys[]).filter((key) => key === TASK_NO_GROUP_KEY);

  const thisWeekKeys = (groupKeys as DueDateGroupsKeys[])
    .filter((key) => Number.isInteger(Number(key)))
    .map(Number)
    .sort((a, b) => compareNumbers(a, b, SortOrder.ASC))
    .map(String);

  return concat(overdueKey, thisWeekKeys, thisMonthKey, nextMonthKey, featureKey, noDueDateKey);
};

const getSortedGroupIds = ({
  assigneeNameMap,
  groupByKey,
  groupKeys,
}: {
  groupKeys: string[];
  groupByKey: TaskGroupBy;
  assigneeNameMap: Record<string, string>;
}): string[] | DueDateGroupsKeys[] => {
  switch (groupByKey) {
    case 'assignees':
      groupKeys.sort((a, b) => compareString(assigneeNameMap[a], assigneeNameMap[b], SortOrder.ASC));
      break;

    case 'taskPriorityType':
      (groupKeys as TaskPriorityTypes[]).sort((a, b) => comparePriorities(a, b, SortOrder.ASC));
      break;

    case 'dueDate':
      return sortByDueDate(groupKeys);

    default:
      groupKeys.sort((a, b) => compareString(a, b, SortOrder.ASC));
  }

  const noGroupIdIndex = groupKeys.findIndex((groupId) => groupId === TASK_NO_GROUP_KEY);

  if (noGroupIdIndex > -1) {
    const noGroupTasksKey = groupKeys.splice(noGroupIdIndex, 1).shift();
    groupKeys.push(noGroupTasksKey);
  }

  return groupKeys;
};

const getTimeGroupKey = (date?: number): DueDateGroupsKeys => {
  if (!date) {
    return TASK_NO_GROUP_KEY;
  }

  const dateStart = getStartOfDay(date);
  const today = new Date();
  const dateDifference = differenceInCalendarDays(dateStart, today);

  if (dateDifference < 0) {
    return 'overdue';
  }

  if (isThisWeek(date)) {
    return dateStart.getTime().toString();
  }

  const monthDifference = differenceInCalendarMonths(date, today);

  switch (monthDifference) {
    case 0:
      return 'thisMonth';
    case 1:
      return 'nextMonth';
    default:
      return 'future';
  }
};

export const TASK_NO_GROUP_KEY = 'empty';

export const groupTasksBy = ({
  tasks,
  groupByKey,
  assigneeNameMap,
}: {
  tasks: List<TaskListData>;
  groupByKey: TaskGroupBy;
  assigneeNameMap?: { [userId: string]: string };
}): GroupedTasksType => {
  if (groupByKey === 'none') {
    return [];
  }

  const groupMap = tasks.reduce((acc, task) => {
    switch (groupByKey) {
      case 'assignees':
        const assignees = task.assignees;

        assignees.forEach((assigneeId) => {
          acc[assigneeId] ? acc[assigneeId].push(task.id) : (acc[assigneeId] = [task.id]);
        });

        if (assignees.length === 0) {
          acc[TASK_NO_GROUP_KEY] ? acc[TASK_NO_GROUP_KEY].push(task.id) : (acc[TASK_NO_GROUP_KEY] = [task.id]);
        }

        break;
      case 'dueDate':
        const dateKey = getTimeGroupKey(task.dueDate);
        acc[dateKey] ? acc[dateKey].push(task.id) : (acc[dateKey] = [task.id]);

        break;
      default:
        const groupId = task[groupByKey] || TASK_NO_GROUP_KEY;
        acc[groupId] ? acc[groupId].push(task.id) : (acc[groupId] = [task.id]);
    }

    return acc;
  }, {} as { [groupId: string]: string[] });

  const sortedGroupIds = getSortedGroupIds({ groupKeys: Object.keys(groupMap), assigneeNameMap, groupByKey });

  return sortedGroupIds.map((groupId) => ({
    groupId,
    taskIds: get(groupMap, groupId),
  }));
};
