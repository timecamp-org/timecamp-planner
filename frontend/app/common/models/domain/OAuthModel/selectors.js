import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../utils/generateSelectorName'
import createImmutableEqualSelector from '../../../utils/createImmutableEqualSelector'

import { domain } from './constants'

export const oAuthDomain = (state) => state.get(domain)

export const selectClientsData = createSelector(
  oAuthDomain,
  domain => domain.get('clientsData'),
)

// args: clientId
export const selectClient = createCachedSelector(
  selectClientsData,
  (_, args) => args.clientId,
  (clientsData, clientId) => clientsData.get(clientId),
)
(
  (_, args) => generateSelectorName(args, ['clientId']),
)

// args: clientId
export const selectClientName = createCachedSelector(
  selectClient,
  (client) => (client ? client.name : ''),
)
(
  (_, args) => generateSelectorName(args, ['clientId']),
)

// args: clientId
export const selectClientSecret = createCachedSelector(
  selectClient,
  (client) => (client ? client.clientSecret : ''),
)
(
  (_, args) => generateSelectorName(args, ['clientId']),
)

// args: clientId
export const selectClientThumbnailUrl = createCachedSelector(
  selectClient,
  (client) => (client ? client.thumbnailUrl : ''),
)
(
  (_, args) => generateSelectorName(args, ['clientId']),
)
// args: clientId
export const selectClientRedirectUris = createCachedSelector(
  selectClient,
  (client) => (client ? client.redirectUris : ''),
)
(
  (_, args) => generateSelectorName(args, ['clientId']),
)

export const selectIsOAuth1AuthorizedDomain = createImmutableEqualSelector(
  oAuthDomain,
  domain => domain.get('isOAuth1Authorized'),
)

// args: applicationName
export const selectIsOAuth1Authorized = createCachedSelector(
  selectIsOAuth1AuthorizedDomain,
  (_, args) => args.applicationName,
  (isOAuth1AuthorizedDomain, applicationName) => isOAuth1AuthorizedDomain.get(applicationName),
)
(
  (_, args) => generateSelectorName(args, ['applicationName']),
)
