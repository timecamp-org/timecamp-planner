import {
  selectUserInitials,
  selectUserAvatarUrl,
  selectUserIsOnline,
  selectUserIsExist,
  selectUserIsBot,
} from 'models/domain/UsersModel/selectors/domain'
import { selectIsUserActiveInCurrentOrganization } from 'models/domain/OrganizationsModel/selectors/domain'
import { useSelector } from 'react-redux'
import { PersonIconInterface } from '.'

export type PersonIconHookInterface = {
  avatarUrl: string,
  userInitials: string,
  isExist: boolean,
  isBot: boolean,
  isOnline: boolean,
  shouldRenderOnlineIndicator: boolean,
  isUserActive: boolean,
}

export default function useComponent(props: PersonIconInterface): PersonIconHookInterface {
  const userInitials = useSelector(state => selectUserInitials(state, { userId: props.userId }))
  const avatarUrl = useSelector(state => selectUserAvatarUrl(state, { userId: props.userId }))
  const isOnline = useSelector(state => selectUserIsOnline(state, { userId: props.userId }))
  const isExist = useSelector(state => selectUserIsExist(state, { userId: props.userId }))
  const isBot = useSelector(state => selectUserIsBot(state, { userId: props.userId }))
  const isUserActive = useSelector(state => selectIsUserActiveInCurrentOrganization(state, { userId: props.userId }))

  const shouldRenderOnlineIndicator = props.showOnlineIndicator && isUserActive
  
  return {
    shouldRenderOnlineIndicator,
    userInitials,
    isBot,
    isOnline,
    isUserActive,
    avatarUrl,
    isExist,
  }
}