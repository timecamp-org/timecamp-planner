import { fork, takeEvery, put, cps, select } from 'redux-saga/effects'
import { HeySpaceClient as client } from '../../../services'
import * as C from './constants'
import { PartialPayloadAction } from '../../../types'
import handleError from '../../../utils/handleError'
import { onFetchUserProjectSettingsSuccess } from './actions'
import { normalizeUserProjectSettingsDataFromAPI } from './helpers'
import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'
import * as RequestStatusSelectors from '../RequestModel/selectors'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onUpdateUserProjectSettings, onUpdateUserProjectSettings)
      yield takeEvery(C.onFetchUserProjectSettings, onFetchUserProjectSettings)
    })
  },
]

function* onFetchUserProjectSettings({ payload: { projectId } }: PartialPayloadAction) {
  try {
    const isRequestRepeatable = yield select(
      RequestStatusSelectors.selectIsRequestRepeatable,
      { objectId: projectId, requestType: RequestTypesConstants.getUserProjectSettings },
    )

    if (isRequestRepeatable) {
      yield put(onSetRequestStatus(RequestTypesConstants.getUserProjectSettings, projectId, RequestStatus.LOADING))
      
      const userProjectSettingsResponse = yield cps(client.restApiClient.getUserProjectSettings, null, projectId)
      if (userProjectSettingsResponse) {
        const userProjectSettings = normalizeUserProjectSettingsDataFromAPI(userProjectSettingsResponse)
        yield put(onFetchUserProjectSettingsSuccess(projectId, userProjectSettings))
      }

      yield put(onSetRequestStatus(RequestTypesConstants.getUserProjectSettings, projectId, RequestStatus.SUCCESS))
    }
  } catch (error) {
    handleError(error, { projectId })
    yield put(onSetRequestStatus(RequestTypesConstants.getUserProjectSettings, projectId, RequestStatus.FAILURE, error))
  }
}

export function* onUpdateUserProjectSettings({ payload: { projectId, userProjectSettings } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserProjectSettings, projectId, RequestStatus.LOADING))
    
    yield cps(client.restApiClient.setUserProjectSettings, null, projectId, userProjectSettings)
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserProjectSettings, projectId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, { projectId, userProjectSettings })
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserProjectSettings, projectId, RequestStatus.FAILURE))
  }
}
