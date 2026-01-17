import Component from './component'

import EnhanceCardDetails from './enhancers/EnhanceCardDetails'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from '../../../enhancers/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import RedirectToSubscriptionExpiredIfMembersNotValid from '../../../enhancers/RedirectToSubscriptionExpiredIfMembersNotValid'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    RedirectToSubscriptionExpiredIfMembersNotValid(
      EnhanceCardDetails(Component)
    )
  )
)
