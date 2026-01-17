import Component from './component'

import EnhanceFirstProjectPlaceholderView from './enhancers/EnhanceFirstProjectPlaceholderView'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from '../../../enhancers/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import RedirectToSubscriptionExpiredIfMembersNotValid from '../../../enhancers/RedirectToSubscriptionExpiredIfMembersNotValid'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    RedirectToSubscriptionExpiredIfMembersNotValid(
      EnhanceFirstProjectPlaceholderView(
        Component
      )
    )
  )
)
