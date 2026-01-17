import PropTypes from 'prop-types';
import EnhanceWithClickOutside from 'react-click-outside';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import {
  onDeactivateUserFromOrganization,
  onUpdateUserRole,
} from 'models/domain/OrganizationsModel/actions';
import {
  selectIsCurrentUserCurrentOrganizationOwner,
  selectIsCurrentUserOrganizationAdmin,
} from 'models/domain/OrganizationsModel/selectors';
import {
  selectCurrentOrganizationName,
  selectIsUserOrganizationOwner,
  selectIsUserOrganizationGuest,
} from 'models/domain/OrganizationsModel/selectors/domain';
import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';
import {
  selectUserFullNameOrNickname,
  selectCurrentUserId,
  selectIsUserRegistered,
  selectIsUserAccountDeleted,
} from 'models/domain/UsersModel/selectors/domain';

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceWorkspaceMemberOptionsButton extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string,
      className: PropTypes.string,
    };

    static defaultProps = {};

    state = {
      isPopoverOpened: false,
      isDeactivateUserModalVisible: false,
      isTransferOwnershipModalVisible: false,
      isDirectInvitationLinkModallVisible: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          userId={this.props.userId}
          isOtherUser={this.props.currentUserId !== this.props.userId}
          isPopoverOpened={this.state.isPopoverOpened}
          fullName={this.props.fullName}
          workspaceName={this.props.workspaceName}
          isDeactivateUserModalVisible={this.state.isDeactivateUserModalVisible}
          isTransferOwnershipModalVisible={
            this.state.isTransferOwnershipModalVisible
          }
          isDirectInvitationLinkModalVisible={
            this.state.isDirectInvitationLinkModalVisible
          }
          isUserNotRegistered={!this.props.isUserRegistered}
          isUserOrganizationGuest={this.props.isUserOrganizationGuest}
          shouldRenderTransferOwnershipButton={this.shouldRenderTransferOwnershipButton()}
          shouldRenderDeactivateUserButton={this.shouldRenderDeactivateUserButton()}
          shouldRenderGuestManipulationOptions={this.shouldRenderGuestManipulationOptions()}
          onSetIsPopoverOpened={this.onSetIsPopoverOpened}
          onTransferOwnershipToUser={this.props.onTransferOwnershipToUser}
          onDeactivateUserFromOrganization={
            this.props.onDeactivateUserFromOrganization
          }
          onSetIsDeactivateUserModalVisible={
            this.onSetIsDeactivateUserModalVisible
          }
          onSetIsTransferOwnershipModalVisible={
            this.onSetIsTransferOwnershipModalVisible
          }
          onSetIsDirectInvitationLinkModalVisible={
            this.onSetIsDirectInvitationLinkModalVisible
          }
          onToggleDeactivateUserModalVisible={
            this.onToggleDeactivateUserModalVisible
          }
          onToggleTransferOwnershipModalVisible={
            this.onToggleTransferOwnershipModalVisible
          }
          onToggleDirectInvitationLinkModalVisible={
            this.onToggleDirectInvitationLinkModalVisible
          }
          onShowGuestProfile={this.onShowGuestProfile}
          onConvertToUser={this.onConvertToUser}
        />
      );
    }

    onSetIsPopoverOpened(isPopoverOpened) {
      this.setState({ isPopoverOpened });
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onSetIsPopoverOpened(false);
      }
    }

    onSetIsDeactivateUserModalVisible(isDeactivateUserModalVisible) {
      this.setState({ isDeactivateUserModalVisible });
    }

    onToggleDeactivateUserModalVisible() {
      this.setState(({ isDeactivateUserModalVisible }) => ({
        isDeactivateUserModalVisible: !isDeactivateUserModalVisible,
      }));
      this.onSetIsPopoverOpened(false);
    }

    onSetIsTransferOwnershipModalVisible(isTransferOwnershipModalVisible) {
      this.setState({ isTransferOwnershipModalVisible });
    }

    onSetIsDirectInvitationLinkModalVisible(
      isDirectInvitationLinkModalVisible
    ) {
      this.setState({ isDirectInvitationLinkModalVisible });
    }

    onToggleTransferOwnershipModalVisible() {
      this.setState(({ isTransferOwnershipModalVisible }) => ({
        isTransferOwnershipModalVisible: !isTransferOwnershipModalVisible,
      }));
      this.onSetIsPopoverOpened(false);
    }

    onToggleDirectInvitationLinkModalVisible() {
      this.setState(({ isDirectInvitationLinkModalVisible }) => ({
        isDirectInvitationLinkModalVisible: !isDirectInvitationLinkModalVisible,
      }));
      this.onSetIsPopoverOpened(false);
    }

    onShowGuestProfile() {
      this.props.onShowGuestProfileModal();
      this.onSetIsPopoverOpened(false);
    }

    onConvertToUser() {
      this.props.onConvertToUser();
      this.onSetIsPopoverOpened(false);
    }

    shouldRenderTransferOwnershipButton() {
      return (
        this.props.isCurrentUserOrganizationOwner &&
        !this.props.isUserOrganizationOwner &&
        !this.props.isUserOrganizationGuest &&
        this.props.isUserRegistered &&
        !this.props.isUserAccountDeleted
      );
    }

    shouldRenderDeactivateUserButton() {
      return (
        !this.props.isUserOrganizationOwner &&
        this.props.isCurrentUserOrganizationAdmin
      );
    }

    shouldRenderGuestManipulationOptions() {
      return (
        this.props.isUserOrganizationGuest &&
        this.props.isCurrentUserOrganizationAdmin
      );
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById('popper-root');
    }
  }

  const mapStateToProps = (state, props) => ({
    fullName: selectUserFullNameOrNickname(state, { userId: props.userId }),
    workspaceName: selectCurrentOrganizationName(state),
    currentUserId: selectCurrentUserId(state),
    isUserRegistered: selectIsUserRegistered(state, { userId: props.userId }),
    isUserOrganizationOwner: selectIsUserOrganizationOwner(state, {
      userId: props.userId,
    }),
    isUserOrganizationGuest: selectIsUserOrganizationGuest(state, {
      userId: props.userId,
    }),
    isUserAccountDeleted: selectIsUserAccountDeleted(state, {
      userId: props.userId,
    }),
    isCurrentUserOrganizationOwner:
      selectIsCurrentUserCurrentOrganizationOwner(state),
    isCurrentUserOrganizationAdmin: selectIsCurrentUserOrganizationAdmin(state),
  });

  const mapDispatchToProps = (dispatch, props) => ({
    onDeactivateUserFromOrganization: () =>
      dispatch(onDeactivateUserFromOrganization(props.userId)),
    onTransferOwnershipToUser: () =>
      dispatch(
        onUpdateUserRole(
          props.userId,
          props.currentOrganizationId,
          OrganizationPeopleRole.OWNER
        )
      ),
    onShowGuestProfileModal: () =>
      dispatch(
        onOpenModal(ModalType.GUEST_PROFILE_MODAL, {
          userId: props.userId,
          isDeactivating: false,
        })
      ),
    onConvertToUser: () =>
      dispatch(
        onUpdateUserRole(
          props.userId,
          props.currentOrganizationId,
          OrganizationPeopleRole.MEMBER
        )
      ),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceWorkspaceMemberOptionsButton);
}

export default enhance;
