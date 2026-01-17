
import { put, fork, takeEvery, cps } from 'redux-saga/effects'
import * as Constants from './constants'
import { HeySpaceClient as client } from '../../../services'
import handleError from '../../../utils/handleError'
import * as Actions from './actions'
import { fromJS } from 'immutable'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import * as RequestModelActions from '../RequestModel/actions'
import { RequestStatus } from '../RequestModel/types'
import { PartialPayloadAction } from 'common/types'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onFetchLinkMetadata, onFetchLinkMetadata)
    })
  },
]

function* onFetchLinkMetadata({ payload: { targetUrl } }: PartialPayloadAction) {
  try {
    yield put(RequestModelActions.onSetRequestStatus(RequestTypesConstants.getLinkMetadata, targetUrl, RequestStatus.LOADING))

    const metadata = yield cps(client.restApiClient.getLinkMetadata, targetUrl)
    yield put(Actions.onFetchLinkMetadataSuccess(targetUrl, fromJS(metadata)))
    yield put(RequestModelActions.onSetRequestStatus(RequestTypesConstants.getLinkMetadata, targetUrl, RequestStatus.SUCCESS))
  } catch (error) {
    if (error.params.body.code !== 404) {
      handleError(error, { targetUrl })
    }
    yield put(RequestModelActions.onSetRequestStatus(RequestTypesConstants.getLinkMetadata, targetUrl, RequestStatus.FAILURE, error))
  }
}
