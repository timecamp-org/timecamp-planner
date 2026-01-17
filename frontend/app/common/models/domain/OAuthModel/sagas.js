import { put, fork, takeLatest, cps, takeEvery, select, call } from 'redux-saga/effects'
import * as Constants from './constants'
import * as Actions from './actions'
import { HeySpaceClient as client } from '../../../services'
import handleError from '../../../utils/handleError'
import queryString from 'query-string'
import * as urllib from 'url-lib'

import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'
import * as OrganizationsModelSelectors from '../OrganizationsModel/selectors/domain'
import * as RequestStatusSelectors from '../RequestModel/selectors'

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(Constants.onAuthorizeOAuth2, onAuthorizeOAuth2)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onLoadOAuthClientData, onLoadOAuthClientData)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onRedirectToAuthorizeOAuth1, onRedirectToAuthorizeOAuth1)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onAuthorizeOAuth1, onAuthorizeOAuth1)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onFetchOAuth1AuthorizedApplications, onFetchOAuth1AuthorizedApplications)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready, onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready)
    })
    yield fork(function* () {
      yield takeEvery(Constants.onDeauthorizeOAuth1, onDeauthorizeOAuth1)
    })
  },
]

// OAUTH2 aouthorization_code flow
function* onAuthorizeOAuth2() {
  let { redirect_uri, client_id, state, scope } = queryString.parse(window.location.search)
  state = state || null

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.authorizeOAuth2, client_id, RequestStatus.LOADING))
    const result = yield cps(client.restApiClient.authorizeOAuth2, redirect_uri, client_id, state, scope, 'code')

    yield put(onSetRequestStatus(RequestTypesConstants.authorizeOAuth2, client_id, RequestStatus.SUCCESS))
    if (result && result.redirectUri && result.authorizationCode) {
      const url = urllib.formatUrl(result.redirectUri, {
        code: result.authorizationCode,
        state,
      })
      window.location.replace(url)
    } else {
      throw new Error('Failed to get authorization_code')
    }
  } catch (error) {
    handleError(error, { redirect_uri, client_id, state, scope })
    yield put(onSetRequestStatus(RequestTypesConstants.authorizeOAuth2, client_id, RequestStatus.FAILURE, error))
  }
}

function* onLoadOAuthClientData({ clientId }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getOauthClientData, clientId, RequestStatus.LOADING))
    const result = yield cps(client.restApiClient.getOauthClientData, clientId)
    if (result) {
      yield put(Actions.onLoadOAuthClientDataSuccess(result))
    } else {
      throw new Error('OAuth client not fetched')
    }
    yield put(onSetRequestStatus(RequestTypesConstants.getOauthClientData, clientId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, { clientId })
    yield put(onSetRequestStatus(RequestTypesConstants.getOauthClientData, clientId, RequestStatus.FAILURE, error))
  }
}

export function* onRedirectToAuthorizeOAuth1({ applicationName, apiKey, oauthSecret, pathToRedirectAfterAuthorization }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.redirectToAuthorizeOAuth1, applicationName, RequestStatus.LOADING))
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    const url = yield cps(
      client.restApiClient.getOAuth1AuthorizationExternalUrl,
      applicationName,
      currentOrganizationId,
      apiKey,
      oauthSecret,
      pathToRedirectAfterAuthorization,
    )
    yield put(onSetRequestStatus(RequestTypesConstants.redirectToAuthorizeOAuth1, applicationName, RequestStatus.SUCCESS))
    window.location = url
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.redirectToAuthorizeOAuth1, applicationName, RequestStatus.FAILURE, error))
    handleError(error)
  }
}

export function* onAuthorizeOAuth1({ applicationName, oauthToken, oauthVerifier }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.authorizeOAuth1, applicationName, RequestStatus.LOADING))
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    yield cps(client.restApiClient.authorizeOAuth1, applicationName, currentOrganizationId, oauthToken, oauthVerifier)
    yield put(Actions.onSetIsOAuth1Authorized(applicationName, true))
    yield put(onSetRequestStatus(RequestTypesConstants.authorizeOAuth1, applicationName, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.authorizeOAuth1, applicationName, RequestStatus.FAILURE, error))
    handleError(error)
  }
}

export function* onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready() {
  try {
    const isRepeatable = yield select(
      RequestStatusSelectors.selectIsRequestRepeatable,
      { requestType: RequestTypesConstants.fetchOAuth1AuthorizedApplications },
    )

    if (isRepeatable) {
      yield call(onFetchOAuth1AuthorizedApplications)
    }
  } catch (error) {
    handleError(error)
  }
}

export function* onFetchOAuth1AuthorizedApplications() {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.fetchOAuth1AuthorizedApplications, null, RequestStatus.LOADING))
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    const authorizedApplications = yield cps(client.restApiClient.fetchOAuth1AuthorizedApplications, currentOrganizationId)
    yield put(Actions.onSetOAuth1AuthorizedApplications(authorizedApplications))
    yield put(onSetRequestStatus(RequestTypesConstants.fetchOAuth1AuthorizedApplications, null, RequestStatus.SUCCESS))
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.fetchOAuth1AuthorizedApplications, null, RequestStatus.FAILURE, error))
    handleError(error)
  }
}

export function* onDeauthorizeOAuth1({ applicationName }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deauthorizeOAuth1, null, RequestStatus.LOADING))
    yield put(Actions.onSetIsOAuth1Authorized(applicationName, false))
    const currentOrganizationId = yield select(OrganizationsModelSelectors.selectCurrentOrganizationId)
    yield cps(client.restApiClient.deauthorizeOAuth1, applicationName, currentOrganizationId)
    yield put(onSetRequestStatus(RequestTypesConstants.deauthorizeOAuth1, null, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.deauthorizeOAuth1, null, RequestStatus.FAILURE, error))
  }
}
