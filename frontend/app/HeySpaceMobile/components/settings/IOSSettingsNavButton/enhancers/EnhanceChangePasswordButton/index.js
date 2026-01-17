import React from 'react'
import BaseComponent from 'BaseComponent'
import { AppEventEmitter } from 'common/services'

export const CHANGE_PASSWORD_EVENT = 'ChangePassword'

function enhance(ComposedComponent) {
  class EnhanceChangePasswordButton extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={'Change'}
          onPress={this.dispatchPressEvent}
        />
      )
    }

    dispatchPressEvent() {
      AppEventEmitter.emit(CHANGE_PASSWORD_EVENT)
    }

  }


  return EnhanceChangePasswordButton
}

export default enhance
