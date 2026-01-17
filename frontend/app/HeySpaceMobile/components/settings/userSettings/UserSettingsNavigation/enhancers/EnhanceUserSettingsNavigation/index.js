import React from 'react'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceUserSettingsNavigation extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          onGoToProfileSettings={this.onGoToProfileSettings}
          onGoToNotificationSettings={this.onGoToNotificationSettings}
        />
      )
    }

    onGoToProfileSettings() {
      NavigationService.navigate(RouteName.PROFILE)
    }

    onGoToNotificationSettings() {
      NavigationService.navigate(RouteName.NOTIFICATION_SETTINGS)
    }

  }

  return EnhanceUserSettingsNavigation
}

export default enhance
