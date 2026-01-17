import { Id } from 'common/utils/identifier'
import { useDispatch } from 'react-redux'
import { onSetOpenedCardDetailsModalId } from 'models/domain/AppModel/actions'
import { useCallback } from 'react'

type DataPersisterHook = {
  onOpenCardDetailsModal: (taskId: Id) => void,
}

export function useDataPersister(): DataPersisterHook {
  const dispatch = useDispatch()
  return {
    onOpenCardDetailsModal: useCallback(
      (taskId: Id) => dispatch(onSetOpenedCardDetailsModalId(taskId)),
      [dispatch]
    ),
  }
}