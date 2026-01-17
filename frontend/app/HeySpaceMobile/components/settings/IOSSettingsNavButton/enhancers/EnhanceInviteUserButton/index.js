import React from 'react'
import BaseComponent from 'BaseComponent'
import { AppEventEmitter } from 'common/services'

export const INVITE_USER_TO_EVENT = 'InviteUserEvent'

function enhance(ComposedComponent) {
  class EnhanceInviteUserButton extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={'Invite'}
          onPress={this.dispatchPressEvent}
        />
      )
    }

    dispatchPressEvent() {
      AppEventEmitter.emit(INVITE_USER_TO_EVENT)
    }

  }


  return EnhanceInviteUserButton
}

export default enhance
