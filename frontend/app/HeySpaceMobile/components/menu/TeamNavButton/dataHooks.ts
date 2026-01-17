import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { TeamNavButtonInterface } from '.'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectIsUserActiveInCurrentOrganization } from 'models/domain/OrganizationsModel/selectors/domain'
import { 
  selectProjectIdByConversationId,
  selectDirectChatPartner,
 } from 'models/domain/ProjectsModel/selectors'
import { selectIsUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors/domain';
import { List } from 'immutable'
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions'

interface DataProviderHookInterface {
  currentUserId: Id,
  conversationUserId: Id,
  projectId: Id,
  isUserActive: boolean,
  isUserGuest: boolean,
}

export const useDataProvider = (props: TeamNavButtonInterface): DataProviderHookInterface => {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const conversationUserId = useSelector(state => selectDirectChatPartner(state, { conversationId: props.conversationId }))
  const projectId = useSelector(state => selectProjectIdByConversationId(state, { conversationId: props.conversationId })) || props.conversationId
  return {
    currentUserId,
    isUserActive: useSelector(state => selectIsUserActiveInCurrentOrganization(state, { userId: conversationUserId })),
    isUserGuest: useSelector(state => selectIsUserOrganizationGuest(state, { conversationUserId })),
    projectId,
    conversationUserId,
  }
}

interface DataPersisterHookInterface {
  onCreateConversationIfDoesNotExist: (people: List<Id>) => void,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onCreateConversationIfDoesNotExist = useCallback(
    (people: List<Id>) => dispatch(
      ProjectsModelActions.onCreateConversationIfDoesNotExist(people)
    ),
    [dispatch],
  )

  return {
    onCreateConversationIfDoesNotExist,
  }
}