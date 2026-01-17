import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import EnhanceWithClickOutside from "react-click-outside";

import {
  selectUserOrganizationRole,
  selectCurrentOrganizationId,
  selectIsUserOrganizationOwner,
  selectIsUserOrganizationAdmin,
} from "models/domain/OrganizationsModel/selectors/domain";
import {
  selectAvailableUserRoles,
  selectIsCurrentUserOrganizationAdmin,
  selectIsCurrentUserCurrentOrganizationOwner,
} from "models/domain/OrganizationsModel/selectors";
import { onUpdateUserRole } from "models/domain/OrganizationsModel/actions";
import {
  selectIsUserRegistered,
  selectCurrentUserId,
  selectIsUserAccountDeleted,
} from "models/domain/UsersModel/selectors/domain";
import { OrganizationPeopleRole } from "models/domain/OrganizationsModel/types";

function EnhanceWorkspaceRolesDropdown(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceWorkspaceRolesDropdown extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
    };

    state = {
      isOpen: false,
      isGuestProfileVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          userId={this.props.userId}
          availableUserRoles={this.props.availableUserRoles}
          userOrganizationRole={this.props.userOrganizationRole}
          isUserRegistered={this.props.isUserRegistered}
          isOpen={this.state.isOpen}
          isGuestProfileVisible={this.state.isGuestProfileVisible}
          isDisabled={this.isDisabled()}
          shouldRenderDropdown={this.shouldRenderDropdown()}
          onClick={this.onClick}
          onSelectRole={this.onSelectRole}
          onSetIsModalVisible={this.onSetIsModalVisible}
        />
      );
    }

    onClick() {
      this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }

    handleClickOutside(event) {
      if (
        this.state.isOpen &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onCloseDropdown();
      }
    }

    onCloseDropdown() {
      this.setState({ isOpen: false });
    }

    onSelectRole(role) {
      if (role === OrganizationPeopleRole.GUEST) {
        this.onSetIsModalVisible(true);
      } else {
        this.props.onUpdateUserRole(role, this.props.organizationId);
      }
      this.onCloseDropdown();
    }

    isDisabled() {
      return (
        this.props.isUserOrganizationOwner ||
        !this.props.isCurrentUserOrganizationAdmin
      );
    }

    shouldRenderDropdown() {
      const isCurrentUser = this.props.userId === this.props.currentUserId;
      const hasAvailableRoles = this.props.availableUserRoles.size > 0;
      const isAdminRole =
        this.props.isUserOrganizationAdmin &&
        !this.props.isCurrentUserOrganizationOwner;
      return (
        !this.isDisabled() &&
        hasAvailableRoles &&
        !isCurrentUser &&
        !isAdminRole &&
        !this.props.isUserAccountDeleted
      );
    }

    onSetIsModalVisible(isGuestProfileVisible) {
      this.setState({ isGuestProfileVisible });
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  function mapStateToProps(state, props) {
    return {
      currentUserId: selectCurrentUserId(state),
      availableUserRoles: selectAvailableUserRoles(state, {
        userId: props.userId,
      }),
      userOrganizationRole: selectUserOrganizationRole(state, {
        userId: props.userId,
      }),
      organizationId: selectCurrentOrganizationId(state),
      isUserOrganizationOwner: selectIsUserOrganizationOwner(state, {
        userId: props.userId,
      }),
      isUserOrganizationAdmin: selectIsUserOrganizationAdmin(state, {
        userId: props.userId,
      }),
      isUserRegistered: selectIsUserRegistered(state, { userId: props.userId }),
      isUserAccountDeleted: selectIsUserAccountDeleted(state, {
        userId: props.userId,
      }),
      isCurrentUserOrganizationAdmin:
        selectIsCurrentUserOrganizationAdmin(state),
      isCurrentUserOrganizationOwner:
        selectIsCurrentUserCurrentOrganizationOwner(state),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUpdateUserRole: (role, organizationId) =>
        dispatch(onUpdateUserRole(props.userId, organizationId, role)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceWorkspaceRolesDropdown);
}

export default EnhanceWorkspaceRolesDropdown;
