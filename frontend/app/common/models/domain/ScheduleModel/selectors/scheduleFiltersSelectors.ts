import generateSelectorName from 'common/utils/generateSelectorName';

import { Map } from 'immutable';
import { add, groupBy, mergeWith } from 'lodash';
import { selectFilter } from 'models/component/FiltersModel/selectors';
import { selectGroupIdByUserIdMap } from 'models/domain/OrganizationGroupsModel/selectors/domain';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { FilterByType } from '../../../component/FiltersModel/types';
import { countFilteredValues } from '../helpers';
import { selectScheduleData } from './domain';
import { selectAccessibleScheduleTasks, selectAllTasksByUser } from './scheduleSelectors';

export const selectScheduleTasksAssignees = createSelector(selectAllTasksByUser, (tasksByUser) =>
  Object.keys(tasksByUser)
);

export const selectVisibleScheduleTasksAssignees = createCachedSelector(
  selectScheduleTasksAssignees,
  (_, args) => args.maxItemsCount,
  (projectTasksAssignees, maxItemsCount) => projectTasksAssignees.slice(0, maxItemsCount)
)((_, args) => generateSelectorName(args, ['maxItemsCount']));

export const selectHiddenScheduleTasksAssigneesCount = createCachedSelector(
  selectScheduleTasksAssignees,
  selectVisibleScheduleTasksAssignees,
  (projectTasksAssignees, visibleTaskAssignees) => projectTasksAssignees.length - visibleTaskAssignees.length
)((_, args) => generateSelectorName(args, ['maxItemsCount', 'filterId']));

export const selectScheduleProjectIds = createSelector(selectAccessibleScheduleTasks, (data) =>
  Object.keys(groupBy(data, 'projectId'))
);

export const selectVisibleScheduleProjectIds = createCachedSelector(
  selectScheduleProjectIds,
  (_, args) => args.maxItemsCount,
  (projects, maxItemsCount) => projects.slice(0, maxItemsCount)
)((_, args) => generateSelectorName(args, ['maxItemsCount']));

export const selectHiddenMyScheduleProjectsCount = createCachedSelector(
  selectScheduleProjectIds,
  selectVisibleScheduleProjectIds,
  (projects, visibleProjects) => projects.length - visibleProjects.length
)((_, args) => generateSelectorName(args, ['maxItemsCount']));

export const selectScheduleTaskIds = createSelector(selectScheduleData, (data) => Object.keys(groupBy(data, 'id')));

// args: filterId, filterPath
export const selectFilteredScheduleTasksCountPreview = createCachedSelector(
  selectScheduleData,
  selectGroupIdByUserIdMap,
  selectFilter,
  (_, args) => args,
  (scheduleItems, groupIdByUserIdMap, currentFilter, { filterKey, filterValue }) => {
    const filterBy = Map({
      ...currentFilter?.get('filterByField')?.toJS(),
      [filterKey]: [filterValue],
    }) as FilterByType;

    return countFilteredValues({
      scheduleItems,
      groupIdByUserIdMap,
      filterBy,
    });
  }
)((_, args) => generateSelectorName(args, ['filterBy', 'defaultFilterBy']));

export const selectScheduleTasksAssigneesGroupsCountMap = createSelector(
  selectAllTasksByUser,
  selectGroupIdByUserIdMap,
  (scheduleTasksByUser, usersGroupsData) => {
    return Object.entries(scheduleTasksByUser).reduce((acc, [userId, tasks]) => {
      const groupId = usersGroupsData?.get(userId);
      return groupId ? mergeWith(acc, { [groupId]: tasks.length }, add) : acc;
    }, {} as Record<string, number>);
  }
);

export const selectScheduleTasksAssigneesGroups = createSelector(
  selectScheduleTasksAssigneesGroupsCountMap,
  Object.keys
);

export const selectVisibleScheduleTasksAssigneesGroups = createCachedSelector(
  selectScheduleTasksAssigneesGroups,
  (_, args) => args.maxItemsCount,
  (projectTasksAssignees, maxItemsCount) => projectTasksAssignees.slice(0, maxItemsCount)
)((_, args) => generateSelectorName(args, ['maxItemsCount']));

export const selectHiddenScheduleTasksAssigneesGroupsCount = createCachedSelector(
  selectScheduleTasksAssigneesGroups,
  selectVisibleScheduleTasksAssigneesGroups,
  (projectTasksAssignees, visibleTaskAssigneesGroups) =>
    projectTasksAssignees.length - visibleTaskAssigneesGroups.length
)((_, args) => generateSelectorName(args, ['maxItemsCount', 'filterId']));
