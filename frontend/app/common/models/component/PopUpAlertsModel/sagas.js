import { takeEvery, fork, call } from 'redux-saga/effects'
import handleError from '../../../utils/handleError'
import { AppEventEmitter } from '../../../services'
import { AppEventType } from '../../../types'

import * as Constants from './constants'

export function* onAddAlert(action) { // eslint-disable-line
  try {
    AppEventEmitter.emit(AppEventType.ALERT, action)
  } catch (error) {
    handleError(error)
  }
}


export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onAddAlert, onAddAlert)
    })
  }
]
