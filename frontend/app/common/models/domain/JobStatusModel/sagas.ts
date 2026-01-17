
import { fork, takeEvery, call, put, select, cps } from 'redux-saga/effects'
import * as Constants from './constants'
import handleError from '../../../utils/handleError'
import { PartialPayloadAction } from 'common/types'
import { HeySpaceClient as client } from '../../../services'
import { JobStatusInterface, JobNamespace } from './types'
import { createSuccessAlert, createFailureAlert } from '../RequestModel/sagas/requestStatusSagas'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import * as RequestModelActions from '../RequestModel/actions'
import { RequestStatus } from '../RequestModel/types'
import * as Actions from './actions'
import { selectCurrentUserId } from '../UsersModel/selectors/domain'
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain'
import { selectJobIsDone } from './selectors'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onInit, onInit)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onUpdateJobStatusData, onUpdateJobStatusData)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onFetchJobStatuses, onFetchJobStatuses)
    })
  },
]

export function* onInit() {
  const currentUserId = yield select(selectCurrentUserId)
  const currentOrganizationId = yield select(selectCurrentOrganizationId)

  yield put(Actions.onFetchJobStatuses(currentUserId, currentOrganizationId))
}

function* onUpdateJobStatusData({ payload: { jobStatus } }: PartialPayloadAction<{ jobStatus: JobStatusInterface }>) {
  try {
    const { jobsSpawned, jobsDone, isFailed: isIncomingJobFailed, namespace, id } = jobStatus

    const isIncomingJobDone = jobsDone > 0 && jobsSpawned === jobsDone
    const isIncomingJobStarted = jobsDone === 0 && jobsSpawned === 0
    const isCurrentJobDone = yield select(selectJobIsDone, { id })

    if (isCurrentJobDone && !isIncomingJobStarted) {
      return
    }

    if (isIncomingJobFailed) {
      yield call(onCreateFailureResponse, namespace)
    } else if (isIncomingJobDone) {
      yield call(onCreateDoneResponse, namespace)
    }

    yield put(Actions.onUpdateJobStatusDataSuccess(jobStatus))
  } catch (error) {
    handleError(error)
  }
}

function* onCreateDoneResponse(namespace: JobNamespace) {
  switch (namespace) {
    case JobNamespace.ARCHIVE_NOTIFICATIONS: {
      yield call(createSuccessAlert, 'archiveUserInOrganizationNotificationsSuccess')
      break;
    }
    default:
      break;
  }
}

function* onCreateFailureResponse(namespace: JobNamespace) {
  switch (namespace) {
    case JobNamespace.ARCHIVE_NOTIFICATIONS: {
      yield call(createFailureAlert, 'archiveUserInOrganizationNotifications')
      break;
    }
    default:
      break;
  }
}

function* onFetchJobStatuses({ payload: { userId, organizationId } }: PartialPayloadAction) {
  const idParts = [userId, organizationId]
  try {
    yield put(RequestModelActions.onSetRequestStatus(RequestTypesConstants.getUserInOrganizationJobStatuses, idParts, RequestStatus.LOADING))

    const jobStatuses = yield cps(client.restApiClient.getUserInOrganizationJobStatuses, organizationId)
    yield put(Actions.onFetchJobStatusesSuccess(jobStatuses))
    yield put(RequestModelActions.onSetRequestStatus(RequestTypesConstants.getUserInOrganizationJobStatuses, idParts, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, { userId, organizationId })
    yield put(RequestModelActions.onSetRequestStatus(RequestTypesConstants.getUserInOrganizationJobStatuses, idParts, RequestStatus.FAILURE, error))
  }
}
