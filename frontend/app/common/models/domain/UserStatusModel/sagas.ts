import { put, select, fork, takeLatest, cps, call } from 'redux-saga/effects'
import handleError from '../../../utils/handleError'
import { HeySpaceClient as client } from '../../../services'
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain'

import * as A from './actions'
import * as C from './constants'

import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'
import { UserStatusInterface } from './types';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';
import { PartialPayloadAction } from '../../../types';
import { UserStatus } from './models'

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(C.onInit, onInit)
    })
    yield fork(function* () {
      yield takeLatest(C.onSetUserStatus, onSetUserStatus)
    })
    yield fork(function* () {
      yield takeLatest(C.onRemoveUserStatus, onRemoveUserStatus)
    })
  },
]

export function* onInit() {
  try {
    yield call(onFetchOrganizationUserStatuses)
  } catch (error) {
    handleError(error)
  }
}

export function* onFetchOrganizationUserStatuses() {
  const organizationId = yield select(selectCurrentOrganizationId)
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizationUserStatuses, organizationId, RequestStatus.LOADING))
    
    const userStatuses: UserStatusInterface[] = yield cps(client.restApiClient.getOrganizationUserStatuses, organizationId)
    yield put(A.onBatchUserStatusData(userStatuses))

    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizationUserStatuses, organizationId, RequestStatus.SUCCESS))
  } catch(error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizationUserStatuses, organizationId, RequestStatus.FAILURE, error))
  }
}

export function* onSetUserStatus({ payload }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId)
  const userId = yield select(selectCurrentUserId)
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.setUserStatus, userId, RequestStatus.LOADING))
    
    const rawUserStatus: UserStatusInterface = {
      ...payload,
      userId,
      organizationId
    }
    
    const result = yield cps(client.restApiClient.setUserStatus, organizationId, rawUserStatus)

    const userStatusRecord = UserStatus(result)
    yield put(A.onSetUserStatusSuccess(userStatusRecord))

    yield put(onSetRequestStatus(RequestTypesConstants.setUserStatus, userId, RequestStatus.SUCCESS))
  } catch(error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.setUserStatus, userId, RequestStatus.FAILURE, error))
  }
}

export function* onRemoveUserStatus() {
  const organizationId = yield select(selectCurrentOrganizationId)
  const userId = yield select(selectCurrentUserId)
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserStatus, userId, RequestStatus.LOADING))

    
    yield cps(client.restApiClient.deleteUserStatus, organizationId)

    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserStatus, userId, RequestStatus.SUCCESS))
  } catch(error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserStatus, userId, RequestStatus.FAILURE, error))
  }
}
