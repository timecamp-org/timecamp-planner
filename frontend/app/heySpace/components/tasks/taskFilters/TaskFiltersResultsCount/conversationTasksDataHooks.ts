import { useSelector } from 'common/hooks/useSelector'
import { DataProviderHookInterface } from './dataHooks'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'
import { TaskFiltersResultsCountInterface } from '.'
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors'
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers'
import { getConversationViewData } from 'models/domain/RequestModel/constants/requestTypes'
import { selectFilteredAllTasksAssignedToUserCountPreview } from 'models/domain/TasksModel/selectors/conversationTasksSelectors'
import { selectDirectChatPartner, selectConversationIdByProjectId } from 'models/domain/ProjectsModel/selectors'


export function useDataProvider(props: TaskFiltersResultsCountInterface): DataProviderHookInterface {
  let resultsCount
  const [filterKey, filterValue] = props.filterPath
  const fetchArchived = filterKey === 'status' && filterValue === TaskStatusFilterType.ARCHIVED
  const requestParams = {
    fetchArchived,
  }
  const isFetchArchivedConversationViewDataRequestSuccess = useSelector(state => selectRequestIsSuccess(state, {
    requestType: getRequestTypeWithParams(getConversationViewData, requestParams),
    objectId: props.containerId,
  }))
  const conversationId = useSelector(state => selectConversationIdByProjectId(state, { projectId: props.containerId }))
  const userId = useSelector(state => selectDirectChatPartner(state, { conversationId }))

  resultsCount = useSelector(state => selectFilteredAllTasksAssignedToUserCountPreview(state, {
    filterId: props.filterId,
    userId,
    filterPath: props.filterPath,
  }))

  if (fetchArchived && !isFetchArchivedConversationViewDataRequestSuccess) {
    resultsCount = null
  }

  return {
    resultsCount
  }
}
