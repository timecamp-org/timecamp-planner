import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { generateConversationId } from 'common/utils/generateCombinedId'
import { selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors'
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types'
import { makeFilterId } from 'models/component/FiltersModel/utils'


type DataProviderHook = {
  projectId: Id,
  filterId: Id,
}

export function useDataProvider(): DataProviderHook {
  const currentOrganizationId = useSelector(selectCurrentOrganizationId)
  const currentUserId = useSelector(selectCurrentUserId)
  const conversationId = generateConversationId([currentUserId], currentOrganizationId)
  const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.MY_TASKS, currentOrganizationId)
  const projectId = useSelector(state => selectProjectIdByConversationId(state, { conversationId }))
  return {
    projectId,
    filterId,
  }
}
