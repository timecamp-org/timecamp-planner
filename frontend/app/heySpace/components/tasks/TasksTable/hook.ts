import { Id } from 'common/utils/identifier'
import { useDataPersister } from './dataHooks'

export type TasksTableHookInterface = {
  onOpenCardDetailsModal: (taskId: Id) => void,
}

const useComponent = (): TasksTableHookInterface => {
  const {
    onOpenCardDetailsModal,
  } = useDataPersister()


  return {
    onOpenCardDetailsModal,
  }
}

export default useComponent