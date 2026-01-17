import Component from './component'

import EnhanceSignUpPage from './enhancers/EnhanceSignUpPage'
import NavigateToDefaultPageIfCurrentUserIsAuthenticated from '../../../enhancers/NavigateToDefaultPageIfCurrentUserIsAuthenticated'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'

export default NavigateToDefaultPageIfCurrentUserIsAuthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    EnhanceSignUpPage(
      Component
    )
  )
)
