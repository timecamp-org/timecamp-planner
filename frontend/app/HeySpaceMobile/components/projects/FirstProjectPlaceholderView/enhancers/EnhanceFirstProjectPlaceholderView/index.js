import React from 'react'

import BaseComponent from 'BaseComponent'
import { NavigationService } from 'common/services'
import RouteName from '../../../../AppNavigation/routeNames'
import isIOS from '../../../../../utils/isIOS'

function enhance(ComposedComponent) {
  class EnhanceFirstProjectPlaceholderView extends BaseComponent {

    static propTypes = {
    }

    state = {
      isCreateSpaceModalOpened: false,
    }

    render() {
      return (
        <ComposedComponent
          isCreateSpaceModalOpened={this.state.isCreateSpaceModalOpened}
          onNavigateToCreateSpace={this.onNavigateToCreateSpace}
          onCloseCreateSpaceModal={this.onCloseCreateSpaceModal}
        />
      )
    }

    onNavigateToCreateSpace() {
      if (isIOS) {
        NavigationService.navigate(RouteName.CREATE_SPACE)
      } else {
        this.onOpenCreateSpaceModal()
      }
    }

    onOpenCreateSpaceModal() {
      this.setState({
        isCreateSpaceModalOpened: true,
      })
    }

    onCloseCreateSpaceModal() {
      this.setState({
        isCreateSpaceModalOpened: false,
      })
    }
  }


  return EnhanceFirstProjectPlaceholderView
}

export default enhance
