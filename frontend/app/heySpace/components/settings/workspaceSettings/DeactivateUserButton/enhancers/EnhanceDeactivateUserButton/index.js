import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectIsUserOrganizationOwner } from "models/domain/OrganizationsModel/selectors/domain";

function EnhanceDeactivateUserButton(ComposedComponent) {
  class EnhanceDeactivateUserButton extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    state = {
      isHovering: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isSuccessModalVisible={this.state.isSuccessModalVisible}
          isDisabled={this.isDisabled()}
          isHovering={this.state.isHovering}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.props.onClick}
        />
      );
    }

    isDisabled() {
      return this.props.isUserOrganizationOwner;
    }

    onMouseEnter() {
      this.setState({ isHovering: true });
    }

    onMouseLeave() {
      this.setState({ isHovering: false });
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isUserOrganizationOwner: selectIsUserOrganizationOwner(state, {
        userId: props.userId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({});

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceDeactivateUserButton);
}

export default EnhanceDeactivateUserButton;
