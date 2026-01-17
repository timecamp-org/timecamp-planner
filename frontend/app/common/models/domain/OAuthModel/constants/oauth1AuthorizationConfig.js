import * as oauth1AuthorizedApplications from './oauth1AuthorizedApplications'

export default {
  [oauth1AuthorizedApplications.TRELLO]: {
    makePathToRedirectAfterAuthorization: (extensionId) => `/settings/addons?applicationName=trello&extensionId=${extensionId}`,
    linkToApiKeyAndOAuth1Secret: 'https://trello.com/app-key',
    displayedApplicationName: 'Trello',
  },
}
