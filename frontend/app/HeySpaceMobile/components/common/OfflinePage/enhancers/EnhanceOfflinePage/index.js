import React from 'react'
import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceOfflinePage extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    render() {
      return (
        <ComposedComponent
          onRetry={this.onRetry}
        />
      )
    }

    onRetry() {
      // TODO: reload app
    }

  }

  return EnhanceOfflinePage
}

export default Enhance
