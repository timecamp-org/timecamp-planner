import Component from './component'

import EnhanceNotificationSettings from './enhancers/EnhanceNotificationSettings'
import EnhanceWithCurrentOrganizationId from 'enhancers/EnhanceWithCurrentOrganizationId'

import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from 'enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/RedirectToSignInPageIfCurrentUserIsDeauthenticated'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    EnhanceWithCurrentOrganizationId(
      EnhanceNotificationSettings(Component)
    )
  )
)
