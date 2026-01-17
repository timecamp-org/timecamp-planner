import { fromJS } from 'immutable'

import generatePushId from '../../../utils/generate-pushid'
import { Alert } from './models'

import * as PopUpAlertsConstants from './constants'
import * as CurrentUserConstants from '../../domain/CurrentUserModel/constants'
import * as AppModelConstants from '../../domain/AppModel/constants'

import { close } from './constants/actionsTypes'

const initialState = fromJS({})

function popUpAlertsReducer(state = initialState, action) {
  switch (action.type) {
    case PopUpAlertsConstants.onAddAlert: {
      const id = action.id || generatePushId('alert')
      const alert = new Alert({
        id,
        kind: action.actionResult.humanMessage.kind,
        text: action.actionResult.humanMessage.text,
        links: action.actionResult.humanMessage.links,
        leftIcon: action.actionResult.leftIcon,
        isSelfDisposable: action.isSelfDisposable,
        actions: action.actions || [close],
      })
      return state.set(id, alert)
    }

    case PopUpAlertsConstants.onRemoveAlert: {
      return state.delete(action.id)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess: {
      return initialState
    }

    default:
      return state
  }
}

export default popUpAlertsReducer
