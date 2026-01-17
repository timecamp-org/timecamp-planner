import React from "react";
import BaseComponent from "commonEnhancers/BaseComponent";
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated';

function Enhance(ComposedComponent) {
  @RedirectToSignInPageIfCurrentUserIsDeauthenticated
  class EnhanceRedirectToSubscriptionSettings extends BaseComponent {
    // eslint-disable-line

    render() {
      return <ComposedComponent url={"/settings/subscription"} />;
    }
  }

  return EnhanceRedirectToSubscriptionSettings;
}

export default Enhance;
