import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import {
  onUpdateUserRole,
  onReactivateUserFromOrganization,
} from "models/domain/OrganizationsModel/actions";
import {
  selectCurrentOrganizationId,
  selectIsUserActiveInCurrentOrganization,
} from "models/domain/OrganizationsModel/selectors/domain";
import { OrganizationPeopleRole } from "models/domain/OrganizationsModel/types";
import {
  selectIsWorkspaceGuestSeatsAvailable,
  selectCanGuestsBeInvitedToWorkspace,
} from "models/domain/SubscriptionLimitsModel/selectors";

import { selectUserAssignedProjectIds } from "models/domain/ProjectsModel/selectors";
import { selectUserFullNameOrNickname } from "models/domain/UsersModel/selectors/domain";
import { ProjectPeopleRole } from "models/domain/ProjectsModel/types";
import {
  onMemberAdd,
  onMemberRemove,
  onRemoveGuestFromAllSpaces,
} from "models/domain/ProjectsModel/actions";

import { onCloseModal } from "models/component/ModalsModel/actions";
import { ModalType } from "models/component/ModalsModel/types";

import { doNothing } from "common/utils";

function Enhance(ComposedComponent) {
  class EnhanceGuestProfileModal extends BaseComponent {
    static propTypes = {
      onSetIsModalVisible: PropTypes.func,
      userId: PropTypes.string,
      isModalVisible: PropTypes.bool,
      isDeactivating: PropTypes.bool,
    };

    static defaultProps = {
      onSetIsModalVisible: doNothing,
      isModalVisible: false,
    };

    state = {
      selectedSpaceId: null,
      isDeactivating: this.props.isDeactivating || false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          userId={this.props.userId}
          isModalVisible={this.props.isModalVisible}
          isDeactivating={this.state.isDeactivating}
          isConvertingToGuest={this.props.isConvertingToGuest}
          isWorkspaceGuestSeatsAvailable={
            this.props.isWorkspaceGuestSeatsAvailable
          }
          spaceIds={this.props.spaceIds}
          selectedSpaceId={this.state.selectedSpaceId}
          isUserActive={this.props.isUserActive}
          canGuestsBeInvitedToWorkspace={
            this.props.canGuestsBeInvitedToWorkspace
          }
          fullName={this.props.fullName}
          onSetIsModalVisible={this.onSetIsModalVisible}
          onConvertToUser={this.onConvertToUser}
          onSelectedSpaceChange={this.onSelectedSpaceChange}
          onRemoveFromSpace={this.onRemoveFromSpace}
          onRemoveFromAllSpaces={this.onRemoveFromAllSpaces}
          onConfirmRemoveFromAllSpaces={this.onConfirmRemoveFromAllSpaces}
          onAddToSpace={this.onAddToSpace}
          onReactivateUserInWorkspace={
            this.props.onReactivateUserFromOrganization
          }
          onCancelDeactivate={this.onCancelDeactivate}
          onSetListEndRef={this.onSetListEndRef}
          onConvertToGuest={this.onConvertToGuest}
        />
      );
    }

    onSetListEndRef(listBottom) {
      this.listBottom = listBottom;
    }

    onConvertToUser() {
      this.props.onUpdateUserRole(
        this.props.organizationId,
        OrganizationPeopleRole.MEMBER
      );
      this.onSetIsModalVisible(false);
    }

    onConvertToGuest() {
      this.props.onUpdateUserRole(
        this.props.organizationId,
        OrganizationPeopleRole.GUEST
      );
      this.onSetIsModalVisible(false);
    }

    onSetIsModalVisible(isModalVisible) {
      this.onSetIsDeactivating(false);
      this.props.onSetIsModalVisible(isModalVisible);
      this.props.onCloseModal();
    }

    onRemoveFromSpace(projectId) {
      const { isUserActive, spaceIds } = this.props;
      if (spaceIds.size === 1 && isUserActive) {
        this.onSetIsDeactivating(true);
      } else {
        this.props.onMemberRemove(projectId);
      }
    }

    onRemoveFromAllSpaces() {
      this.onSetIsDeactivating(true);
    }

    onSetIsDeactivating(isDeactivating) {
      this.setState({ isDeactivating });
    }

    onCancelDeactivate() {
      this.props.onCloseModal();
      this.onSetIsDeactivating(false);
    }

    onConfirmRemoveFromAllSpaces() {
      this.props.onRemoveFromAllSpaces();
      this.onSetIsModalVisible(false);
    }

    onAddToSpace() {
      if (this.state.selectedSpaceId) {
        this.props.onMemberAdd(this.state.selectedSpaceId);
        this.setState({ selectedSpaceId: null });
        setImmediate(this.onScrollToBottom);
      }
    }

    onScrollToBottom() {
      if (this.listBottom) {
        this.listBottom.scrollIntoView({ behavior: "smooth" });
      }
    }

    onSelectedSpaceChange(selectedSpaceId) {
      this.setState({
        selectedSpaceId: selectedSpaceId,
      });
    }
  }

  const mapStateToProps = (state, props) => ({
    isWorkspaceGuestSeatsAvailable: selectIsWorkspaceGuestSeatsAvailable(state),
    spaceIds: selectUserAssignedProjectIds(state, { userId: props.userId }),
    organizationId: selectCurrentOrganizationId(state),
    isUserActive: selectIsUserActiveInCurrentOrganization(state, {
      userId: props.userId,
    }),
    canGuestsBeInvitedToWorkspace: selectCanGuestsBeInvitedToWorkspace(state, {
      userId: props.userId,
      guestsToInviteCount: 1,
    }),
    fullName: selectUserFullNameOrNickname(state, { userId: props.userId }),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onUpdateUserRole: (organizationId, role) =>
      dispatch(onUpdateUserRole(props.userId, organizationId, role)),
    onMemberRemove: (projectId) =>
      dispatch(onMemberRemove(projectId, props.userId)),
    onMemberAdd: (projectId) =>
      dispatch(onMemberAdd(projectId, props.userId, ProjectPeopleRole.MEMBER)),
    onRemoveFromAllSpaces: () =>
      dispatch(onRemoveGuestFromAllSpaces(props.userId)),
    onReactivateUserFromOrganization: () =>
      dispatch(onReactivateUserFromOrganization(props.userId)),
    onCloseModal: () => dispatch(onCloseModal(ModalType.GUEST_PROFILE_MODAL)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceGuestProfileModal);
}

export default Enhance;
