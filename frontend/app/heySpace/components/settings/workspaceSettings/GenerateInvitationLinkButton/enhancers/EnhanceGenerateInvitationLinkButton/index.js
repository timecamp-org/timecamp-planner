import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectIsUserOrganizationOwner } from "models/domain/OrganizationsModel/selectors/domain";
import { selectIsUserRegistered } from "../../../../../../../common/models/domain/UsersModel/selectors/domain";

function EnhanceResendInvitationButton(ComposedComponent) {
  class EnhanceGenerateInvitationLinkButton extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,

      onClick: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    state = {
      isHovering: false,
      isModalVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isDisabled={this.isDisabled()}
          isHovering={this.state.isHovering}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
        />
      );
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }

    onClick() {
      this.props.onClick();
    }

    isDisabled() {
      return this.props.isUserOrganizationOwner || this.props.isUserRegistered;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isUserOrganizationOwner: selectIsUserOrganizationOwner(state, {
        userId: props.userId,
      }),
      isUserRegistered: selectIsUserRegistered(state, { userId: props.userId }),
    };
  };

  return connect(mapStateToProps)(EnhanceGenerateInvitationLinkButton);
}

export default EnhanceResendInvitationButton;
