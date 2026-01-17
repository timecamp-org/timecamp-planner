import getDifferenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import getDiffInMinutes from 'date-fns/difference_in_minutes';
import isEqual from 'date-fns/is_equal';
import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import { TaskListData, TaskPeopleRole, TasksRelatedData } from '../types';

import { selectProjectsColor } from '../../ProjectsModel/selectors';
import { selectProjectsFollowerIds } from '../../ProjectsModel/selectors/domain';
import {
  selectCurrentUserFirstDayOfWeek,
  selectCurrentUserId,
  selectUsersName,
  selectUsersSearchName,
} from '../../UsersModel/selectors/domain';
import {
  filterTasks,
  getTaskAssigneeIdsFromTaskPeopleRole,
  getTaskFiltersResultsForPath,
  getUniqueAssigneeIdsForTaskIds,
  groupTasksBy,
  sortTaskAssignees,
  sortTasks,
} from '../helpers';

import { selectFilter, selectFilterBy, selectSortBy } from '../../../component/FiltersModel/selectors';
import { selectIsSearchingTasks, selectTaskSearchResults } from '../../../component/SearchModel/selectors/domain';
import { selectFilesContentTypes, selectFilesData } from '../../FilesModel/selectors';
import { selectTagsByObjectId } from '../../TagsModel/selectors/domain';
import { TaskStatus } from '../../TasksModel/types';
import {
  selectAllTaskIds,
  selectProjectIdsByTaskIdsDomain,
  selectProjectTaskIds,
  selectTaskAssigneeIds,
  selectTaskAttachmentsDomain,
  selectTaskDescriptionsDomain,
  selectTaskDueDates,
  selectTaskFollowerIdsDomain,
  selectTaskIdByMessageIdDomain,
  selectTaskIsArchivedStatuses,
  selectTaskListNames,
  selectTaskNames,
  selectTaskPeopleIdsDomain,
  selectTaskPeopleRoleDomain,
  selectTaskPriorities,
  selectTaskProgressEstimates,
  selectTaskProjectNames,
  selectTaskReactionsDomain,
  selectTaskStatuses,
  selectTasksData,
  selectTasksFileIds,
  selectTasksLatestVisits,
} from './domain';

import { EMPTY_FILTER_OPTION } from 'models/component/FiltersModel/types';
import { FileRecordInterface } from 'models/domain/FilesModel/types';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { Id } from '../../../../utils/identifier';
import { isImage } from '../../FilesModel/helpers';
import {
  selectCurrentUserAccessibleTaskIds,
  selectListIdByTaskIdDomain,
  selectListIsArchivedStatuses,
  selectListsFollowers,
  selectTasksOrderByList,
} from '../../ListsModel/selectors/domain';
import { ALL_DAY_EVENT_MINUTES_THRESHOLD } from '../constants';

const emptyList = List();
const emptyMap = Map();

/**
 * @param taskId
 */
export const selectHasAccessToTask = createCachedSelector(
  selectCurrentUserAccessibleTaskIds,
  (_, args) => args.taskId,
  (taskIds, taskId) => taskIds.indexOf(taskId) !== -1
)((_, args) => generateSelectorName(args, ['taskId']));

export const selectTasksRelatedData = createImmutableEqualSelector(
  selectAllTaskIds,
  selectTasksOrderByList,
  selectTaskStatuses,
  selectTaskDueDates,
  selectTaskProgressEstimates,
  selectTaskIsArchivedStatuses,
  selectTaskPeopleRoleDomain,
  selectTaskNames,
  selectTaskListNames,
  selectTaskProjectNames,
  selectTaskPriorities,
  (
    taskIds,
    tasksOrderByList,
    taskStatuses,
    taskDueDates,
    taskProgressEstimates,
    taskIsArchivedStatuses,
    taskPeopleRole,
    taskNames,
    taskListNames,
    taskProjectNames,
    taskPriorities
  ) =>
    ({
      taskIds,
      tasksOrderByList,
      taskStatuses,
      taskDueDates,
      taskProgressEstimates,
      taskIsArchivedStatuses,
      taskPeopleRole,
      taskNames,
      taskListNames,
      taskProjectNames,
      taskPriorities,
    } as TasksRelatedData)
);

// args: projectId
export const selectProjectTasksRelatedData = createCachedSelector(
  selectProjectTaskIds,
  selectTaskStatuses,
  selectTaskDueDates,
  selectTaskProgressEstimates,
  selectTaskIsArchivedStatuses,
  selectTaskPeopleRoleDomain,
  (taskIds, taskStatuses, taskDueDates, taskProgressEstimates, taskIsArchivedStatuses, taskPeopleRole) => ({
    taskIds,
    taskStatuses,
    taskDueDates,
    taskProgressEstimates,
    taskIsArchivedStatuses,
    taskPeopleRole,
  })
)((_, args) => generateSelectorName(args, ['projectId']));

// args filterId, defaultFilterBy
export const selectFilteredProjectTaskIds = createImmutableEqualSelector(
  selectProjectTasksRelatedData,
  selectFilterBy,
  selectTagsByObjectId,
  selectProjectIdsByTaskIdsDomain,
  selectIsSearchingTasks,
  selectTaskSearchResults,
  (_, args) => args.defaultFilterBy,
  selectCurrentUserFirstDayOfWeek,
  selectListIsArchivedStatuses,
  selectListIdByTaskIdDomain,
  (
    tasksRelatedData,
    filterBy,
    tagsByObjectId,
    projectIdsByTaskIds,
    isSearching,
    taskSearchResults,
    defaultFilterBy,
    weekStartsOn,
    listIsArchivedStatuses,
    listIdByTaskId
  ) => {
    const { taskIds, taskStatuses, taskDueDates, taskProgressEstimates, taskIsArchivedStatuses, taskPeopleRole } =
      tasksRelatedData;
    const filteredTaskIds = filterTasks({
      taskIds,
      taskStatuses,
      taskDueDates,
      taskProgressEstimates,
      taskIsArchivedStatuses,
      filterBy,
      tagsByObjectId,
      projectIdsByTaskIds,
      taskPeopleRole,
      defaultFilterBy,
      weekStartsOn,
      listIsArchivedStatuses,
      listIdByTaskId,
    });
    let result = emptyList as List<Id>;
    filteredTaskIds.forEach((taskId) => {
      if (!isSearching || taskSearchResults.includes(taskId)) {
        result = result.push(taskId);
      }
    });
    return result;
  }
);

// args: filterPath, defaultFilterBy, filterId
export const selectFilteredTaskIdsForPath = createImmutableEqualSelector(
  selectTasksRelatedData,
  selectFilterBy,
  selectProjectIdsByTaskIdsDomain,
  selectTagsByObjectId,
  selectListIsArchivedStatuses,
  selectListIdByTaskIdDomain,
  (_, args) => args.filterPath,
  (_, args) => args.defaultFilterBy,
  selectCurrentUserFirstDayOfWeek,
  (
    tasksRelatedData,
    filterBy,
    projectIdsByTaskIds,
    tagsByObjectId,
    listIsArchivedStatuses,
    listIdByTaskId,
    filterPath,
    defaultFilterBy,
    weekStartsOn
  ) => {
    const { taskIds, taskStatuses, taskDueDates, taskProgressEstimates, taskIsArchivedStatuses, taskPeopleRole } =
      tasksRelatedData;
    return getTaskFiltersResultsForPath({
      taskIds,
      taskStatuses,
      taskDueDates,
      taskProgressEstimates,
      taskIsArchivedStatuses,
      filterBy,
      filterPath,
      tagsByObjectId,
      projectIdsByTaskIds,
      taskPeopleRole,
      defaultFilterBy,
      weekStartsOn,
      listIsArchivedStatuses,
      listIdByTaskId,
    });
  }
);

// args: taskId
export const selectTaskFollowerIds = createCachedSelector(
  selectTaskFollowerIdsDomain,
  (_, args) => args.taskId,
  (taskFollowerIds, taskId) => taskFollowerIds.get(taskId) || emptyList
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectProjectIdByTaskId = createCachedSelector(
  selectProjectIdsByTaskIdsDomain,
  (_, args) => args.taskId,
  (projectIdsByTaskIds, taskId) => projectIdsByTaskIds.get(taskId)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: projectId, filterId, filterPath, defaultFilterBy
export const selectFilteredTaskIdsCountPreview = createCachedSelector(
  selectFilteredTaskIdsForPath,
  selectProjectTaskIds,
  (filteredTaskIds, taskIds) => filteredTaskIds.filter((taskId) => taskIds.includes(taskId)).size
)((_, args) => generateSelectorName(args, ['projectId', 'filterId', 'filterPath', 'defaultFilterBy']));

// args: taskId
export const selectTask = createCachedSelector(
  selectTasksData,
  (_, args) => args.taskId,
  (tasksData, taskId) => tasksData.get(taskId)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskName = createCachedSelector(selectTask, (task) => (task ? task.name : ''))((_, args) =>
  generateSelectorName(args, ['taskId'])
);

// args: taskId
export const selectTaskDueDate = createCachedSelector(selectTask, (task) => (task ? task.dueDate : null))((_, args) =>
  generateSelectorName(args, ['taskId'])
);

// args: taskId
export const selectTaskStartDate = createCachedSelector(selectTask, (task) => (task ? task.startDate : null))(
  (_, args) => generateSelectorName(args, ['taskId'])
);

// args: taskId
export const selectTaskProgressEstimate = createCachedSelector(
  selectTask,
  (task) => task?.progress || 0
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskPriorityType = createCachedSelector(
  selectTask,
  (task) => task?.taskPriorityType
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskDescription = createCachedSelector(
  selectTaskDescriptionsDomain,
  (_, args) => args.taskId,
  (taskDescriptions, taskId) => taskDescriptions.get(taskId) || ''
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskPeople = createCachedSelector(
  selectTaskPeopleIdsDomain,
  (_, args) => args.taskId,
  (taskPeople, taskId) => taskPeople.get(taskId) || emptyList
)((_, args) => generateSelectorName(args, ['taskId']));

// args: userId, taskId
export const selectIsUserTaskFollower = createCachedSelector(
  (_, args) => args.userId,
  selectTaskPeople,
  selectTaskFollowerIds,
  (userId, taskPeopleIds, taskFollowerIds) => taskPeopleIds.includes(userId) || taskFollowerIds.includes(userId)
)((_, args) => generateSelectorName(args, ['userId', 'taskId']));

// args: taskId
export const selectTaskPeopleRole = createCachedSelector(
  selectTaskPeopleRoleDomain,
  (_, args) => args.taskId,
  (taskPeopleRole, taskId) => taskPeopleRole.get(taskId) || emptyMap
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectAlphabeticallySortedTaskAssigneeIds = createCachedSelector(
  selectTaskAssigneeIds,
  selectUsersSearchName,
  selectCurrentUserId,
  (assigneeIds, usersSearchName, currentUserId) => sortTaskAssignees(assigneeIds, usersSearchName, currentUserId)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectIsCurrentUserTaskFollower = createCachedSelector(
  selectCurrentUserId,
  selectTaskPeople,
  selectTaskFollowerIds,
  (currentUserId, taskPeople, taskFollowerIds) =>
    taskPeople.includes(currentUserId) || taskFollowerIds.includes(currentUserId)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectIsCurrentUserAssignedToTask = createCachedSelector(
  selectCurrentUserId,
  selectTaskPeople,
  (currentUserId, taskPeople) => taskPeople.includes(currentUserId)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectIsCurrentUserTaskOrListOrSpaceFollower = createCachedSelector(
  selectCurrentUserId,
  selectTaskFollowerIds,
  selectListsFollowers,
  selectProjectsFollowerIds,
  selectListIdByTaskIdDomain,
  selectProjectIdByTaskId,
  (_, args) => args.taskId,
  (currentUserId, taskFollowerIds, listFollowersDomain, projectFollowersDomain, listIdByTaskId, projectId, taskId) => {
    const listId = listIdByTaskId.get(taskId);
    const listFollowerIds = listFollowersDomain.get(listId);
    const projectFollowerIds = projectFollowersDomain.get(projectId);
    if (taskFollowerIds && taskFollowerIds.includes(currentUserId)) {
      return true;
    } else if (listFollowerIds && listFollowerIds.includes(currentUserId)) {
      return true;
    } else if (projectFollowerIds && projectFollowerIds.includes(currentUserId)) {
      return true;
    } else {
      return false;
    }
  }
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskStatus = createCachedSelector(selectTask, (task) => (task ? task.status : TaskStatus.ACTIVE))(
  (_, args) => generateSelectorName(args, ['taskId'])
);

// args: projectId
export const selectProjectTasksAssignees = createCachedSelector(
  selectProjectTaskIds,
  selectTaskPeopleRoleDomain,
  (taskIds, taskPeopleRole) =>
    getUniqueAssigneeIdsForTaskIds(taskIds, taskPeopleRole).push(EMPTY_FILTER_OPTION) as List<string>
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId
export const selectSortedProjectTasksAssignees = createCachedSelector(
  selectProjectTasksAssignees,
  selectUsersName,
  selectCurrentUserId,
  (assigneeIds, usersName, currentUserId) => sortTaskAssignees(assigneeIds, usersName, currentUserId)
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId
export const selectVisibleProjectTaskAssignees = createCachedSelector(
  selectSortedProjectTasksAssignees,
  (_, args) => args.maxItemsCount,
  (projectTasksAssignees, maxItemsCount) => projectTasksAssignees.slice(0, maxItemsCount) as List<Id>
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId
export const selectHiddenProjectTaskAssigneesCount = createCachedSelector(
  selectProjectTasksAssignees,
  selectVisibleProjectTaskAssignees,
  (projectTasksAssignees, visibleProjectTaskAssignees) => projectTasksAssignees.size - visibleProjectTaskAssignees.size
)((_, args) => generateSelectorName(args, ['projectId']));

// args: projectId
export const selectFirstTaskIdInProject = createCachedSelector(selectProjectTaskIds, (taskIds) => taskIds.first())(
  (_, args) => generateSelectorName(args, ['projectId'])
);

// args: taskId
export const selectTaskColor = createCachedSelector(
  selectProjectIdByTaskId,
  selectProjectsColor,
  (projectId, projectsColor) => projectsColor.get(projectId) || null
)((_, args) => generateSelectorName(args, ['taskId']));

export const selectTasksColors = createImmutableEqualSelector(
  selectProjectIdsByTaskIdsDomain,
  selectProjectsColor,
  (projectIdsByTaskIds, projectsColors) => {
    let tasksColors = emptyMap as Map<Id, string>;
    projectIdsByTaskIds.mapKeys((taskId) => {
      const projectId = projectIdsByTaskIds.get(taskId);
      const color = projectsColors.get(projectId);
      tasksColors = tasksColors.set(taskId, color);
    });
    return tasksColors;
  }
);

// args: taskId
export const selectTaskAttachmentsIds = createCachedSelector(
  selectTaskAttachmentsDomain,
  selectFilesData,
  (_, args) => args.taskId,
  (taskAttachmentsDomain, filesData, taskId) => {
    if (taskAttachmentsDomain.has(taskId)) {
      const fileIds = taskAttachmentsDomain.get(taskId);
      return fileIds.filter((fileId) => filesData.has(fileId));
    } else {
      return emptyList;
    }
  }
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectSortedTaskAttachmentsIds = createCachedSelector(
  selectTaskAttachmentsIds,
  selectFilesData,
  (fileIds, filesData) => {
    return fileIds.sort((fileIdA, fileIdB) => {
      const fileA = filesData.get(fileIdA);
      const fileB = filesData.get(fileIdB);
      return fileB.timestamp - fileA.timestamp;
    }) as List<Id>;
  }
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectTaskAttachmentsImagesIds = createCachedSelector(
  selectSortedTaskAttachmentsIds,
  selectFilesContentTypes,
  (taskAttachmentsIds, filesContentTypes) =>
    taskAttachmentsIds.filter((fileId) => isImage(filesContentTypes.get(fileId)))
)((_, args) => generateSelectorName(args, ['taskId']));

// args: messageId
export const selectTaskIdFromMessageId = createCachedSelector(
  selectTaskIdByMessageIdDomain,
  (_, args) => args.messageId,
  (taskIdByMessageId, messageId) => taskIdByMessageId.get(messageId)
)((_, args) => generateSelectorName(args, ['messageId']));

// args: userId
export const selectAllTasksAssignedToUser = createCachedSelector(
  selectTaskPeopleRoleDomain,
  (_, args) => args.userId,
  (tasksPeopleRole, userId) => {
    let taskIdsUserIsAssigneeOf = emptyList as List<Id>;
    tasksPeopleRole.forEach((taskPeopleRole, taskId) => {
      if (taskPeopleRole.get(userId) === TaskPeopleRole.ASSIGNEE) {
        taskIdsUserIsAssigneeOf = taskIdsUserIsAssigneeOf.push(taskId);
      }
    });
    return taskIdsUserIsAssigneeOf;
  }
)((_, args) => generateSelectorName(args, ['userId']));

// args: userId, filterId, defaultFilterBy, defaultSortBy
export const selectFilteredAllTasksAssignedToUser = createCachedSelector(
  selectAllTasksAssignedToUser,
  selectTasksRelatedData,
  selectFilter,
  selectTagsByObjectId,
  selectProjectIdsByTaskIdsDomain,
  selectIsSearchingTasks,
  selectTaskSearchResults,
  selectCurrentUserFirstDayOfWeek,
  selectListIsArchivedStatuses,
  selectListIdByTaskIdDomain,
  (_, args) => args.defaultFilterBy,
  (_, args) => args.defaultSortBy,
  (
    taskIds,
    tasksRelatedData,
    filter,
    tagsByObjectId,
    projectIdsByTaskIds,
    isSearching,
    taskSearchResults,
    weekStartsOn,
    listIsArchivedStatuses,
    listIdByTaskId,
    defaultFilterBy,
    defaultSortBy
  ) => {
    const { taskStatuses, taskDueDates, taskProgressEstimates, taskIsArchivedStatuses, taskPeopleRole } =
      tasksRelatedData;
    const filteredTaskIds = filterTasks({
      taskIds,
      taskStatuses,
      taskDueDates,
      taskProgressEstimates,
      taskIsArchivedStatuses,
      filterBy: filter?.get('filterByField', emptyMap),
      tagsByObjectId,
      projectIdsByTaskIds,
      taskPeopleRole,
      defaultFilterBy,
      weekStartsOn,
      listIsArchivedStatuses,
      listIdByTaskId,
    });
    let result = emptyList as List<Id>;
    filteredTaskIds.forEach((taskId) => {
      if (!isSearching || taskSearchResults.includes(taskId)) {
        result = result.push(taskId);
      }
    });
    return sortTasks(result, tasksRelatedData, filter?.get('sortByField', emptyMap), defaultSortBy);
  }
)((_, args) => generateSelectorName(args, ['userId', 'filterId', 'defaultFilterBy', 'defaultSortBy']));

// args: projectId, userId
export const selectProjectTasksIdsAssignedToUser = createCachedSelector(
  selectProjectTaskIds,
  selectTaskPeopleRoleDomain,
  (_, args) => args.userId,
  (taskList, taskPeopleRole, userId) => {
    let result = emptyList;
    taskList.forEach((taskId) => {
      const taskAssigneeIds = getTaskAssigneeIdsFromTaskPeopleRole(taskId, taskPeopleRole);
      if (taskAssigneeIds && taskAssigneeIds.indexOf(userId) > -1) {
        result = result.push(taskId);
      }
    });

    return result;
  }
)((_, args) => generateSelectorName(args, ['projectId', 'userId']));

// args: taskId
export const selectTaskReactions = createCachedSelector(
  selectTaskReactionsDomain,
  (_, args) => args.taskId,
  (taskReactionsDomain, taskId) => taskReactionsDomain.get(taskId, emptyMap as Map<Id, string>)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectGroupedTaskReactions = createCachedSelector(selectTaskReactions, (taskReactionsByUserId) =>
  taskReactionsByUserId.reduce((result: Map<string, List<Id>>, emojiColonFormat, userId) => {
    const currentEmojiReactionUserIds = result.get(emojiColonFormat);
    if (!currentEmojiReactionUserIds) {
      return result.set(emojiColonFormat, (<List<Id>>emptyList).push(userId));
    } else if (currentEmojiReactionUserIds.includes(userId)) {
      return result;
    } else {
      return result.set(emojiColonFormat, currentEmojiReactionUserIds.push(userId));
    }
  }, emptyMap)
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId, emojiColon
export const selectTaskReactionsForColon = createCachedSelector(
  selectGroupedTaskReactions,
  (_, args) => args.emojiColon,
  (groupedTaskReactions, emojiColon) => groupedTaskReactions.get(emojiColon) || emptyList
)((_, args) => generateSelectorName(args, ['taskId', 'emojiColon']));

// args: taskId
export const selectTaskFileIds = createCachedSelector(
  selectTasksFileIds,
  selectFilesData,
  (_, args) => args.taskId,
  (tasksFileIds, filesData, taskId) => {
    const filesIds = tasksFileIds.get(taskId) || emptyList;
    return filesIds
      .filter((fileId: Id) => {
        const file = filesData.get(fileId) as FileRecordInterface;
        return file && isImage(file.contentType);
      })
      .sort((fileIdA: Id, fileIdB: Id) => filesData.get(fileIdB).timestamp - filesData.get(fileIdA).timestamp);
  }
)((_, args) => generateSelectorName(args, ['taskId']));

// args: taskId
export const selectIsTaskArchived = createCachedSelector(
  selectTask,
  (task) => task && task.isArchived
)((_, args) => generateSelectorName(args, ['taskId']));

export const selectSortedLatestVisitedTasks = createImmutableEqualSelector(selectTasksLatestVisits, (taskLatestVisit) =>
  taskLatestVisit
    .sort((a, b) => b - a)
    .keySeq()
    .toList()
);

export const selectSortedLatestVisitedTasksDescriptors = createImmutableEqualSelector(
  selectSortedLatestVisitedTasks,
  selectProjectIdsByTaskIdsDomain,
  selectTasksData,
  (sortedTaskIds, projectIdsByTaskIds, tasksDataById) => {
    let result = emptyList;
    sortedTaskIds.forEach((taskId) => {
      result = result.push(
        Map({
          taskId,
          projectId: projectIdsByTaskIds.get(taskId),
          name: tasksDataById.get(taskId).get('name'),
        })
      );
    });

    return result;
  }
);

// projectId, filterId, defaultFilterBy
export const selectProjectCardEvents = createCachedSelector(
  selectProjectTaskIds,
  selectTasksData,
  selectFilteredProjectTaskIds,
  (taskIds, tasksData, filteredTaskIds) =>
    taskIds
      .filter((taskId) => {
        const task = tasksData.get(taskId);
        return task && task.dueDate && filteredTaskIds.includes(taskId);
      })
      .map((taskId) => buildCalendarEvent(tasksData.get(taskId)))
      .toArray()
)((_, args) => generateSelectorName(args, ['projectId', 'filterId', 'defaultFilterBy']));

// projectId, filterId, defaultFilterBy, defaultSortBy
export const selectFilteredAndSortedProjectTaskIds = createCachedSelector(
  selectFilteredProjectTaskIds,
  selectTasksRelatedData,
  selectFilter,
  (_, args) => args.defaultSortBy,
  (filteredTaskIds, tasksRelatedData, filter, defaultSortBy) =>
    sortTasks(filteredTaskIds, tasksRelatedData, filter?.get('sortByField', emptyMap), defaultSortBy)
)((_, args) => generateSelectorName(args, ['projectId', 'filterId', 'defaultFilterBy', 'defaultSortBy']));

// projectId, filterId, userId, defaultFilterBy
export const selectConversationCardEvents = createCachedSelector(
  selectAllTasksAssignedToUser,
  selectTasksData,
  selectFilteredAllTasksAssignedToUser,
  (taskIds, tasksData, filteredTaskIds) =>
    taskIds
      .filter((taskId) => {
        const task = tasksData.get(taskId);
        return task && task.dueDate && filteredTaskIds.includes(taskId);
      })
      .map((taskId) => buildCalendarEvent(tasksData.get(taskId)))
      .toArray()
)((_, args) => generateSelectorName(args, ['projectId', 'filterId', 'userId', 'defaultFilterBy']));

function buildCalendarEvent(task) {
  const dueDate = new Date(task.dueDate);
  const startDate = new Date(task.startDate);

  const diffInMinutes = getDiffInMinutes(dueDate, startDate);
  const differenceInCalendarDays = getDifferenceInCalendarDays(dueDate, startDate);
  const allDay =
    !task.startDate ||
    isEqual(startDate, dueDate) ||
    diffInMinutes > ALL_DAY_EVENT_MINUTES_THRESHOLD ||
    differenceInCalendarDays >= 1;
  const calendarEvent = {
    id: task.id,
    title: task.name,
    allDay,
    start: task.startDate ? startDate : dueDate,
    end: task.dueDate ? dueDate : null,
  };

  return calendarEvent;
}

// userId
export const selectMyTasksAssignees = createCachedSelector(
  selectAllTasksAssignedToUser,
  selectTaskPeopleRoleDomain,
  selectUsersName,
  selectCurrentUserId,
  (taskIds, taskPeopleRoles, usersName, currentUserId) => {
    let assignees = emptyList as List<Id>;

    taskIds.forEach((taskId) => {
      const taskRoles = taskPeopleRoles.get(taskId) || (emptyMap as Map<string, Map<string, TaskPeopleRole>>);

      taskRoles.forEach((role, userId) => {
        if (role === TaskPeopleRole.ASSIGNEE && !assignees.includes(userId)) {
          assignees = assignees.push(userId);
        }
      });
    });

    return sortTaskAssignees(assignees, usersName, currentUserId);
  }
)((_, args) => generateSelectorName(args, ['userId']));

// userId, filterId, maxItemsCount
export const selectVisibleMyTasksAssignees = createCachedSelector(
  selectMyTasksAssignees,
  (_, args) => args.maxItemsCount,
  (myTasksAssignees, maxItemsCount) => myTasksAssignees.slice(0, maxItemsCount)
)((_, args) => generateSelectorName(args, ['userId', 'filterId', 'maxItemsCount']));

// userId, filterId, maxItemsCount
export const selectHiddenMyTasksAssignees = createCachedSelector(
  selectMyTasksAssignees,
  selectVisibleMyTasksAssignees,
  (myTasksAssignees, visibleMyTaskAssignees) => myTasksAssignees.size - visibleMyTaskAssignees.size
)((_, args) => generateSelectorName(args, ['userId', 'filterId', 'maxItemsCount']));

// projectId, filterId
export const selectGroupedFilteredOrderedTasksIds = createCachedSelector(
  selectFilteredProjectTaskIds,
  selectTasksData,
  selectTaskPeopleIdsDomain,
  selectListIdByTaskIdDomain,
  selectSortBy,
  selectTasksRelatedData,
  selectUsersName,
  (_, args) => args.groupByKey,
  (_, args) => args.defaultSortBy,
  (
    projectTaskIds,
    tasksData,
    taskPeople,
    listIdByTask,
    sortBy,
    taskRelatedData,
    userNames,
    groupByKey,
    defaultSortBy
  ) => {
    const tasks = projectTaskIds.map((id) => ({
      ...tasksData.get(id).toJS(),
      assignees: taskPeople.get(id)?.toJS() || [],
      list: listIdByTask.get(id),
    })) as List<TaskListData>;

    const groupedTasks = groupTasksBy({ tasks, groupByKey, assigneeNameMap: userNames.toJS() });

    const orderedTaskGroups = groupedTasks.map(({ groupId, taskIds }) => ({
      groupId,
      taskIds: sortTasks(List(taskIds), taskRelatedData, sortBy, defaultSortBy).toArray(),
    }));

    return orderedTaskGroups;
  }
)((_, args) => generateSelectorName(args, ['projectId']));
