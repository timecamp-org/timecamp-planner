import { put, fork, takeEvery, cps, select } from 'redux-saga/effects'
import { fromJS } from 'immutable'
import handleError from '../../../utils/handleError'

import * as OrganizationsModelSelectors from '../OrganizationsModel/selectors/domain'
import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'
import { HeySpaceClient as client } from '../../../services'

import * as Constants from './constants'
import * as Actions from './actions'
import { onAddAlert } from '../../component/PopUpAlertsModel/actions'
import { HumanMessage } from '../HumanMessageModel/models'
import { HumanMessageKind } from '../HumanMessageModel/types'
import { i18n } from '../../../i18n'
import { selectCurrentUserId } from '../UsersModel/selectors/domain'
import * as IntegrationStatus from './constants/integrationStatus'
import { selectExtensionName } from '../ExtensionsModel/selectors/domain'

export default [
  function* () {
    yield fork(function* () {
      yield takeEvery(Constants.onInit, onInit)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onStartIntegration, onStartIntegration)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onFetchIntegrations, onFetchIntegrations)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onConfirmIntegrationsStatus, onConfirmIntegrationsStatus)
    })
  },
]

export function* onInit() {
  yield put(Actions.onFetchIntegrations())
}

export function* onStartIntegration({ extensionId }) {
  const extensionName = yield select(selectExtensionName, { extensionId })
  try {
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    const currentUserId = yield select(selectCurrentUserId)
    yield put(Actions.onSetIntegrationStatus(currentOrganizationId, currentUserId, extensionId, IntegrationStatus.IN_PROGRESS))
    yield cps(client.restApiClient.startIntegration, extensionId, currentOrganizationId)
    yield put(onAddAlert({
      humanMessage: HumanMessage({
        text: i18n.t('Started integration: "{{namespace}}"', { namespace: extensionName }),
        kind: HumanMessageKind.information,
      }),
    }, `onStartIntegrationSuccess`))
  } catch (error) {
    handleError(error)
    yield put(onAddAlert({
      humanMessage: HumanMessage({
        text: i18n.t(`Failed to start integration: "{{namespace}}"`, { namespace: extensionName }),
        kind: HumanMessageKind.error,
      }),
    }, `onStartIntegrationFailure`))
  }
}

export function* onFetchIntegrations() {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.fetchIntegrations, null, RequestStatus.LOADING))
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    const integrations = yield cps(client.restApiClient.fetchIntegrations, currentOrganizationId)
    yield put(Actions.onBatchIntegrations(fromJS(integrations)))
    yield put(onSetRequestStatus(RequestTypesConstants.fetchIntegrations, null, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.fetchIntegrations, null, RequestStatus.FAILURE, error))
    handleError(error)
  }
}

export function* onConfirmIntegrationsStatus({ extensionIds }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.confirmIntegrations, null, RequestStatus.LOADING))
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    const currentUserId = yield select(selectCurrentUserId)
    yield cps(client.restApiClient.confirmIntegrationsStatus, currentOrganizationId, extensionIds)
    yield put(Actions.onConfirmIntegrationsStatusSuccess(currentOrganizationId, currentUserId, extensionIds))
    yield put(onSetRequestStatus(RequestTypesConstants.confirmIntegrations, null, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.confirmIntegrations, null, RequestStatus.FAILURE, error))
  }
}
