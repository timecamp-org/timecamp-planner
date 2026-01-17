import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import EnhancePageNotSupportedOnMobile from 'enhancers/EnhancePageNotSupportedOnMobile'

import Component from './component'
import EnhanceSettingsPage from './enhancers/EnhanceSettingsPage'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  EnhancePageNotSupportedOnMobile(
    EnhanceSettingsPage(
      Component,
    ),
  ),
)
