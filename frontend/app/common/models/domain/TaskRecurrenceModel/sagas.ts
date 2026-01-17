import {
  put, fork, takeEvery, cps, select
} from 'redux-saga/effects'

import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'

import { HeySpaceClient as client } from '../../../services'

import * as A from './actions'
import * as C from './constants'
import { PartialPayloadAction } from '../../../types';
import handleError from '../../../utils/handleError'
import generateId from '../../../utils/generate-pushid';
import { TaskRecurrenceSettingsInterface } from './types';
import { TaskRecurrenceSettings } from './models';
import { ExtensionNamespace, RelationType } from '../ExtensionsModel/types';
import { selectRecurrenceSettings } from './selectors/domain';
import { fromJS } from 'immutable'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onSetTaskRecurrence, onSetTaskRecurrence)
    })
    yield fork(function* () {
      yield takeEvery(C.onDeleteTaskRecurrenceSettings, onDeleteTaskRecurrenceSettings)
    })
  },
]

export function* onSetTaskRecurrence({ payload }: PartialPayloadAction) {
  const { taskId, nextRecurrenceAt, ...rawSettingsValue } = payload
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateExtensionRelation, taskId, RequestStatus.LOADING))
    const recurrenceSettings: TaskRecurrenceSettingsInterface = {
      ...payload,
      id: payload.id || generateId(),
    }
    
    yield cps(client.restApiClient.updateExtensionRelation, ExtensionNamespace.TASK_RECURRENCE, RelationType.SETTINGS, {
      id: recurrenceSettings.id,
      taskId,
      nextRecurrenceAt,
      value: JSON.stringify(rawSettingsValue),
    })
    yield put(A.onSetTaskRecurrenceSuccess(new TaskRecurrenceSettings(fromJS(recurrenceSettings))))
    yield put(onSetRequestStatus(RequestTypesConstants.updateExtensionRelation, taskId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, payload)
    yield put(onSetRequestStatus(RequestTypesConstants.updateExtensionRelation, taskId, RequestStatus.FAILURE, error))
  }
}

export function* onDeleteTaskRecurrenceSettings({ payload: { recurrenceId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteExtensionRelation, recurrenceId, RequestStatus.LOADING))

    const recurrenceSettings = yield select(selectRecurrenceSettings, { recurrenceId })

    
    yield cps(client.restApiClient.deleteExtensionRelation, ExtensionNamespace.TASK_RECURRENCE, RelationType.SETTINGS, recurrenceSettings)

    yield put(A.onDeleteTaskRecurrenceSettingsSuccess(recurrenceId))
    
    yield put(onSetRequestStatus(RequestTypesConstants.deleteExtensionRelation, recurrenceId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, { recurrenceId })
    yield put(onSetRequestStatus(RequestTypesConstants.deleteExtensionRelation, recurrenceId, RequestStatus.FAILURE, error))
  }
}
