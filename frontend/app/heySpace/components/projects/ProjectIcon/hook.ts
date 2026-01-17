import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId, selectUsersAvatarUrl } from 'models/domain/UsersModel/selectors/domain'
import { selectProjectIsOneToOneConversation } from 'models/domain/ProjectsModel/selectors'
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain'
import { selectUsersInitials } from 'models/domain/UsersModel/selectors'
import { List, Map } from 'immutable'
import { Id } from 'common/utils/identifier'
import { useMemo } from 'react'

export type ProjectIconHookInterface = {
  isOneToOneConversation: boolean,
  avatarDescriptors: List<AvatarDescriptor>,
}

export default function useComponent(projectId: Id): ProjectIconHookInterface {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const isOneToOneConversation = useSelector(state => selectProjectIsOneToOneConversation(state, { projectId }))
  const people = useSelector(state => selectProjectPeople(state, { projectId }))
  const usersInitials = useSelector(state => selectUsersInitials(state))
  const usersAvatarUrl = useSelector(state => selectUsersAvatarUrl(state))
  const avatarDescriptors = useMemo(
    () => getUserAvatarDescriptors(people, usersAvatarUrl, usersInitials, currentUserId),
    [people, usersAvatarUrl, usersInitials, currentUserId]
  )

  return {
    isOneToOneConversation,
    avatarDescriptors,
  }
}

export type AvatarDescriptor = {
  avatarUrl: string,
  initials: string,
  userId: Id,
}

function getUserAvatarDescriptors(
  people: List<Id>,
  usersAvatarUrl: Map<Id, string>,
  usersInitials: Map<Id, string>,
  currentUserId: Id
): List<AvatarDescriptor> {
  let result = List<AvatarDescriptor>()

  for (let i = 0; i < people.size; i++) {
    const userId = people.get(i)
    const avatarUrl = usersAvatarUrl.get(userId)
    const initials = usersInitials.get(userId)
    result = result.push({ avatarUrl, initials, userId })
  }

  result = result.sort((a, b) => {
    if (a.avatarUrl && a.userId !== currentUserId) {
      return -1
    } else if (b.avatarUrl && b.userId !== currentUserId) {
      return 1
    } else if (a.userId === currentUserId) {
      return 1
    } else if (b.userId === currentUserId) {
      return -1
    } else {
      return 0
    }
  }) as List<AvatarDescriptor>

  return result
}