import {
  DataPersisterHookInterface,
  DataProviderHookInterface,
} from 'commonComponents/AssigneeSearch/dataHooks'
import { useDispatch } from 'react-redux'
import { selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'
import { useCallback } from 'react'
import { onCreateUserAndAddToSubscribers } from 'models/domain/TasksModel/actions'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'
import { TaskPeopleRole } from 'models/domain/TasksModel/types'
import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'

export function useDataProvider(objectId: Id): DataProviderHookInterface {
  return {
    objectColor: useSelector(state => selectTaskColor(state, { taskId: objectId })),
    usersSearchName: useSelector(state => selectUsersSearchName(state))
  }
}

export function useDataPersister(objectId: Id): DataPersisterHookInterface {
  const dispatch = useDispatch()

  return {
    onCreateUserAndAddToSubscribers: useCallback((email) => dispatch(
      onCreateUserAndAddToSubscribers(objectId, email, TaskPeopleRole.ASSIGNEE)
    ), [dispatch, objectId])
  }
}