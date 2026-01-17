import {
  NavigationActions,
  StackActions,
  NavigationContainerComponent,
  NavigationState,
  NavigationRoute,
  NavigationParams,
  NavigationAction,
} from 'react-navigation'

import {
  DrawerActions
} from 'react-navigation-drawer'

import RouteName from "./routeNames";

import get from 'lodash/get'
import {AnyDict, Maybe} from "../../../common/types";

export class NavigationService {
  private routingNavigator: Maybe<NavigationContainerComponent>

  constructor() {
    this.routingNavigator = null
  }

  setTopLevelNavigator(navigatorRef: NavigationContainerComponent) {
    if (navigatorRef) {
      this.routingNavigator = navigatorRef
    }
  }

  private dispatch(action: NavigationAction) {
    this.routingNavigator!.dispatch(action)
  }

  navigate(routeName: RouteName, params?: AnyDict) {
    this.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    )
  }

  getNavigationState(navigationState?: NavigationState) {
    if (!navigationState) {
      return get(this.routingNavigator, 'state.nav')
    }

    return navigationState
  }

  getCurrentRoute(navigationState?: NavigationState): Maybe<NavigationRoute<NavigationParams>> {
    navigationState = this.getNavigationState(navigationState)
    if (!navigationState) {
      return null
    }

    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRoute(route as NavigationState)
    }
    return route
  }

  getCurrentRouteName(navigationState?: NavigationState): Maybe<string> {
    navigationState = this.getNavigationState(navigationState)
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route as NavigationState)
    }
    return route.routeName
  }

  onCloseDrawer() {
    this.dispatch(DrawerActions.closeDrawer())
  }

  onToggleDrawer() {
    this.dispatch(DrawerActions.toggleDrawer())
  }

  pop(numberOfScreensToPop = 1) {
    this.dispatch(StackActions.pop({ n: numberOfScreensToPop }))
  }

  replace(routeName: RouteName, params?: AnyDict) {
    this.dispatch(StackActions.replace({
      routeName,
      params,
    }))
  }

  reset(routeName: RouteName, params?: AnyDict) {
    this.dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }))
  }

  resetAdvanced(routeConfig: {routeName: string, params: AnyDict}[], index:number = 0) {
    const actions = routeConfig.map(({ routeName, params }) =>
      NavigationActions.navigate({
        routeName,
        params,
      }))

    this.dispatch(StackActions.reset({
      index,
      actions,
    }))
  }
}
