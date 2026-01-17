import {
  DataPersisterHookInterface,
  DataProviderHookInterface,
} from 'commonComponents/AssigneeSearch/dataHooks'
import { useDispatch } from 'react-redux'
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'
import { useCallback } from 'react'
import { onCreateUserAndAddToSubscribers } from 'models/domain/ChecklistsModel/actions'
import { selectChecklistItemColor } from 'models/domain/ChecklistsModel/selectors'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'

export function useDataProvider(objectId: Id): DataProviderHookInterface {
  return {
    // @ts-ignore
    objectColor: useSelector(state => selectChecklistItemColor(state, { checklistItemId: objectId })),
    usersSearchName: useSelector(state => selectUsersSearchName(state))
  }
}

export function useDataPersister(objectId: Id): DataPersisterHookInterface {
  const dispatch = useDispatch()

  return {
    onCreateUserAndAddToSubscribers: useCallback((email) => dispatch(
      onCreateUserAndAddToSubscribers(objectId, email)
    ), [dispatch, objectId])
  }
}