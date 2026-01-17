import React from 'react'
import { StatusBar, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info'

import get from 'lodash/get'
import {
  onChangeCurrentScene,
  onChangeCurrentProjectId,
  onChangeCurrentConversationId,
  onSetIsDrawerNavigationOpened,
  onSetIsNavigationStateLoaded
} from 'models/mobile/NavigationModel/actions'
import BaseComponent from '../../../../../common/enhancers/BaseComponent'
import { NavigationService } from 'common/services'
import isIOS from '../../../../utils/isIOS'
import { NavigationAction } from '../../navigationConstants'
import handleError from '../../../../../common/utils/handleError'
import { BackHandler } from 'react-native'
import RouteName from '../../routeNames'
import isDev from '../../../../../common/utils/isDevEnv'

// If routes structure had changed we need to invalidate old stored navigation state
// or else react-navigation could crash
let persistenceKey
if (isDev()) {
  persistenceKey = `navigationState_appVersion_${DeviceInfo.getVersion()}_${Math.random()}`
} else {
  persistenceKey = `navigationState_appVersion_${DeviceInfo.getVersion()}`
}

const projectViewRoutes = [RouteName.PROJECT, RouteName.CONVERSATION]

function enhance(ComposedComponent) {
  class EnhanceAppNavigation extends BaseComponent {

    isDrawerOpened = false

    render() {
      return (
        <ComposedComponent
          {...this.props}
          setTopLevelNavigator={this.setTopLevelNavigator}
          onNavigationStateChange={this.onNavigationStateChange}
          persistNavigationState={this.persistNavigationState}
          loadNavigationState={this.loadNavigationState}
        />
      )
    }

    setTopLevelNavigator(ref) {
      NavigationService.setTopLevelNavigator(ref)
    }

    async persistNavigationState(navState) {
      try {
        await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
      } catch (error) {
        handleError(error)
      }
    }

    /** 
     * It's custom loadNavigationState handler. 
     * It allows us to simulate when the state was loaded (async)
     * It's needed for cases when we want to dispatch route without state which previously crashed app
     * 
    */
    async loadNavigationState() {
      const stringifiedState = await AsyncStorage.getItem(persistenceKey)

      const result = JSON.parse(stringifiedState)
      this.props.onSetIsNavigationStateLoaded(true)
      return result
    }

    getCurrentRouteParams(navigationState) {
      if (!navigationState) {
        return null
      }
      const route = get(navigationState, [`routes`, navigationState.index])

      if (!route) {
        return {}
      }

      if (route.routes) {
        return this.getCurrentRouteParams(route)
      }
      return route.params;
    }

    onNavigationStateChange(prevState, currentState, action) {
      this.checkForSceneChange(action)
      this.checkForProjectIdChange(action, currentState)
      this.checkForDrawerNavigationStateChange(action)
      this.checkForBackButtonChange(currentState, action)
    }

    checkForSceneChange(action) {
      if (action.routeName) {
        const scene = action.routeName
        if (scene !== this.prevScene || !this.prevScene) {
          this.props.onChangeCurrentScene(scene)
          this.prevScene = scene
        }
      }
    }

    checkForProjectIdChange(action, currentState) {
      const currentRouteParams = this.getCurrentRouteParams(currentState)
      if (currentRouteParams) {
        const { projectId, conversationId } = currentRouteParams
        if (projectId && projectId !== this.prevProjectId || !this.prevProjectId) {
          this.props.onChangeCurrentProjectId(projectId)
          this.prevProjectId = projectId
        } else if (conversationId && conversationId !== this.prevConversationId || !this.prevConversationId) {
          this.props.onChangeCurrentConversationId(conversationId)
          this.prevConversationId = conversationId
        }
      }
    }

    checkForDrawerNavigationStateChange(action) {
      switch (action.type) {
        case NavigationAction.OPEN_DRAWER: {
          this.isDrawerOpened = true
          break
        }
        case NavigationAction.RESET:
        case NavigationAction.CLOSE_DRAWER: {
          this.isDrawerOpened = false
          break
        }
        case NavigationAction.TOGGLE_DRAWER: {
          this.isDrawerOpened = !this.isDrawerOpened
          break
        }
        case NavigationAction.NAVIGATE: {
          if (this.isDrawerOpened) {
            this.isDrawerOpened = false
          }
        }
        default:
          break
      }
      this.onSetIsDrawerNavigationOpened(this.isDrawerOpened)
    }

    checkForBackButtonChange(currentState, action) {
      if (action.type !== NavigationAction.BACK) {
        return
      }
      
      const mainFlowRoutes = get(currentState, [`routes`, 1]) || []
      const nestedMainFlowRoutes = get(mainFlowRoutes, [`routes`, 0]) || []

      const mainStack = get(nestedMainFlowRoutes, ['routes']) || []

      // TODO: That's nasty. Remove after upgrating to react-navigation 5
      if (mainStack.length === 1 && mainStack[0].routeName === RouteName.PROJECT_LOADER) {
        NavigationService.reset(RouteName.PROJECT_LOADER)
      }
    }

    onSetIsDrawerNavigationOpened(isOpened) {
      if (isOpened) {
        if (isIOS) {
          StatusBar.setHidden(true, 'slide')
        }
        Keyboard.dismiss()
      } else {
        if (isIOS) {
          StatusBar.setHidden(false, 'slide')
        }
      }

      this.props.onSetIsDrawerNavigationOpened(isOpened)
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.onBackButton)
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButton)
    }

    onBackButton() {
      const currentRoute = NavigationService.getCurrentRoute()
      if (currentRoute && projectViewRoutes.includes(currentRoute.routeName)) {
        this.props.onSetIsNavigationStateLoaded(false)
      }
    }

  }

  const mapDispatchToProps = (dispatch) => ({
    onChangeCurrentScene: (scene) => dispatch(onChangeCurrentScene(scene)),
    onChangeCurrentProjectId: (projectId) => dispatch(onChangeCurrentProjectId(projectId)),
    onChangeCurrentConversationId: (conversationId) => dispatch(onChangeCurrentConversationId(conversationId)),
    onSetIsDrawerNavigationOpened: (isOpened) => dispatch(onSetIsDrawerNavigationOpened(isOpened)),
    onSetIsNavigationStateLoaded: (isLoaded) => dispatch(onSetIsNavigationStateLoaded(isLoaded)),
  })

  return connect(null, mapDispatchToProps)(EnhanceAppNavigation)
}

export default enhance
