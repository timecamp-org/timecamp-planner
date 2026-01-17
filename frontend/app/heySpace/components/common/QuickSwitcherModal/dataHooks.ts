import { useDispatch } from 'react-redux'
import * as AppModelActions from 'models/domain/AppModel/actions'
import { onFetchLatestActiveUserConversations, onFetchUserLatestVisitedTasks } from 'models/domain/RequestModel/actions'
import { onGetOrganizationProjects } from 'models/domain/ProjectsModel/actions'
import {
  fetchAvailableSpacesRequestType,
  getAvailableOrganizationProjectsQueryParams, getHiddenConversationQueryParams, getHiddenConversationsRequestType
} from 'models/domain/ProjectsModel/requestQueryParams'
import { useCallback } from 'react'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { useSelector } from 'common/hooks/useSelector'
import { selectIsRequestRepeatable, selectRequestIsLoading } from 'models/domain/RequestModel/selectors'
import {
  getLatestActiveUserConversations,
  getUserLatestVisitedTasks
} from 'models/domain/RequestModel/constants/requestTypes'
import { QuickSwitcherState } from 'models/domain/AppModel/types'

interface DataProviderHookInterface {
  isFetchChatsRequestLoading: boolean,
  isFetchCardsRequestLoading: boolean,
  isFetchJoinableProjectsRequestLoading: boolean,
  isFetchInvisibleConversationsRequestLoading: boolean,
  isFetchChatsRequestRepeatable: boolean,
  isFetchCardsRequestRepeatable: boolean,
  isFetchJoinableProjectsRequestRepeatable: boolean,
  isFetchInvisibleConversationsRequestRepeatable: boolean,
}

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))

  return {

    isFetchChatsRequestLoading: useSelector(state => (
      selectRequestIsLoading(state, { requestType: getLatestActiveUserConversations, objectId: currentOrganizationId })
    )),

    isFetchCardsRequestLoading: useSelector(state => (
      selectRequestIsLoading(state, { requestType: getUserLatestVisitedTasks, objectId: currentOrganizationId })
    )),
    isFetchJoinableProjectsRequestLoading: useSelector(state => (
      selectRequestIsLoading(state, {
        requestType: fetchAvailableSpacesRequestType,
        objectId: currentOrganizationId,
      })
    )),
    isFetchInvisibleConversationsRequestLoading: useSelector(state => (
      selectRequestIsLoading(state, {
        requestType: getHiddenConversationsRequestType,
        objectId: currentOrganizationId,
      })
    )),
    isFetchChatsRequestRepeatable: useSelector(state => (
      selectIsRequestRepeatable(state, { requestType: getLatestActiveUserConversations, objectId: currentOrganizationId })
    )),
    isFetchCardsRequestRepeatable: useSelector(state => (
      selectIsRequestRepeatable(state, { requestType: getUserLatestVisitedTasks, objectId: currentOrganizationId })
    )),
    isFetchJoinableProjectsRequestRepeatable: useSelector(state => (
      selectIsRequestRepeatable(state, {
        requestType: fetchAvailableSpacesRequestType,
        objectId: currentOrganizationId,
      })
    )),
    isFetchInvisibleConversationsRequestRepeatable: useSelector(state => (
      selectIsRequestRepeatable(state, {
        requestType: getHiddenConversationsRequestType,
        objectId: currentOrganizationId,
      })
    )),
  }
}

interface DataPersisterHookInterface {
  onSetQuickSwitcherState: (state: QuickSwitcherState) => void,
  onFetchLatestActiveUserConversations: VoidFunction,
  onFetchUserLatestVisitedTasks: VoidFunction,
  onFetchAvailableSpaces: VoidFunction,
  onFetchInvisibleConversations: VoidFunction,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  return {
    onSetQuickSwitcherState: useCallback((state: QuickSwitcherState) => {
      dispatch(AppModelActions.onSetQuickSwitcherState(state))
    }, [dispatch]),
    onFetchLatestActiveUserConversations: useCallback(() => (
      dispatch(onFetchLatestActiveUserConversations())
    ), [dispatch]),
    onFetchUserLatestVisitedTasks: useCallback(() => (
      dispatch(onFetchUserLatestVisitedTasks(20))
    ), [dispatch]),
    onFetchAvailableSpaces: useCallback(() => (
      dispatch(onGetOrganizationProjects(getAvailableOrganizationProjectsQueryParams, false))
    ), [dispatch]),
    onFetchInvisibleConversations: useCallback(() => (
      dispatch(onGetOrganizationProjects(getHiddenConversationQueryParams))
    ), [dispatch]),
  }
}
