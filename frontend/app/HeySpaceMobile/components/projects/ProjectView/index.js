import Component from './component'

import EnhanceProjectView from './enhancers/EnhanceProjectView'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from '../../../enhancers/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import RedirectToSubscriptionExpiredIfMembersNotValid from '../../../enhancers/RedirectToSubscriptionExpiredIfMembersNotValid'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    RedirectToSubscriptionExpiredIfMembersNotValid(
      EnhanceProjectView(
        Component
      )
    )
  )
)
