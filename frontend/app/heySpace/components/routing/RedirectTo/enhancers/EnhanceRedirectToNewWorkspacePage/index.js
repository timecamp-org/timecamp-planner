import React from "react";
import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceRedirectToNewWorkspacePage extends BaseComponent {
    // eslint-disable-line
    render() {
      return <ComposedComponent url={"/newWorkspace"} />;
    }
  }

  return EnhanceRedirectToNewWorkspacePage;
}

export default Enhance;
