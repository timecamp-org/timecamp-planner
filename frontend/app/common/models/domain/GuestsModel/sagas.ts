import { cps, fork, put, select, takeEvery } from 'redux-saga/effects'
import * as C from './constants'
import * as A from './actions'
import handleError from 'common/utils/handleError'
import { onSetRequestStatus } from 'models/domain/RequestModel/actions'
import { getOrganizationProjectsGuestInProject } from 'models/domain/RequestModel/constants/requestTypes'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { RequestStatus } from 'models/domain/RequestModel/types'
import { HeySpaceClient as client } from 'common/services'
import { Map } from 'immutable'
import { GuestInProjectInterface } from 'models/domain/GuestsModel/types'
import { Id } from 'common/utils/identifier'
import { GuestInProject } from 'models/domain/GuestsModel/models'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(C.onInit, onInit)
    })
  },
]

export function* onInit() {
  const organizationId = yield select(selectCurrentOrganizationId)
  try {
    yield put(onSetRequestStatus(getOrganizationProjectsGuestInProject, organizationId, RequestStatus.LOADING))

    const organizationProjectsGuestInProject = yield cps(client.restApiClient.getOrganizationProjectsGuestInProject, organizationId)

    let guestInProjectBatch: Map<Id, GuestInProjectInterface> = Map()
    organizationProjectsGuestInProject.forEach((guestInProjectJson: GuestInProjectInterface) => {
      guestInProjectBatch = guestInProjectBatch.set(guestInProjectJson.id, GuestInProject(guestInProjectJson))
    })

    yield put(A.onBatchGuestInProject(guestInProjectBatch))

    yield put(onSetRequestStatus(getOrganizationProjectsGuestInProject, organizationId, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(getOrganizationProjectsGuestInProject, organizationId, RequestStatus.FAILURE, error))
    handleError(error, { organizationId })
  }
}