import { useDataPersister, useDataProvider } from './dataHooks'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'
import RouteName from '../../AppNavigation/routeNames'
import { Id } from 'common/utils/identifier'
import useLazyList from 'common/hooks/useLazyList'
import { ConversationDescriptor } from '../../../../common/models/domain/ProjectsModel/models'
import { List } from 'immutable'
import usePrevious from '../../../../common/hooks/usePrevious'
import useRefreshData from "common/hooks/useRefreshData"
import { onGetOrganizationProjects } from "common/models/domain/ProjectsModel/actions"
import { organizationDirectAndGroupChatQueryParams as queryParams } from 'models/domain/ProjectsModel/requestQueryParams'

const refreshControllerOptions = {
  action: onGetOrganizationProjects,
  paramsToInject: [{
    key: 'params',
    defaultValue: queryParams
  }],
}
interface TeamNavLinkListHookInterface {
  conversationDescriptors: List<ConversationDescriptor>,
  isLoading: boolean,
  isSelected: (conversationId: Id) => boolean,
}

export const useComponent = (): TeamNavLinkListHookInterface => {
  useRefreshData({}, refreshControllerOptions)
  
  const {
    conversationDescriptors,
    currentScene,
    currentConversationId,
    currentOrganizationId,
    isLoading,
  } = useDataProvider()

  const prevCurrentOrganizationId = usePrevious(currentOrganizationId)

  const { slicedItemIds: dynamicConversationDescriptors } = useLazyList<ConversationDescriptor>(
    conversationDescriptors,
    currentOrganizationId,
    10,
  )

  const isSelected = useCallback((conversationId: Id): boolean => {
    return currentScene === RouteName.CONVERSATION && conversationId === currentConversationId
  }, [currentScene, currentConversationId])

  const dataPersister = useDataPersister()

  useEffect(() => {
    if (prevCurrentOrganizationId !== currentOrganizationId && currentOrganizationId) {
      InteractionManager.runAfterInteractions(() => {
        dataPersister.onFetchTeamList()
        dataPersister.onGetConversationSettings()
      })
    }
  }, [currentOrganizationId, prevCurrentOrganizationId])
  

  return {
    conversationDescriptors: dynamicConversationDescriptors,
    isLoading,
    isSelected,
  }
}