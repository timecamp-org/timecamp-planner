import React from "react";
import BaseComponent from "commonEnhancers/BaseComponent";
import EnhanceWithAppDefaultUrl from 'enhancers/EnhanceWithAppDefaultUrl';
import RedirectToSignInPageIfCurrentUserIsDeauthenticated from 'enhancers/auth/RedirectToSignInPageIfCurrentUserIsDeauthenticated';

function Enhance(ComposedComponent) {
  @RedirectToSignInPageIfCurrentUserIsDeauthenticated
  @EnhanceWithAppDefaultUrl
  class EnhanceRedirectToDefaultPage extends BaseComponent {
    // eslint-disable-line

    render() {
      return <ComposedComponent url={this.props.defaultUrl} />;
    }
  }

  return EnhanceRedirectToDefaultPage;
}

export default Enhance;
