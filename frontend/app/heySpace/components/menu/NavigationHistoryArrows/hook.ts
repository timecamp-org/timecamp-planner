import { Maybe } from 'common/types'
import { useCallback } from 'react'
import { useHistory } from 'react-router'
import { NavigationStackItemInterface } from 'models/domain/RouterModel/types'
import { useDataPersister, useDataProvider } from './dataHooks'
import { createUrlFromRoute } from 'models/domain/RouterModel/helpers'
import { UserTracker } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'

export interface NavigationHistoryArrowsHookInterface {
  previousUrl: Maybe<string>,
  nextUrl: Maybe<string>,
  onGoPrevious: VoidFunction,
  onGoNext: VoidFunction,
}

export default function useComponent(): NavigationHistoryArrowsHookInterface {
  const { previousRoute, nextRoute } = useDataProvider()
  const { onOpenCardDetailsModal, onSetActiveRouteId } = useDataPersister()

  const previousUrl = createUrlFromRoute(previousRoute)
  const nextUrl = createUrlFromRoute(nextRoute)

  const history = useHistory()

  const onOpenUrl = useCallback((url: string, route: NavigationStackItemInterface) => {
    history.push(url, { selfControlled: true })
    onSetActiveRouteId(route.id)
    if (route?.taskId) {
      onOpenCardDetailsModal(route.taskId)
    }
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'Navigation arrows' })
  }, [onSetActiveRouteId, onOpenCardDetailsModal])

  const onGoPrevious = useCallback(() => {
    onOpenUrl(previousUrl, previousRoute)
  }, [previousUrl, previousRoute, onOpenUrl])

  const onGoNext = useCallback(() => {
    onOpenUrl(nextUrl, nextRoute)
  }, [nextUrl, nextRoute, onOpenUrl])

  return {
    previousUrl,
    nextUrl,
    onGoPrevious,
    onGoNext
  }
}
