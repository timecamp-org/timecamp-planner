import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { DataProviderHookInterface } from './dataHooks'
import { TaskFiltersInterface } from '.'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'

import {
  selectHiddenProjectTimelineTaskAssigneesCount,
  selectSortedTimelineTasksAssignees,
  selectVisibleProjectTimelineTaskAssignees,
  selectVisibleProjectTimelineTaskTags,
  selectHiddenProjectTimelineTaskTagsCount, selectSortedProjectTimelineTasksTags
} from 'models/domain/TasksModel/selectors/timelineSelectors'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'
import { selectViewSettingsIdByTypeAndContainerId } from 'models/domain/ViewSettingsModel/selectors/domain'
import { ViewSettingsViewType, ViewContainerType } from 'models/domain/ViewSettingsModel/types'
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types'

const MAX_VISIBLE_ITEMS_COUNT = 7

const emptyList = List<Id>()

export function useDataProvider(props: TaskFiltersInterface): DataProviderHookInterface {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.OVERWATCH_SPACE_TILE, props.containerId)
  const viewId = useSelector(state => selectViewSettingsIdByTypeAndContainerId(state, {
    viewType: ViewSettingsViewType.TIMELINE,
    containerId: props.containerId,
    containerType: ViewContainerType.OVERWATCH_SPACE_TILE,
  }))
  return {
    color: useSelector(state => selectProjectColor(state, { projectId: props.containerId })),

    tasksAssignees: useSelector(state => selectSortedTimelineTasksAssignees(state, { projectId: props.containerId, viewId })),
    visibleTaskAssignees: useSelector(state => selectVisibleProjectTimelineTaskAssignees(state, { projectId: props.containerId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT, viewId })),
    hiddenTaskAssigneesCount: useSelector(state => selectHiddenProjectTimelineTaskAssigneesCount(state, { projectId: props.containerId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT, viewId })),

    tasksTagIds: useSelector(state => selectSortedProjectTimelineTasksTags(state, { projectId: props.containerId, viewId })),
    visibleTaskTags: useSelector(state => selectVisibleProjectTimelineTaskTags(state, { projectId: props.containerId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT, viewId })),
    hiddenTaskTagsCount: useSelector(state => selectHiddenProjectTimelineTaskTagsCount(state, { projectId: props.containerId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT, viewId })),

    taskStatusFilter: useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'status' })) as TaskStatusFilterType,
    taskAssigneeFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'assigneeId' })) || emptyList) as List<Id>,
    taskTagsFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'tags' })) || emptyList) as List<Id>,
    taskDueDateFilter: (useSelector(state => FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'dueDate' })) || emptyList) as List<string>,
    filtersCount: useSelector(state => FiltersModelSelectors.selectFiltersCount(state, { filterId })),
    tasksProjectIds: emptyList,
    taskProjectsFilter: emptyList,
    visibleTasksProjectIds: emptyList,
    hiddenTasksProjectIdsCount: 0,
    filterId,
  }
}
