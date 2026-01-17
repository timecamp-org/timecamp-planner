import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors'
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types'
import { DataProviderHookInterface } from './dataHooks'
import {
  selectVisibleMyTaskTags,
  selectHiddenMyTaskTagsCount,
  selectMyTasksProjectIds,
  selectVisibleMyTaskProjectIds,
  selectHiddenMyTaskProjectsCount,
  selectSortedMyTasksAssignees,
  selectVisibleMyTaskAssignees,
  selectHiddenMyTaskAssigneesCount, selectSortedMyTasksTags
} from 'models/domain/TasksModel/selectors/myTasksSelectors'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { TaskFiltersInterface } from '.'

const MAX_VISIBLE_ITEMS_COUNT = 7

const emptyList = List()

export function useDataProvider(
  props: TaskFiltersInterface,
): DataProviderHookInterface {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))
  const filterId = props.filterId || makeFilterId(currentUserId, TaskFiltersContainerType.MY_TASKS, currentOrganizationId)
  return {
    tasksAssignees: useSelector(state => selectSortedMyTasksAssignees(state)),
    visibleTaskAssignees: useSelector(state => selectVisibleMyTaskAssignees(state, { filterId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })),
    hiddenTaskAssigneesCount: useSelector(state => selectHiddenMyTaskAssigneesCount(state, { filterId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })),

    tasksTagIds: useSelector(state => selectSortedMyTasksTags(state)),
    visibleTaskTags: useSelector(state => selectVisibleMyTaskTags(state, { maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })),
    hiddenTaskTagsCount: useSelector(state => selectHiddenMyTaskTagsCount(state, { maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })),

    tasksProjectIds: useSelector(state => selectMyTasksProjectIds(state)),
    visibleTasksProjectIds: useSelector(state => selectVisibleMyTaskProjectIds(state, { maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })),
    hiddenTasksProjectIdsCount: useSelector(state => selectHiddenMyTaskProjectsCount(state, { maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })),

    taskProjectsFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'projects' })) || emptyList) as List<Id>,
    taskStatusFilter: useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'status' })) as TaskStatusFilterType,
    taskAssigneeFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'assigneeId' })) || emptyList) as List<Id>,
    taskTagsFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'tags' })) || emptyList) as List<Id>,
    taskDueDateFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'dueDate' })) || emptyList) as List<string>,
    filtersCount: useSelector(state => FiltersModelSelectors.selectFiltersCount(state, { filterId })),
    filterId,
  }
}
