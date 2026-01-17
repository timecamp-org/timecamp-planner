import { useDispatch } from 'react-redux'
import { Id } from 'common/utils/identifier'
import { useCallback } from 'react'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { useSelector } from 'common/hooks/useSelector'
import { NavigationStackItemInterface } from 'models/domain/RouterModel/types'
import { selectPreviousRoute, selectNextRoute, selectLastOrganizationHistoryRoute } from 'models/domain/RouterModel/selectors'
import { onSetOpenedCardDetailsModalId } from 'models/domain/AppModel/actions'
import { onSetActiveRouteId, onPushRouteToHistoryStack } from 'models/domain/RouterModel/actions'

export type DataProviderHook = {
  previousRoute: NavigationStackItemInterface,
  nextRoute: NavigationStackItemInterface,
  lastRoute: NavigationStackItemInterface,
  organizationId: Id,
};

export function useDataProvider(): DataProviderHook {
  const organizationId = useSelector(selectCurrentOrganizationId)
  const previousRoute = useSelector(state => selectPreviousRoute(state, { organizationId }))
  const nextRoute = useSelector(state => selectNextRoute(state, { organizationId }))
  const lastRoute = useSelector(state => selectLastOrganizationHistoryRoute(state, { organizationId }))

  return {
    previousRoute,
    nextRoute,
    lastRoute,
    organizationId,
  }
}

export type DataPersisterHook = {
  onOpenCardDetailsModal: (taskId: Id) => void,
  onSetActiveRouteId: (id: Id) => void,
  onPushRoute: (oute: NavigationStackItemInterface, organizationId: Id) => void,
};

export function useDataPersister(): DataPersisterHook {
  const dispatch = useDispatch()

  return {
    onOpenCardDetailsModal: useCallback(
      (taskId: Id) => dispatch(onSetOpenedCardDetailsModalId(taskId, true)),
      [dispatch]
    ),
    onSetActiveRouteId: useCallback(
      (id: Id) => dispatch(onSetActiveRouteId(id)),
      [dispatch]
    ),
    onPushRoute: useCallback((route: NavigationStackItemInterface, organizationId: Id) => {
      dispatch(onPushRouteToHistoryStack(organizationId, route))
    }, [dispatch])
  }
}
