import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import {
  onReactivateUserFromOrganization,
  onSetOpenedReactivateUserModalId,
} from "models/domain/OrganizationsModel/actions";

import { selectCurrentOrganizationName } from "models/domain/OrganizationsModel/selectors/domain";

import { selectUserFullNameOrNickname } from "models/domain/UsersModel/selectors/domain";

function EnhanceReactivateUserModal(ComposedComponent) {
  class EnhanceReactivateUserModal extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
      onReactivateUserFromOrganization: PropTypes.func.isRequired,
    };

    state = {
      isModalVisible: true,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          isModalVisible={this.state.isModalVisible}
          fullName={this.props.fullName}
          workspaceName={this.props.workspaceName}
          onReactivateUserFromOrganization={
            this.props.onReactivateUserFromOrganization
          }
          onSetIsModalVisible={this.onSetIsModalVisible}
          onToggleModalVisible={this.onToggleModalVisible}
          onCloseModal={this.onCloseModal}
        />
      );
    }

    onSetIsModalVisible(isModalVisible) {
      this.setState({ isModalVisible });
    }

    onToggleModalVisible() {
      this.setState(({ isModalVisible }) => ({
        isModalVisible: !isModalVisible,
      }));
    }

    onCloseModal() {
      this.setState({ isModalVisible: false });
      this.props.onClearOpenedReactivateUserModalId();
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      fullName: selectUserFullNameOrNickname(state, { userId: props.userId }),
      workspaceName: selectCurrentOrganizationName(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onReactivateUserFromOrganization: () =>
      dispatch(onReactivateUserFromOrganization(props.userId)),
    onClearOpenedReactivateUserModalId: () =>
      dispatch(onSetOpenedReactivateUserModalId(null)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceReactivateUserModal);
}

export default EnhanceReactivateUserModal;
