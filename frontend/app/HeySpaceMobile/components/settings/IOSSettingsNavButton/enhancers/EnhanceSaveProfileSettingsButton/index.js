import React from 'react'
import BaseComponent from 'BaseComponent'
import { AppEventEmitter } from 'common/services'

export const SAVE_PROFILE_SETTINGS_EVENT = 'SaveProfileSettings'

function enhance(ComposedComponent) {
  class EnhanceSaveProfileSettingsButton extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          text={'Save'}
          onPress={this.dispatchPressEvent}
        />
      )
    }

    dispatchPressEvent() {
      AppEventEmitter.emit(SAVE_PROFILE_SETTINGS_EVENT)
    }

  }


  return EnhanceSaveProfileSettingsButton
}

export default enhance
