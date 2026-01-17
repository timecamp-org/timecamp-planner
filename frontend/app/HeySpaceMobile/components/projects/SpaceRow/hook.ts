import { SpaceRowInterface } from './index'
import { useCallback } from 'react'
import { NavigationService } from 'common/services'
import RouteName from '../../AppNavigation/routeNames'
import { GestureResponderHandler } from "../../../types"
import { useDispatch } from 'react-redux'
import { ProjectPeopleRole } from '../../../../common/models/domain/ProjectsModel/types'
import { onMemberAdd } from 'models/domain/ProjectsModel/actions'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { useSelector } from '../../../../common/hooks/useSelector'

export type SpaceRowHookInterface = {
  onPress: GestureResponderHandler,
}

export const useComponent = (props: SpaceRowInterface): SpaceRowHookInterface => {

  const currentUserId = useSelector(state => selectCurrentUserId(state))

  const onNavigateToSpace = useCallback(() => {
    NavigationService.onCloseDrawer()
    NavigationService.navigate(RouteName.PROJECT, { projectId: props.spaceId })
    props.onClose()
  }, [props.onClose, props.spaceId])

  const dispatch = useDispatch()

  const onAddUserToSpace = useCallback(
    () => dispatch(onMemberAdd(props.spaceId, currentUserId, ProjectPeopleRole.MEMBER)),
    [dispatch, props.spaceId, currentUserId])

  const onJoinSpace = useCallback(() => {
    onAddUserToSpace()
    onNavigateToSpace()
  }, [onNavigateToSpace, onAddUserToSpace, currentUserId, props.spaceId])

  const onPress = useCallback(() => {
    if (props.isJoinable) {
      onJoinSpace()
    } else {
      onNavigateToSpace()
    }
  }, [onJoinSpace, onNavigateToSpace, props.isJoinable])

  return {
    onPress,
  }
}