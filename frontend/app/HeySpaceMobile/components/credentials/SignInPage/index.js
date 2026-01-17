import NavigateToDefaultPageIfCurrentUserIsAuthenticated from '../../../enhancers/NavigateToDefaultPageIfCurrentUserIsAuthenticated'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import Component from './component'

import EnhanceSignInPage from './enhancers/EnhanceSignInPage'

export default
NavigateToDefaultPageIfCurrentUserIsAuthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    EnhanceSignInPage(
      Component,
    ),
  ),
)
