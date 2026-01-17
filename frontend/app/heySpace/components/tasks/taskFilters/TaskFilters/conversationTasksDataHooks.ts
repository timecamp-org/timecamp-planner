import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import * as FiltersModelSelectors from 'models/component/FiltersModel/selectors'
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types'
import { DataProviderHookInterface } from './dataHooks'
import { TaskFiltersInterface } from '.'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'
import { selectConversationIdByProjectId, selectDirectChatPartner } from 'models/domain/ProjectsModel/selectors'
import {
  selectSortedConversationTasksAssignees,
  selectVisibleConversationTaskAssignees,
  selectHiddenConversationTaskAssigneesCount,
  selectVisibleConversationTaskTags,
  selectHiddenConversationTaskTagsCount,
  selectSortedConversationTasksTags,
} from 'models/domain/TasksModel/selectors/conversationTasksSelectors';

const MAX_VISIBLE_ITEMS_COUNT = 7;

const emptyList = List<Id>();

export function useDataProvider(
  props: TaskFiltersInterface,
  targetType: TaskFiltersTargetType = TaskFiltersTargetType.KANBAN
): DataProviderHookInterface {
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const filterId = makeFilterId(currentUserId, targetType, props.containerId);

  const conversationId = useSelector((state) =>
    selectConversationIdByProjectId(state, { projectId: props.containerId })
  );
  const userId = useSelector((state) => selectDirectChatPartner(state, { conversationId }));

  return {
    tasksAssignees: useSelector((state) => selectSortedConversationTasksAssignees(state, { userId })),
    visibleTaskAssignees: useSelector((state) =>
      selectVisibleConversationTaskAssignees(state, { userId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })
    ),
    hiddenTaskAssigneesCount: useSelector((state) =>
      selectHiddenConversationTaskAssigneesCount(state, { userId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })
    ),

    tasksTagIds: useSelector((state) => selectSortedConversationTasksTags(state, { userId })),
    visibleTaskTags: useSelector((state) =>
      selectVisibleConversationTaskTags(state, { userId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })
    ),
    hiddenTaskTagsCount: useSelector((state) =>
      selectHiddenConversationTaskTagsCount(state, { userId, maxItemsCount: MAX_VISIBLE_ITEMS_COUNT })
    ),

    taskStatusFilter: useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'status' })
    ) as TaskStatusFilterType,
    taskAssigneeFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'assigneeId' })
    ) || emptyList) as List<Id>,
    taskTagsFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'tags' })
    ) || emptyList) as List<Id>,
    taskDueDateFilter: (useSelector((state) =>
      FiltersModelSelectors.selectFilterByProperty(state, { filterId, property: 'dueDate' })
    ) || emptyList) as List<string>,
    filtersCount: useSelector((state) => FiltersModelSelectors.selectFiltersCount(state, { filterId })),
    tasksProjectIds: emptyList,
    visibleTasksProjectIds: emptyList,
    taskProjectsFilter: emptyList,
    hiddenTasksProjectIdsCount: 0,
    filterId,
  };
}
