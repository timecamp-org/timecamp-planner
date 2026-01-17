
import { put } from 'redux-saga/effects'

import { ReconnectHandler, AppEventEmitter } from 'common/services'
import isMobileApp from 'common/utils/isMobileApp'
import * as PopUpAlertsModelActions from 'common/models/component/PopUpAlertsModel/actions'
import { AppEventType } from 'common/types'

import { ControlCommandTypes } from './types'
import { refreshAppHumanMessage } from './constants/humanMessages'
import { ControlCommandActivity } from './types'

export function* onControlCommand(command: ControlCommandActivity) {
  switch (command.data.type) {
    case ControlCommandTypes.RESTART_APP: {
      if (!isMobileApp()) {
        yield put(PopUpAlertsModelActions.onAddAlert({ humanMessage: refreshAppHumanMessage }, 'app-upgrade', false))
        setTimeout(() => {
          AppEventEmitter.emit(AppEventType.APP_REFRESH)
        }, ReconnectHandler.refreshTimeout)
      }
      break
    }
    default: break
  }
}
