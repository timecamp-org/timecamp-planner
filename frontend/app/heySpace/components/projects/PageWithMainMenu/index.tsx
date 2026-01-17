import RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces from 'enhancers/auth/RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces';
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated';
import RedirectToSubscriptionSettingsIfMembersNotValid from 'enhancers/auth/RedirectToSubscriptionSettingsIfMembersNotValid';
import EnhancePageNotSupportedOnMobile from 'enhancers/EnhancePageNotSupportedOnMobile';

import Component from './PageWithMainMenu';

export default RedirectToSignInPageIfCurrentUserIsDeauthenticated(
  RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces(
    RedirectToSubscriptionSettingsIfMembersNotValid(
      EnhancePageNotSupportedOnMobile(Component)
    )
  )
);
