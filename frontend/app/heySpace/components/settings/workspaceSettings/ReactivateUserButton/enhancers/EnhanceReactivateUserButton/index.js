import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { onReactivateUserFromOrganization } from "models/domain/OrganizationsModel/actions";

import { selectIsUserOrganizationGuest } from "models/domain/OrganizationsModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceReactivateUserButton extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    state = {
      isGuestProfileVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          userId={this.props.userId}
          className={this.props.className}
          isGuestProfileVisible={this.state.isGuestProfileVisible}
          onReactivateUserFromOrganization={
            this.onReactivateUserFromOrganization
          }
          onSetIsModalVisible={this.onSetIsModalVisible}
        />
      );
    }

    onReactivateUserFromOrganization() {
      if (this.props.isUserOrganizationGuest) {
        this.onSetIsModalVisible(true);
      } else {
        this.props.onReactivateUserFromOrganization(this.props.userId);
      }
    }

    onSetIsModalVisible(isGuestProfileVisible) {
      this.setState({ isGuestProfileVisible });
    }
  }

  const mapStateToProps = (state, props) => ({
    isUserOrganizationGuest: selectIsUserOrganizationGuest(state, {
      userId: props.userId,
    }),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onReactivateUserFromOrganization: (userId) =>
      dispatch(onReactivateUserFromOrganization(userId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceReactivateUserButton);
}

export default Enhance;
