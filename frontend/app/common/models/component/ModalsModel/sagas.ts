import { cps, fork, put, select, takeEvery } from 'redux-saga/effects'
import * as C from './constants'
import { onSetDidUserCloseModalUltimately } from './actions'
import handleError from 'common/utils/handleError'
import { localStorage } from 'common/services'
import { makeDidUserCloseModalUltimatelyId } from 'common/utils/generateLocalStorageId'
import { PayloadAction } from 'common/types'
import { onSetRequestStatus } from 'models/domain/RequestModel/actions'
import { getDidUserCloseModalUltimately } from 'models/domain/RequestModel/constants/requestTypes'
import { RequestStatus } from 'models/domain/RequestModel/types'
import { selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onGetDidUserCloseModalUltimately, onGetDidUserCloseModalUltimately)
    })
    yield fork(function* () {
      yield takeEvery(C.onSaveDidUserCloseModalUltimately, onSaveDidUserCloseModalUltimately)
    })
  },
]

function* onGetDidUserCloseModalUltimately({ payload: { modalType } }: PayloadAction) {
  try {
    const isRequestRepeatable = yield select(selectIsRequestRepeatable, { requestType: getDidUserCloseModalUltimately, objectId: modalType })
    if (!isRequestRepeatable) {
      return
    }

    yield put(onSetRequestStatus(getDidUserCloseModalUltimately, modalType, RequestStatus.LOADING))
    // TODO: fetch data from API instead of localstorage
    const currentUserId = yield select(selectCurrentUserId)
    const didUserCloseModalUltimately = JSON.parse(yield cps(localStorage.getItem, makeDidUserCloseModalUltimatelyId(modalType, currentUserId)))
    yield put(onSetDidUserCloseModalUltimately(modalType, didUserCloseModalUltimately))
    yield put(onSetRequestStatus(getDidUserCloseModalUltimately, modalType, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, { modalType })
    yield put(onSetRequestStatus(getDidUserCloseModalUltimately, modalType, RequestStatus.FAILURE, error))
  }
}

function* onSaveDidUserCloseModalUltimately({ payload: { modalType, didUserClose } }: PayloadAction) {
  try {
    yield put(onSetDidUserCloseModalUltimately(modalType, didUserClose))
    // TODO: save data to DB instead of localstorage
    const currentUserId = yield select(selectCurrentUserId)
    yield cps(localStorage.setItem, makeDidUserCloseModalUltimatelyId(modalType, currentUserId), didUserClose)
  } catch (error) {
    handleError(error, { modalType })
  }
}