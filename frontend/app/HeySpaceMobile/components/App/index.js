import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { Provider as StoreProvider } from 'react-redux'
import AppNavigation from '../AppNavigation'
import AppController from '../AppController'
import NavigationController from '../projects/NavigationController'
import AppLoader from '../AppLoader'
import { RootStore } from 'common/rootStore'
import GlobalErrorBoundary from '../common/GlobalErrorBoundary'
import PopUpAlertsController from '../common/PopUpAlertsController'
import UserInOrganizationController from '../workspace/UserInOrganizationController'
import CurrentOrganizationController from '../workspace/CurrentOrganizationController'
import RNBootSplash from "react-native-bootsplash";
import styles from './styles'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { defaultFontFamily } from 'styles/common'
import GlobalFont from 'react-native-global-font'
import isIOS from '../../utils/isIOS'
import AppModals from '../AppModals'
import { enableScreens } from 'react-native-screens'

enableScreens()

export default class App extends Component {

  render() {
    return (
      <View style={styles.Component}>
        <StatusBar barStyle={isIOS ? 'dark-content' : 'light-content'} />
        <StoreProvider store={RootStore}>
          <GlobalErrorBoundary>
            <SafeAreaProvider>
              <AppNavigation />
              <AppController />
              <NavigationController />
              <AppLoader />
              <UserInOrganizationController />
              <CurrentOrganizationController />
              <AppModals />
            </SafeAreaProvider>
          </GlobalErrorBoundary>
        </StoreProvider>
        <PopUpAlertsController />
      </View>
    )
  }

  componentDidMount() {

    RNBootSplash.hide({ duration: 250 });

    GlobalFont.applyGlobal(defaultFontFamily)
  }

}
