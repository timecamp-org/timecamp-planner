import Component from './component'

import EnhanceConvertMessageToCard from './enhancers/EnhanceConvertMessageToCard'
import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from '../../../enhancers/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces'
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from '../../../enhancers/RedirectToSignInPageIfCurrentUserIsDeauthenticated'
import RedirectToSubscriptionExpiredIfMembersNotValid from '../../../enhancers/RedirectToSubscriptionExpiredIfMembersNotValid'

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    RedirectToSubscriptionExpiredIfMembersNotValid(
      EnhanceConvertMessageToCard(
        Component
      )
    )
  )
)
