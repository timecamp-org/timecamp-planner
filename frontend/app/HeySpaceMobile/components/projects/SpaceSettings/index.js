import Component from './component'

import EnhanceSpaceSettings from './enhancers/EnhanceSpaceSettings'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from '../../../enhancers/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import RedirectToSubscriptionExpiredIfMembersNotValid from '../../../enhancers/RedirectToSubscriptionExpiredIfMembersNotValid'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    RedirectToSubscriptionExpiredIfMembersNotValid(
      EnhanceSpaceSettings(
        Component
      )
    )
  )
)
