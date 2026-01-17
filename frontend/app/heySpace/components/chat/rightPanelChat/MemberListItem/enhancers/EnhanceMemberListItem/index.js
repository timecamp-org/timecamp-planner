import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EnhanceWithClickOutside from "react-click-outside";

import {
  selectIsUserOrganizationGuest,
  selectIsUserActiveInCurrentOrganization,
} from "models/domain/OrganizationsModel/selectors/domain";
import {
  selectUserAssignedProjectIds,
  selectProjectUserRole,
} from "models/domain/ProjectsModel/selectors";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";

import { onOpenModal } from "models/component/ModalsModel/actions";
import { ModalType } from "models/component/ModalsModel/types";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectCurrentOrganizationUserOccupiedGuestSeatsCount } from "models/domain/GuestsModel/selectors";

function Enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceMemberListItem extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    };

    static defaultProps = {};

    state = {
      isPopoverOpened: false,
    };

    render() {
      return (
        <ComposedComponent
          userId={this.props.userId}
          isPopoverOpened={this.state.isPopoverOpened}
          isUserGuest={this.props.isUserGuest}
          projectRole={this.props.projectRole}
          isCurrentUser={this.props.userId === this.props.currentUserId}
          onPopoverOpen={this.onPopoverOpen}
          onMemberClick={this.onMemberClick}
          onMemberRemove={this.onMemberRemove}
          shouldRenderMoreButton={this.props.shouldRenderMoreButton}
        />
      );
    }

    onMemberClick() {
      this.props.onMemberClick(this.props.userId);
    }

    onMemberRemove(event) {
      event.stopPropagation();
      this.onPopoverClose();
      const { isUserGuest, isUserActive, userOccupiedGuestSeatsCount } =
        this.props;
      if (isUserGuest && userOccupiedGuestSeatsCount === 1 && isUserActive) {
        this.props.onShowGuestDeactivateModal();
      } else {
        this.props.onMemberRemove(this.props.userId);
      }
    }

    onPopoverOpen(event) {
      event.stopPropagation();
      this.setState({
        isPopoverOpened: true,
      });
    }

    onPopoverClose() {
      this.setState({
        isPopoverOpened: false,
      });
    }

    handleClickOutside(event) {
      if (
        this.state.isPopoverOpened &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.onPopoverClose();
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    isUserGuest: selectIsUserOrganizationGuest(state, { userId: props.userId }),
    isUserActive: selectIsUserActiveInCurrentOrganization(state, {
      userId: props.userId,
    }),
    userOccupiedGuestSeatsCount:
      selectCurrentOrganizationUserOccupiedGuestSeatsCount(state, {
        userId: props.userId,
      }),
    projectRole: selectProjectUserRole(state, {
      userId: props.userId,
      projectId: props.projectId,
    }),
  });

  function mapDispatchToProps(dispatch, props) {
    return {
      onShowGuestDeactivateModal: () =>
        dispatch(
          onOpenModal(ModalType.GUEST_PROFILE_MODAL, {
            userId: props.userId,
            isDeactivating: true,
          })
        ),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMemberListItem);
}

export default Enhance;
