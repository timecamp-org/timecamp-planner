import { SpaceNavButtonInterface } from './index'
import { useSelector } from '../../../../common/hooks/useSelector'
import { selectIsChatMuted } from 'models/domain/NotificationsModel/selectors'
import { selectProjectHasUnreadMessages } from 'models/domain/ProjectsModel/selectors'
import RouteName from '../../AppNavigation/routeNames'
import { NavigationService } from 'common/services'
import { useCallback } from 'react'
import projectPanelType from 'components/projects/ProjectView/constants'
import { GestureResponderHandler } from "../../../types"

export type SpaceNavButtonHookInterface = {
  isMuted: boolean,
  hasUnreadMessages: boolean,
  onPress: GestureResponderHandler,
}

export default function useComponent(props: SpaceNavButtonInterface): SpaceNavButtonHookInterface {
  const isMuted = useSelector(state => selectIsChatMuted(state, { objectId: props.spaceId }))
  const hasUnreadMessages = useSelector(state => selectProjectHasUnreadMessages(state, { projectId: props.spaceId }))

  const onPress = useCallback(() => {
    requestAnimationFrame(() => {
      NavigationService.navigate(RouteName.PROJECT, { projectId: props.spaceId, selectedTab: projectPanelType.CHAT })
      NavigationService.onCloseDrawer()
    })
  }, [props.spaceId])

  return {
    isMuted,
    hasUnreadMessages,
    onPress,
  }
}