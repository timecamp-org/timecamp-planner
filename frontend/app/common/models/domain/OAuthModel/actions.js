
import { Map } from 'immutable'
import * as Constants from './constants'
import { OAuth2Client } from './model'

const emptyMap = new Map()

export function onAuthorizeOAuth2() {
  return {
    type: Constants.onAuthorizeOAuth2,
  }
}

export function onLoadOAuthClientData(clientId) {
  return {
    type: Constants.onLoadOAuthClientData,
    clientId,
  }
}

export function onLoadOAuthClientDataSuccess(data) {
  return {
    type: Constants.onLoadOAuthClientDataSuccess,
    client: new OAuth2Client(data),
  }
}

export function onBatchClientsData(clients) {
  let clientsData = emptyMap
  clients.forEach(client => {
    clientsData = clientsData.set(client.id, new OAuth2Client(client))
  })
  return {
    type: Constants.onBatchClientsData,
    clientsData,
  }
}

export function onRedirectToAuthorizeOAuth1(applicationName, apiKey, oauthSecret, pathToRedirectAfterAuthorization) {
  return {
    type: Constants.onRedirectToAuthorizeOAuth1,
    apiKey,
    oauthSecret,
    applicationName,
    pathToRedirectAfterAuthorization,
  }
}

export function onAuthorizeOAuth1(applicationName, oauthToken, oauthVerifier) {
  return {
    type: Constants.onAuthorizeOAuth1,
    oauthToken,
    oauthVerifier,
    applicationName,
  }
}

export function onDeauthorizeOAuth1(applicationName) {
  return {
    type: Constants.onDeauthorizeOAuth1,
    applicationName,
  }
}

export function onSetIsOAuth1Authorized(applicationName, isAuthorized) {
  return {
    type: Constants.onSetIsOAuth1Authorized,
    isAuthorized,
    applicationName,
  }
}

export function onFetchOAuth1AuthorizedApplications() {
  return {
    type: Constants.onFetchOAuth1AuthorizedApplications,
  }
}

export function onSetOAuth1AuthorizedApplications(applicationNames) {
  return {
    type: Constants.onSetOAuth1AuthorizedApplications,
    applicationNames,
  }
}

export function onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready() {
  return {
    type: Constants.onFetchOAuth1AuthorizedApplicationsIfDidNotFetchAlready,
  }
}
