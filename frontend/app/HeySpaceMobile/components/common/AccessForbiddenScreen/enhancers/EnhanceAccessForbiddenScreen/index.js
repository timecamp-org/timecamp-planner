import React from 'react'

import BaseComponent from 'BaseComponent'
import { NavigationService } from '../../../../../../common/services'

function enhance(ComposedComponent) {
  class EnhanceAccessForbiddenScreen extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={this.props.text}
          onNavigateBack={this.onNavigateBack}
        />
      )
    }

    onNavigateBack() {
      NavigationService.pop()
    }

  }

  return EnhanceAccessForbiddenScreen
}

export default enhance
