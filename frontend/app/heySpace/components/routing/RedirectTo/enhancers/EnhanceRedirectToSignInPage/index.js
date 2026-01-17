import React from "react";
import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceRedirectToSignInPage extends BaseComponent {
    // eslint-disable-line

    render() {
      return (
        <ComposedComponent
          url={"/login"}
          search={
            this.props.returnUrl
              ? `?returnUrl=${this.props.returnUrl}`
              : undefined
          }
        />
      );
    }
  }
  return EnhanceRedirectToSignInPage;
}

export default Enhance;
