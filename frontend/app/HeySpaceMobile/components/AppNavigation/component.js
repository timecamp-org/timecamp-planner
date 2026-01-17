import React from 'react'

import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import AppLoader from '../AppLoader'
import RouteName from './routeNames'
import AuthNavigationFlow from './AuthNavigationFlow'
import MainNavigationFlow from './MainNavigationFlow'

const AppContainer = createAppContainer(createSwitchNavigator({
  [RouteName.AUTH_FLOW]: AuthNavigationFlow,
  [RouteName.MAIN_FLOW_DRAWER]: MainNavigationFlow,
}, {
  initialRouteName: RouteName.AUTH_FLOW,
}))

const renderAppLoader = () => <AppLoader isLoading />

function AppNavigation({
  onNavigationStateChange, persistNavigationState, loadNavigationState, setTopLevelNavigator,
}) {
  return (
    <AppContainer
      ref={setTopLevelNavigator}
      onNavigationStateChange={onNavigationStateChange}
      persistNavigationState={persistNavigationState}
      loadNavigationState={loadNavigationState}
      renderLoadingExperimental={renderAppLoader}
    />
  )
}

export default AppNavigation
