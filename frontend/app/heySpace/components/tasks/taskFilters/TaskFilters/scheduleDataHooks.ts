import { List } from 'immutable';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectHiddenMyScheduleProjectsCount,
  selectHiddenScheduleTasksAssigneesCount,
  selectHiddenScheduleTasksAssigneesGroupsCount,
  selectScheduleProjectIds,
  selectScheduleTasksAssignees,
  selectScheduleTasksAssigneesGroups,
  selectVisibleScheduleProjectIds,
  selectVisibleScheduleTasksAssignees,
  selectVisibleScheduleTasksAssigneesGroups,
} from 'models/domain/ScheduleModel/selectors';
import { selectHiddenMyTaskTagsCount } from 'models/domain/TasksModel/selectors/myTasksSelectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { DataProviderHookInterface } from './dataHooks';

import { TaskFiltersInterface } from '.';

const MAX_VISIBLE_ITEMS_COUNT = 7;

const emptyList = List() as List<string>;

export function useDataProvider(props: TaskFiltersInterface): DataProviderHookInterface {
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const currentOrganizationId = useSelector((state) => selectCurrentOrganizationId(state));
  const filterId =
    props.filterId || makeFilterId(currentUserId, TaskFiltersContainerType.SCHEDULE, currentOrganizationId);

  return {
    tasksAssignees: List(useSelector(selectScheduleTasksAssignees)),
    visibleTaskAssignees: List(
      useSelector((state) =>
        selectVisibleScheduleTasksAssignees(state, {
          filterId,
          maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
        })
      )
    ),
    hiddenTaskAssigneesCount: useSelector((state) =>
      selectHiddenScheduleTasksAssigneesCount(state, {
        filterId,
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),
    // TODO To implement
    tasksTagIds: emptyList,
    visibleTaskTags: emptyList,
    hiddenTaskTagsCount: useSelector((state) =>
      selectHiddenMyTaskTagsCount(state, {
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),

    tasksProjectIds: List(useSelector(selectScheduleProjectIds)),
    visibleTasksProjectIds: List(
      useSelector((state) =>
        selectVisibleScheduleProjectIds(state, {
          maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
        })
      )
    ),
    hiddenTasksProjectIdsCount: useSelector((state) =>
      selectHiddenMyScheduleProjectsCount(state, {
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),

    tasksAssigneeGroups: List(useSelector(selectScheduleTasksAssigneesGroups)),
    visibleTasksAssigneeGroups: List(
      useSelector((state) =>
        selectVisibleScheduleTasksAssigneesGroups(state, {
          filterId,
          maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
        })
      )
    ),
    hiddenTasksAssigneeGroupsCount: useSelector((state) =>
      selectHiddenScheduleTasksAssigneesGroupsCount(state, {
        filterId,
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),

    taskProjectsFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'projects',
      })
    ) || emptyList) as List<Id>,
    taskStatusFilter: useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'status',
      })
    ) as TaskStatusFilterType,
    taskAssigneeFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'assigneeId',
      })
    ) || emptyList) as List<Id>,
    taskTagsFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'tags',
      })
    ) || emptyList) as List<Id>,
    taskDueDateFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'dueDate',
      })
    ) || emptyList) as List<string>,
    taskAssigneeGroupFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, {
        filterId,
        property: 'userGroup',
      })
    ) || emptyList) as List<Id>,

    filtersCount: useSelector((state) => FiltersModelSelectors.selectFiltersCount(state, { filterId })),
    filterId,
  };
}
