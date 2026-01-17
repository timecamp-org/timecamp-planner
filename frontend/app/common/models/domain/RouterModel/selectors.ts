import { createSelector } from 'reselect'
import { routerDomain, domain } from './constants'
import createCachedSelector from 're-reselect'
import { List, Map } from 'immutable'
import { NavigationStackItemInterface, RouterState } from './types'
import generateSelectorName from 'common/utils/generateSelectorName'
import { Id } from 'common/utils/identifier'
import { createUrlFromRoute } from './helpers'
import { AnyDict } from 'common/types'

const emptyList = List()

export const selectRouterDomain = (state) => state.get(routerDomain)

export const selectRouterModelDomain = (state) => state.get(domain) as RouterState

export const selectCurrentLocation = createSelector(
  selectRouterDomain,
  routerData => routerData.get('location'),
)

export const selectCurrentPathname = createSelector(
  selectCurrentLocation,
  location => location.get('pathname'),
)

export const selectPreviousPathname = createSelector(
  selectRouterModelDomain,
  location => location.get('previousPathname'),
)

export const selectAppHistoryStack = createSelector(
  selectRouterModelDomain,
  domain => domain.get('appHistoryStack') as Map<Id, List<NavigationStackItemInterface>>
)

export const selectActiveRouteId = createSelector(
  selectRouterModelDomain,
  domain => domain.get('activeRouteId')
)

// args: organizationId
export const selectOrganizationHistoryStack = createCachedSelector(
  selectAppHistoryStack,
  (_, args) => args.organizationId,
  (appHistoryStack, organizationId) => appHistoryStack.get(organizationId) || emptyList as List<NavigationStackItemInterface>
)
  (
    (_, args) => generateSelectorName(args, ['organizationId'])
  )

// args: organizationId
export const selectLastOrganizationHistoryRoute = createCachedSelector(
  selectOrganizationHistoryStack,
  (routes) => routes.last()
)
  (
    (_, args) => generateSelectorName(args, ['organizationId'])
  )

// args: organizationId
export const selectNextRoute = createCachedSelector(
  selectActiveRouteId,
  selectOrganizationHistoryStack,
  selectCurrentLocation,
  (activeRouteId, appHistoryStack, currentLocation) => {

    if (!activeRouteId) {
      return null
    }

    const activeRouteIndex = appHistoryStack.findIndex(route => activeRouteId === route.id)

    if (activeRouteIndex === appHistoryStack.size - 1) {
      return null
    }

    let nextRoute = appHistoryStack.get(activeRouteIndex + 1)

    const isRouteAndLocationEqual = compareRouteWithLocation(nextRoute, currentLocation)

    if (isRouteAndLocationEqual) {
      nextRoute = appHistoryStack.get(activeRouteIndex + 2)
    }

    return nextRoute
  }
)
  (
    (_, args) => generateSelectorName(args, ['organizationId'])
  )

// args: organizationId
export const selectPreviousRoute = createCachedSelector(
  selectActiveRouteId,
  selectOrganizationHistoryStack,
  selectCurrentLocation,
  (activeRouteId, appHistoryStack, currentLocation) => {
    if (!activeRouteId && appHistoryStack.size > 1) {
      return appHistoryStack.get(appHistoryStack.size - 2)
    }

    const activeRouteIndex = appHistoryStack.findIndex(route => activeRouteId === route.id)

    if (activeRouteIndex === 0) {
      return null
    }

    let previousRoute = appHistoryStack.get(activeRouteIndex - 1)
    const isRouteAndLocationEqual = compareRouteWithLocation(previousRoute, currentLocation)

    if (isRouteAndLocationEqual) {
      previousRoute = appHistoryStack.get(activeRouteIndex - 2)
    }

    return previousRoute

  }
)
  (
    (_, args) => generateSelectorName(args, ['organizationId'])
  )

function compareRouteWithLocation(route: NavigationStackItemInterface, location: Map<string, AnyDict>): boolean {
  const routeUrl = createUrlFromRoute(route)
  const locationUrl = `${location.get('pathname')}${location.get('search')}`

  return routeUrl === locationUrl
}