import { TeamNavButtonInterface } from '.'
import { useDataPersister, useDataProvider } from './dataHooks'
import { Id } from '../../../../common/utils/identifier'
import { useCallback } from 'react'
import RouteName from '../../AppNavigation/routeNames'
import { NavigationService } from 'common/services'
import { GestureResponderHandler } from '../../../types'

export type TeamNavButtonHookInterface = {
  currentUserId: Id,
  conversationUserId: Id,
  projectId: Id,
  isUserActive: boolean,
  isUserGuest: boolean,
  onPress: GestureResponderHandler,
}

export default function useComponent(props: TeamNavButtonInterface): TeamNavButtonHookInterface {
  const { 
    currentUserId,
    isUserActive,
    isUserGuest,
    projectId,
    conversationUserId,
  } = useDataProvider(props)

  const { onCreateConversationIfDoesNotExist } = useDataPersister()

  const onPress = useCallback(() => {
    const { people } = props
    onCreateConversationIfDoesNotExist(people)

    requestAnimationFrame(() => {
      NavigationService.navigate(RouteName.CONVERSATION, { conversationId: props.conversationId })
      NavigationService.onCloseDrawer()
    })
  }, [props.conversationId])

  return {
    currentUserId,
    isUserActive,
    isUserGuest,
    projectId,
    conversationUserId,
    onPress,
  }
}