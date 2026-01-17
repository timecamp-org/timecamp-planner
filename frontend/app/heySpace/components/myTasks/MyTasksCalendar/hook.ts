import { UserTracker } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { Id } from 'common/utils/identifier'

import { useDataProvider } from './dataHooks'
import { useEffect } from 'react'

export type MyTasksCalendarHookInterface = {
  projectId: Id,
  filterId: Id,
}

const useComponent = (): MyTasksCalendarHookInterface => {
  const {
    projectId,
    filterId,
  } = useDataProvider()

  useEffect(() => {
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'MyTasks', panel: 'calendar' })
  }, [])

  return {
    projectId,
    filterId,
  }
}

export default useComponent
