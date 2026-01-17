import { useSelector } from 'common/hooks/useSelector'
import { DataProviderHookInterface } from './dataHooks'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'
import { TaskFiltersResultsCountInterface } from '.'
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors'
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers'
import { getConversationViewData } from 'models/domain/RequestModel/constants/requestTypes'
import { selectFilteredMyTaskIdsCountPreview } from 'models/domain/TasksModel/selectors/myTasksSelectors'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { generateConversationId } from 'common/utils/generateCombinedId'
import { selectProjectIdByObjectId } from 'models/domain/ProjectsModel/selectors'


export function useDataProvider(props: TaskFiltersResultsCountInterface): DataProviderHookInterface {
  let resultsCount
  const [filterKey, filterValue] = props.filterPath

  const fetchArchived = filterKey === 'status' && filterValue === TaskStatusFilterType.ARCHIVED
  const requestParams = {
    fetchArchived,
  }

  const currentUserId = useSelector(selectCurrentUserId)
  const currentOrganizationId = useSelector(selectCurrentOrganizationId)
  const selfConversationId = generateConversationId([currentUserId], currentOrganizationId)
  const projectId = useSelector(state => selectProjectIdByObjectId(state, { objectId: selfConversationId }))

  const isFetchArchivedConversationViewDataRequestSuccess = useSelector(state => selectRequestIsSuccess(state, {
    requestType: getRequestTypeWithParams(getConversationViewData, requestParams),
    objectId: projectId,
  }))

  resultsCount = useSelector(state => selectFilteredMyTaskIdsCountPreview(state, {
    filterId: props.filterId,
    filterPath: props.filterPath,
  }))

  if (fetchArchived && !isFetchArchivedConversationViewDataRequestSuccess) {
    resultsCount = null
  }

  return {
    resultsCount
  }
}
