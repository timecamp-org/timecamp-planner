import { AssigneeSearchInterface } from 'commonComponents/AssigneeSearch/index'
import { useDataHooksFactory } from 'commonComponents/AssigneeSearch/dataHooks'
import {
  ChangeEvent, useCallback, useEffect, useState
} from 'react'
import { List, Map } from 'immutable'
import { Id } from 'common/utils/identifier'
import fuzzysearch from 'fuzzysearch'
import { Maybe } from 'common/types'
import { isValidEmail } from 'common/utils/validation'
import { UserTracker } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import usePrevious from 'common/hooks/usePrevious'

const emptyList = List<Id>()

export type AssigneeSearchHookInterface = {
  objectColor: string,
  searchPhrase: string,

  assigneeIds: List<Id>,
  notAssignedUserIds: List<Id>,
  invitationError: Maybe<string>,

  onAddAssignee: (userId: Id) => void,
  onRemoveAssignee: (userId: Id) => void,
  onChangeSearchPhrase: (event: ChangeEvent<HTMLInputElement>) => void,
  onInviteUser: VoidFunction,
}

export function useComponent(
  {
    objectType,
    objectId,
    assigneeIds,
    notAssignedUserIds,
    ...props
  }: AssigneeSearchInterface
): AssigneeSearchHookInterface {
  const {
    useDataProvider,
    useDataPersister,
  } = useDataHooksFactory(objectType)

  const {
    objectColor,
    usersSearchName,
  } = useDataProvider(objectId)
  const { onCreateUserAndAddToSubscribers } = useDataPersister(objectId)

  const [searchPhrase, onSetSearchPhrase] = useState('')
  const [filteredAssigneeIds, onSetFilteredAssigneeIds] = useState(assigneeIds)
  const [filteredNotAssignedUserIds, onSetFilteredNotAssignedUserIds] = useState(notAssignedUserIds)
  const [invitationError, onSetInvitationError] = useState(null)

  const previousAssigneeIds = usePrevious(assigneeIds)

  const getFilteredAssigneeIds = useCallback((explicitSearchPhrase: string) =>
    getFilteredUserIds(assigneeIds, usersSearchName, explicitSearchPhrase),
  [assigneeIds, usersSearchName])

  const getFilteredNotAssignedUserIds = useCallback((explicitSearchPhrase: string) =>
    getFilteredUserIds(notAssignedUserIds, usersSearchName, explicitSearchPhrase),
  [usersSearchName, notAssignedUserIds])

  useEffect(() => {
    if (previousAssigneeIds && previousAssigneeIds.size !== assigneeIds.size) {
      onSetFilteredAssigneeIds(getFilteredAssigneeIds(searchPhrase))
    }
  }, [assigneeIds, getFilteredAssigneeIds, previousAssigneeIds, searchPhrase])

  const previousNotAssignedUserIds = usePrevious(notAssignedUserIds)

  useEffect(() => {
    if (previousNotAssignedUserIds && previousNotAssignedUserIds.size !== notAssignedUserIds.size) {
      onSetFilteredNotAssignedUserIds(getFilteredNotAssignedUserIds(searchPhrase))
    }
  }, [notAssignedUserIds, previousNotAssignedUserIds, searchPhrase, getFilteredNotAssignedUserIds])

  const resetSearchPhrase = useCallback(() => {
    onSetSearchPhrase('')
    onSetFilteredAssigneeIds(assigneeIds)
    onSetFilteredNotAssignedUserIds(notAssignedUserIds)
    onSetInvitationError(null)
  }, [assigneeIds, notAssignedUserIds])

  const onChangeSearchPhrase = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newSearchPhrase = event.target.value
    onSetSearchPhrase(newSearchPhrase)
    onSetFilteredAssigneeIds(getFilteredAssigneeIds(newSearchPhrase))
    onSetFilteredNotAssignedUserIds(getFilteredNotAssignedUserIds(newSearchPhrase))
  }, [getFilteredAssigneeIds, getFilteredNotAssignedUserIds])

  const onAddAssignee = (userId: Id) => {
    resetSearchPhrase()
    props.onAddAssignee(userId)
  }

  const onRemoveAssignee = (userId: Id) => {
    resetSearchPhrase()
    props.onRemoveAssignee(userId)
  }

  const onInviteUser = useCallback(() => {
    const maybeEmail = searchPhrase
    const validationResult = isValidEmail(maybeEmail, true)

    // TODO: refactor isValidEmail and get rid of those @ts-ignore comments
    // @ts-ignore
    if (!validationResult.isValid) {
      // @ts-ignore
      onSetInvitationError(validationResult.message)
    } else {
      onCreateUserAndAddToSubscribers(maybeEmail)
      resetSearchPhrase()
      UserTracker.track(UserTrackerEvent.memberInvited, { source: 'card-assignees' })
    }
  }, [searchPhrase, onCreateUserAndAddToSubscribers, resetSearchPhrase])

  return {
    objectColor,
    searchPhrase,
    assigneeIds: filteredAssigneeIds,
    notAssignedUserIds: filteredNotAssignedUserIds,
    invitationError,

    onAddAssignee,
    onRemoveAssignee,
    onInviteUser,
    onChangeSearchPhrase,

  }
}

function getFilteredUserIds(userIds: List<Id>, usersSearchName: Map<Id, string>, searchPhrase: string): List<Id> {
  let result = emptyList

  userIds.forEach(userId => {
    const name = usersSearchName.get(userId) || ''
    if (fuzzysearch(searchPhrase.toLowerCase(), name.toLowerCase())) {
      result = result.push(userId)
    }
  })

  return result
}
