import React from 'react'

import * as PopUpAlertsModelKinds from 'models/component/PopUpAlertsModel/constants/kinds'
import { AppEventType } from 'common/types'
import { AppEventEmitter } from 'common/services'

import BaseComponent from 'BaseComponent'

function enhance(ComposedComponent) {
  class EnhancePopUpAlertsController extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          onSetRef={this.onSetRef}
        />
      )
    }

    onSetRef(ref) {
      this.dropdown = ref
    }

    showAlert({ actionResult }) {
      if (this.dropdown) {
        const kind = actionResult.humanMessage.get('kind')
        const text = actionResult.humanMessage.get('text')
        this.dropdown.alertWithType(this.getTranslatedKind(kind), this.getAlertTitle(kind), text)
      }
    }

    getTranslatedKind(kind) {
      switch (kind) {
        case PopUpAlertsModelKinds.warning: return 'warn'
        case PopUpAlertsModelKinds.information: return 'info'
        default: return kind
      }
    }

    getAlertTitle(kind) {
      switch (kind) {
        case PopUpAlertsModelKinds.warning: return 'Warning'
        case PopUpAlertsModelKinds.information: return 'Information'
        case PopUpAlertsModelKinds.error: return 'Error'
        case PopUpAlertsModelKinds.success: return 'Success'
        default: return kind
      }
    }

    componentDidMount() {
      AppEventEmitter.on(AppEventType.ALERT, this.showAlert)
    }
    
    componentWillUnmount() {
      AppEventEmitter.off(AppEventType.ALERT, this.showAlert)
    }

  }

  return EnhancePopUpAlertsController
}

export default enhance
