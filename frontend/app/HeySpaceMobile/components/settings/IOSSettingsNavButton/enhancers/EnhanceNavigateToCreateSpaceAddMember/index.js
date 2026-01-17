import React from 'react'
import BaseComponent from 'BaseComponent'
import RouteName from 'components/AppNavigation/routeNames'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceNavigateToCreateSpaceAddMember extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={'Add'}
          onPress={this.onPress}
        />
      )
    }

    onPress() {
      NavigationService.navigate(RouteName.CREATE_SPACE_MEMBER_ADD)
    }

  }

  return EnhanceNavigateToCreateSpaceAddMember
}

export default enhance
