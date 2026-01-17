import {
  EMPTY_FILTER_OPTION,
  SortOrder,
} from 'common/models/component/FiltersModel/types';
import generateSelectorName from 'common/utils/generateSelectorName';
import { Id } from 'common/utils/identifier';
import { compareString } from 'common/utils/sort';
import { List } from 'immutable';
import createCachedSelector from 're-reselect';
import {
  selectFilteredAllTasksAssignedToUser,
  selectFilteredProjectTaskIds,
  selectFilteredTaskIdsForPath,
} from '.';
import { OverwatchTileViewSettingsRecordInterface } from '../../OverwatchModel/types';
import {
  selectTagsByObjectId,
  selectTagsData,
} from '../../TagsModel/selectors/domain';
import { getUniqueTagIdsForTaskIds } from '../../TagsModel/utils';
import {
  selectCurrentUserId,
  selectUsersName,
} from '../../UsersModel/selectors/domain';
import { selectViewSettingsBody } from '../../ViewSettingsModel/selectors/domain';
import {
  buildTimelineItemsFromTasks,
  filterTasksByViewSettings,
  getUniqueAssigneeIdsForTaskIds,
  mapTasksToGroupTimelineItems,
  sortTaskAssignees,
} from '../helpers';
import {
  selectProjectTaskIds,
  selectTaskPeopleIdsDomain,
  selectTaskPeopleRoleDomain,
  selectTasksData,
} from './domain';

// args: projectId, filterId, viewId
export const selectProjectTimelineTaskIds = createCachedSelector(
  selectProjectTaskIds,
  selectTasksData,
  selectFilteredProjectTaskIds,
  selectViewSettingsBody,
  (
    taskIds,
    tasksData,
    filteredTaskIds,
    viewSettingsBody: OverwatchTileViewSettingsRecordInterface
  ) =>
    taskIds
      .filter((taskId) =>
        filterTasksByViewSettings(
          tasksData,
          taskId,
          viewSettingsBody,
          filteredTaskIds
        )
      )
      .sort((taskIdA: Id, taskIdB: Id) =>
        taskIdA < taskIdB ? -1 : 1
      ) as List<Id>
)((_, args) => generateSelectorName(args, ['projectId', 'filterId', 'viewId']));

// args: projectId, filterId, viewId
export const selectProjectTimelineTaskItems = createCachedSelector(
  selectProjectTimelineTaskIds,
  selectTasksData,
  (taskIds, tasksData) => buildTimelineItemsFromTasks(taskIds, tasksData)
)((_, args) =>
  generateSelectorName(args, [
    'projectId',
    'filterId',
    'visibleTimeStart',
    'visibleTimeEnd',
  ])
);

// args: userId, filterId, viewId
export const selectUserAssignedTimelineTaskItems = createCachedSelector(
  selectFilteredAllTasksAssignedToUser,
  selectTasksData,
  selectViewSettingsBody,
  (
    filteredTaskIds,
    tasksData,
    viewSettingsBody: OverwatchTileViewSettingsRecordInterface
  ) => {
    const taskIds = filteredTaskIds
      .filter((taskId) =>
        filterTasksByViewSettings(
          tasksData,
          taskId,
          viewSettingsBody,
          filteredTaskIds
        )
      )
      .sort((taskIdA: Id, taskIdB: Id) =>
        taskIdA < taskIdB ? -1 : 1
      ) as List<Id>;
    return buildTimelineItemsFromTasks(taskIds, tasksData);
  }
)((_, args) =>
  generateSelectorName(args, [
    'projectId',
    'filterId',
    'visibleTimeStart',
    'visibleTimeEnd',
  ])
);

// args: projectId, viewId
export const selectProjectTimelineTasksAssignees = createCachedSelector(
  selectProjectTimelineTaskIds,
  selectTaskPeopleRoleDomain,
  (taskIds, taskPeopleRole) =>
    getUniqueAssigneeIdsForTaskIds(taskIds, taskPeopleRole).push(
      EMPTY_FILTER_OPTION
    ) as List<string>
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectSortedTimelineTasksAssignees = createCachedSelector(
  selectProjectTimelineTasksAssignees,
  selectUsersName,
  selectCurrentUserId,
  (assigneeIds, usersName, currentUserId) =>
    sortTaskAssignees(assigneeIds, usersName, currentUserId)
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectVisibleProjectTimelineTaskAssignees = createCachedSelector(
  selectSortedTimelineTasksAssignees,
  (_, args) => args.maxItemsCount,
  (projectTasksAssignees, maxItemsCount) =>
    projectTasksAssignees.slice(0, maxItemsCount) as List<Id>
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectHiddenProjectTimelineTaskAssigneesCount =
  createCachedSelector(
    selectProjectTimelineTasksAssignees,
    selectVisibleProjectTimelineTaskAssignees,
    (projectTasksAssignees, visibleProjectTaskAssignees) =>
      projectTasksAssignees.size - visibleProjectTaskAssignees.size
  )((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectProjectTimelineTasksTags = createCachedSelector(
  selectProjectTimelineTaskIds,
  selectTagsByObjectId,
  (taskIds, tagsByObjectId) =>
    getUniqueTagIdsForTaskIds(taskIds, tagsByObjectId).push(EMPTY_FILTER_OPTION)
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectSortedProjectTimelineTasksTags = createCachedSelector(
  selectProjectTimelineTasksTags,
  selectTagsData,
  (tagIds, tagsData) =>
    tagIds.sort((tagIdA, tagIdB) => {
      const tagNameA = tagsData.getIn([tagIdA, 'name']);
      const tagNameB = tagsData.getIn([tagIdB, 'name']);

      return compareString(tagNameA, tagNameB, SortOrder.ASC);
    }) as List<Id>
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectVisibleProjectTimelineTaskTags = createCachedSelector(
  selectSortedProjectTimelineTasksTags,
  (_, args) => args.maxItemsCount,
  (projectTasksTags, maxItemsCount) =>
    projectTasksTags.slice(0, maxItemsCount) as List<Id>
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, viewId
export const selectHiddenProjectTimelineTaskTagsCount = createCachedSelector(
  selectSortedProjectTimelineTasksTags,
  selectVisibleProjectTimelineTaskTags,
  (projectTasksTags, visibleProjectTaskTags) =>
    projectTasksTags.size - visibleProjectTaskTags.size
)((_, args) => generateSelectorName(args, ['projectId', 'viewId']));

// args: projectId, filterId, filterPath, defaultFilterBy, viewId
export const selectFilteredTimelineTaskIdsCountPreview = createCachedSelector(
  selectFilteredTaskIdsForPath,
  selectProjectTimelineTaskIds,
  (filteredTaskIds, taskIds) =>
    filteredTaskIds.filter((taskId) => taskIds.includes(taskId)).size
)((_, args) =>
  generateSelectorName(args, [
    'projectId',
    'filterId',
    'filterPath',
    'defaultFilterBy',
  ])
);

// args: projectId
export const selectProjectTasksSortedByUser = createCachedSelector(
  selectProjectTimelineTaskIds,
  selectTasksData,
  selectTaskPeopleIdsDomain,
  (projectTasksIds, tasksData, usersByTasks) => {
    const projectTasksData = projectTasksIds
      .map((id) => tasksData.get(id))
      .toJS();

    return mapTasksToGroupTimelineItems(projectTasksData, usersByTasks);
  }
)((_, args) => generateSelectorName(args, ['projectId']));
