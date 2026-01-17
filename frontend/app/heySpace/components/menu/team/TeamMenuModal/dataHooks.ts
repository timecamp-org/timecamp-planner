import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'common/hooks/useSelector'

import { Id } from 'common/utils/identifier'
import { List, Map } from 'immutable'
import { UserToInvite } from 'models/domain/OrganizationsModel/types'

import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'
import * as RequestModelSelectors from 'models/domain/RequestModel/selectors'

import { selectCurrentUserId, selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'

import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors'
import { selectAllDirectConversationUserIds, selectAvailableDirectConversationUserIds } from 'models/domain/ProjectsModel/selectors'

import { onCreateConversationIfDoesNotExist } from 'models/domain/ProjectsModel/actions'
import { onInviteUsersToOrganization, onInviteGuestsToOrganization } from 'models/domain/OrganizationsModel/actions'

export type DataProviderHookInterface = {
  isInviting: boolean,
  userIds: List<Id>,
  userSearchName: Map<Id, string>,
  currentUserId: Id,
  organizationId: Id,
  canCurrentUserInvitePeople: boolean,
  isCurrentSubscriptionFree: boolean,
}

export const useDataProvider = (isShowingDisabled: boolean): DataProviderHookInterface => {
  const currentUserId = useSelector(selectCurrentUserId)
  const organizationId = useSelector(selectCurrentOrganizationId)

  return {
    isInviting: useSelector(state => RequestModelSelectors.selectRequestIsLoading(state, { requestType: RequestTypesConstants.inviteUsersToConversations, objectId: organizationId }) ||
      RequestModelSelectors.selectRequestIsLoading(state, { requestType: RequestTypesConstants.inviteGuestsToOrganization, objectId: organizationId })),
    userSearchName: useSelector(selectUsersSearchName),
    currentUserId,
    organizationId,
    canCurrentUserInvitePeople: useSelector(state => !selectIsCurrentUserOrganizationGuest(state)),
    isCurrentSubscriptionFree: false,
    userIds: useSelector(isShowingDisabled ? selectAllDirectConversationUserIds : selectAvailableDirectConversationUserIds),
  }
}

export type DataPersisterHookInterface = {
  onInviteUsersToOrganization: (users: UserToInvite[]) => void,
  onInviteGuestsToOrganization: (guests: string[], spaceIds: Id[]) => void,
  onCreateConversationIfDoesNotExist: (people: List<string>) => void
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  return {
    onInviteUsersToOrganization: useCallback(
      (users) => dispatch(onInviteUsersToOrganization(users, false, true)),
      [dispatch],
    ),
    onInviteGuestsToOrganization: useCallback(
      (guestEmails, spaceIds) => dispatch(onInviteGuestsToOrganization(guestEmails, spaceIds)),
      [dispatch],
    ),
    onCreateConversationIfDoesNotExist: useCallback(
      (people) => dispatch(onCreateConversationIfDoesNotExist(people)),
      [dispatch]
    )
  }
}
