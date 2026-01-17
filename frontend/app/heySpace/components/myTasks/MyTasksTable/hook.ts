import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { UserTracker } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'

import { useDataProvider } from './dataHooks'
import { useEffect } from 'react'

export type MyTasksTableHookInterface = {
  taskIds: List<Id>,
  filterId: Id,
}

const useComponent = (): MyTasksTableHookInterface => {
  const {
    filterId,
    taskIds,
  } = useDataProvider()

  useEffect(() => {
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'MyTasks', panel: 'list' })
  }, [])

  return {
    taskIds,
    filterId,
  }
}

export default useComponent
