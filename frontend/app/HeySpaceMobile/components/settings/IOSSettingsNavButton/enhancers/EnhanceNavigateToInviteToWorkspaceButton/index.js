import React from 'react'
import BaseComponent from 'BaseComponent'
import RouteName from 'components/AppNavigation/routeNames'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceNavigateToInviteToWorkspaceButton extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={'Invite'}
          onPress={this.onPress}
        />
      )
    }

    onPress() {
      NavigationService.navigate(RouteName.INVITE_TO_WORKSPACE)
    }

  }

  return EnhanceNavigateToInviteToWorkspaceButton
}

export default enhance
