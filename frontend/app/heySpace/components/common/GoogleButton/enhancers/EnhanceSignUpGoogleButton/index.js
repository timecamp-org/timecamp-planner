import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { doNothing } from "common/utils";

import { onSignUpWithGoogleAccount } from "models/domain/CurrentUserModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(Component) {
  class EnhanceSignUpGoogleButton extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,

      buttonText: PropTypes.string,
      isSubmitDisabled: PropTypes.bool,

      onClick: PropTypes.func,
      onCustomSignUp: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          buttonText={this.props.buttonText}
          onClick={this.onClick}
        />
      );
    }

    onClick() {
      this.props.onClick();
      if (!this.props.isSubmitDisabled) {
        if (this.props.onCustomSignUp) {
          this.props.onCustomSignUp();
        } else {
          this.props.onSignUpWithGoogleAccount();
        }
      }
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSignUpWithGoogleAccount: () => dispatch(onSignUpWithGoogleAccount()),
    };
  }

  return connect(null, mapDispatchToProps)(EnhanceSignUpGoogleButton);
}

export default enhance;
