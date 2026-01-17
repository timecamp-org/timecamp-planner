
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from 'enhancers/auth/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import EnhancePageNotSupportedOnMobile from 'enhancers/EnhancePageNotSupportedOnMobile'

import Component from './component'
import EnhanceCheckoutPage from './enhancers/EnhanceCheckoutPage'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    EnhancePageNotSupportedOnMobile(
      EnhanceCheckoutPage(
        Component,
      ),
    ),
  ),
)
