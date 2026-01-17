import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { ConversationDescriptor } from 'common/models/domain/ProjectsModel/models'
import { useSelector } from 'common/hooks/useSelector'
import { selectSortedConversationDescriptors } from 'common/models/domain/ProjectsModel/selectors'
import { selectCurrentConversationId, selectCurrentScene } from 'common/models/mobile/NavigationModel/selectors'
import { selectCurrentOrganizationId } from 'common/models/domain/OrganizationsModel/selectors/domain'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import * as ProjectsActions from 'common/models/domain/ProjectsModel/actions'
import RouteName from '../../AppNavigation/routeNames'
import { selectIsRequestFinished } from 'common/models/domain/RequestModel/selectors'
import {
  fetchOrganizationProjectsRequestType,
  organizationDirectAndGroupChatQueryParams
} from 'models/domain/ProjectsModel/requestQueryParams'

interface DataProviderHookInterface {
  conversationDescriptors: List<ConversationDescriptor>,
  currentScene: RouteName,
  currentConversationId: Id,
  currentOrganizationId: Id,
  isLoading: boolean,
}

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))
  return {
    conversationDescriptors: useSelector(state => selectSortedConversationDescriptors(state)),
    currentScene: useSelector(state => selectCurrentScene(state)),
    currentConversationId: useSelector(state => selectCurrentConversationId(state)),
    isLoading: !useSelector(state => selectIsRequestFinished(state, { requestType: fetchOrganizationProjectsRequestType, objectId: currentOrganizationId })),
    currentOrganizationId,
  }
}

interface DataPersisterHookInterface {
  onFetchTeamList: VoidFunction,
  onGetConversationSettings: VoidFunction,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onFetchTeamList = useCallback(
    () => dispatch(ProjectsActions.onGetOrganizationProjects(organizationDirectAndGroupChatQueryParams)),
    [dispatch],
  )

  const onGetConversationSettings = useCallback(
    () => dispatch(ProjectsActions.onGetConversationSettings()),
    [dispatch]
  )

  return {
    onFetchTeamList,
    onGetConversationSettings,
  }
}