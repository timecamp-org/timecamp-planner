import { Id } from 'common/utils/identifier'

import { useDataProvider, useDataPersister } from './dataHooks'
import { useEffect } from 'react'
import usePrevious from 'common/hooks/usePrevious'
import { UserTracker } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'

export type MyTasksTimelineHookInterface = {
  projectId: Id,
  viewId: Id,
  filterId: Id,
  isLoading: boolean,
}

const useComponent = (): MyTasksTimelineHookInterface => {
  const {
    projectId,
    viewId,
    filterId,
    isTimelineViewRequestFinished,
    isTimelineViewRequestRepeatable
  } = useDataProvider()

  const prevProjectId = usePrevious(projectId)

  const {
    onCreateViewSettings,
    onFetchTimelineViewSettings,
  } = useDataPersister(projectId)

  useEffect(() => {
    if (projectId !== prevProjectId && isTimelineViewRequestRepeatable) {
      onFetchTimelineViewSettings()
    }
  }, [
    isTimelineViewRequestRepeatable,
    projectId,
    prevProjectId,
    onFetchTimelineViewSettings
  ])

  useEffect(() => {
    if (isTimelineViewRequestFinished && !viewId) {
      onCreateViewSettings()
    }
  }, [isTimelineViewRequestFinished, viewId, onCreateViewSettings])

  useEffect(() => {
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'MyTasks', panel: 'timeline' })
  }, [])

  return {
    projectId,
    viewId,
    filterId,
    isLoading: !isTimelineViewRequestFinished || !viewId,
  }
}

export default useComponent
