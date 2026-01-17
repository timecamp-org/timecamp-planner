import { List } from 'immutable';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import {
  selectHiddenProjectTaskTagsCount,
  selectSortedProjectTasksTags,
  selectVisibleProjectTaskTags,
} from 'models/domain/TagsModel/selectors';
import {
  selectHiddenProjectTaskAssigneesCount,
  selectSortedProjectTasksAssignees,
  selectVisibleProjectTaskAssignees,
} from 'models/domain/TasksModel/selectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { DataProviderHookInterface } from './dataHooks';

import { TaskFiltersInterface } from '.';

const MAX_VISIBLE_ITEMS_COUNT = 7;

const emptyList = List<Id>();

export function useDataProvider(
  props: TaskFiltersInterface,
  targetType: TaskFiltersTargetType = TaskFiltersTargetType.KANBAN
): DataProviderHookInterface {
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const filterId = makeFilterId(currentUserId, targetType, props.containerId);

  return {
    color: useSelector((state) =>
      selectProjectColor(state, { projectId: props.containerId })
    ),

    tasksAssignees: useSelector((state) =>
      selectSortedProjectTasksAssignees(state, { projectId: props.containerId })
    ),
    visibleTaskAssignees: useSelector((state) =>
      selectVisibleProjectTaskAssignees(state, {
        projectId: props.containerId,
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),
    hiddenTaskAssigneesCount: useSelector((state) =>
      selectHiddenProjectTaskAssigneesCount(state, {
        projectId: props.containerId,
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),

    tasksTagIds: useSelector((state) =>
      selectSortedProjectTasksTags(state, { projectId: props.containerId })
    ),
    visibleTaskTags: useSelector((state) =>
      selectVisibleProjectTaskTags(state, {
        projectId: props.containerId,
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),
    hiddenTaskTagsCount: useSelector((state) =>
      selectHiddenProjectTaskTagsCount(state, {
        projectId: props.containerId,
        maxItemsCount: MAX_VISIBLE_ITEMS_COUNT,
      })
    ),

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
    filtersCount: useSelector((state) =>
      FiltersModelSelectors.selectFiltersCount(state, { filterId })
    ),
    tasksProjectIds: emptyList,
    visibleTasksProjectIds: emptyList,
    taskProjectsFilter: emptyList,
    hiddenTasksProjectIdsCount: 0,
    filterId,
  };
}
