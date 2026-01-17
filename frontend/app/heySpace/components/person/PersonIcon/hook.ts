import {
  selectUserInitials,
  selectUserAvatarUrl,
  selectUserIsOnline,
  selectUserIsExist,
  selectUserIsBot,
} from 'models/domain/UsersModel/selectors/domain'
import { selectIsUserActiveInCurrentOrganization } from 'models/domain/OrganizationsModel/selectors/domain'
import { PersonIconInterface } from '.'
import { useSelector } from 'common/hooks/useSelector'

export type PersonIconHookInterface = {
  initials: string,
  avatarUrl: string,
  isOnline: boolean,
  isExist: boolean,
  isBot: boolean,
  isUserActive: boolean,
  shouldRenderOnlineIndicator: boolean,
}

export function useComponent({ userId, showOnlineIndicator }: PersonIconInterface): PersonIconHookInterface {
  const isUserActive = useSelector(state => selectIsUserActiveInCurrentOrganization(state, { userId }))
  return {
    initials: useSelector(state => selectUserInitials(state, { userId })),
    avatarUrl: useSelector(state => selectUserAvatarUrl(state, { userId })),
    isOnline: useSelector(state => selectUserIsOnline(state, { userId })),
    isExist: useSelector(state => selectUserIsExist(state, { userId })),
    isBot: useSelector(state => selectUserIsBot(state, { userId })),
    isUserActive,
    shouldRenderOnlineIndicator: showOnlineIndicator && isUserActive
  }
}
