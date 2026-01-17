import React from "react";
import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceRedirectToWorkspaceInvitationPage extends BaseComponent {
    // eslint-disable-line
    render() {
      return <ComposedComponent url={"/workspaceInvitations"} />;
    }
  }

  return EnhanceRedirectToWorkspaceInvitationPage;
}

export default Enhance;
