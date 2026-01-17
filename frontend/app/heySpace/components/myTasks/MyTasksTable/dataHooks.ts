import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { List, Map } from 'immutable'
import { SortOrder, TaskFiltersContainerType } from 'models/component/FiltersModel/types'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import { selectFilteredAllTasksAssignedToUser } from 'models/domain/TasksModel/selectors'
import { TaskSortKey } from 'models/domain/TasksModel/types'

const defaultSortBy = Map({ [TaskSortKey.PROGRESS]: SortOrder.ASC })

type DataProviderHook = {
  currentUserId: Id,
  filterId: Id,
  taskIds: List<Id>,
}

export function useDataProvider(): DataProviderHook {
  const currentOrganizationId = useSelector(selectCurrentOrganizationId)
  const currentUserId = useSelector(selectCurrentUserId)
  const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.MY_TASKS, currentOrganizationId)
  return {
    currentUserId,
    filterId,
    taskIds: useSelector(state => selectFilteredAllTasksAssignedToUser(state, {
      filterId,
      userId: currentUserId,
      defaultSortBy,
    }))
  }
}