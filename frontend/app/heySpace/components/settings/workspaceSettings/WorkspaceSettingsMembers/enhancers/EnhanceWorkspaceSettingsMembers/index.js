import React from 'react';
import { connect } from 'react-redux';
import BaseComponent from 'commonEnhancers/BaseComponent';
import generatePushId from 'common/utils/generate-pushid';

import {
  selectDeactivatedUserIds,
  selectCurrentOrganizationActivePeopleRole,
} from 'models/domain/OrganizationsModel/selectors/domain';

import {
  selectCurrentOrganizationMemberUserIdsSortedByRole,
  selectCurrentOrganizationActiveGuestUserIds,
  selectIsCurrentUserOrganizationAdmin,
} from 'models/domain/OrganizationsModel/selectors';
import { selectCurrentOrganizationOccupiedGuestSeatsCount } from 'models/domain/GuestsModel/selectors';
import {
  selectCurrentSubscriptionGuestSeatCount,
  selectUsersPerWorkspaceLimit,
} from 'models/domain/SubscriptionLimitsModel/selectors';
import { onInviteUsersToOrganization } from 'models/domain/OrganizationsModel/actions';
import { OrganizationPeopleRole } from 'models/domain/OrganizationsModel/types';

import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { UserTracker } from 'common/services';
import { List } from 'immutable';
import { selectUsersRegistrationStatus } from 'models/domain/UsersModel/selectors/domain';
import { RegistrationStatus } from 'models/domain/UsersModel/types';
import { onInviteGuestsToOrganization } from 'models/domain/OrganizationsModel/actions';
const emptyList = new List();
export default function enhance(Component) {
  class EnhanceWorkspaceSettingsMembers extends BaseComponent {
    state = {
      isActiveUsersVisible: true,
      isGuestUsersVisible: true,
      isDisabledUsersVisible: true,
      isGuestInfoVisible: true,
      selectedSpaceIds: emptyList,
      isProjectDropdownVisible: false,
      error: null,
    };

    render() {
      return (
        <Component
          userIdList={this.props.userIdList}
          guestUserIds={this.props.guestUserIds}
          deactivatedUserIds={this.props.deactivatedUserIds}
          userSeatCount={this.props.userSeatCount}
          guestSeatCount={this.props.guestSeatCount}
          occupiedGuestSeats={this.props.occupiedGuestSeats}
          isActiveUsersVisible={this.state.isActiveUsersVisible}
          isGuestUsersVisible={this.state.isGuestUsersVisible}
          isDisabledUsersVisible={this.state.isDisabledUsersVisible}
          isGuestInfoVisible={this.state.isGuestInfoVisible}
          isCurrentUserOrganizationAdmin={this.props.isCurrentUserOrganizationAdmin}
          onSendInvitations={this.onSendInvitations}
          onDeactivateUserFromOrganization={this.props.onDeactivateUserFromOrganization}
          onActiveUsersSwitcherClick={this.onActiveUsersSwitcherClick}
          onGuestUsersSwitcherClick={this.onGuestUsersSwitcherClick}
          onDisabledUsersSwitcherClick={this.onDisabledUsersSwitcherClick}
          onSetIsGuestInfoVisible={this.onSetIsGuestInfoVisible}
          shouldRenderWorkspaceMemberOptions={this.shouldRenderWorkspaceMemberOptions}
          isGuestsExceeded={this.isGuestsExceeded()}
          onSelectedSpacesChange={this.onSelectedSpacesChange}
          isProjectDropdownVisible={this.state.isProjectDropdownVisible}
          onSetIsProjectDropdownShown={this.onSetIsProjectDropdownVisible}
        />
      );
    }

    shouldRenderWorkspaceMemberOptions(userId) {
      const isUserPending = this.props.usersRegistrationStatus.get(userId) !== RegistrationStatus.REGISTERED;
      const isUserOwner = this.props.organizationPeopleRole.get(userId) === OrganizationPeopleRole.OWNER;

      return !isUserOwner && (this.props.isCurrentUserOrganizationAdmin || isUserPending);
    }
    onSetIsProjectDropdownVisible(isProjectDropdownVisible) {
      this.setState({
        isProjectDropdownVisible,
      });
    }
    onSelectedSpacesChange(spaceIds) {
      this.setState({
        selectedSpaceIds: new List(spaceIds),
        error: null,
      });
    }

    onSendInvitations(emails) {
      if (emails.length === 0) {
        return false;
      }
      const users = emails.map((email) => {
        UserTracker.track(UserTrackerEvent.memberInvited, {
          source: 'team-menu',
        });
        return {
          userId: generatePushId(),
          email,
        };
      });

      if (this.state.isProjectDropdownVisible) {
        const { selectedSpaceIds } = this.state;
        this.props.onInviteGuestsToOrganization(emails, selectedSpaceIds.toJS());
      } else {
        this.props.onInviteUsersToOrganization(users);
      }

      return true;
    }

    onDisabledUsersSwitcherClick() {
      this.setState({
        isDisabledUsersVisible: !this.state.isDisabledUsersVisible,
      });
    }

    onGuestUsersSwitcherClick() {
      this.setState({
        isGuestUsersVisible: !this.state.isGuestUsersVisible,
      });
    }

    onActiveUsersSwitcherClick() {
      this.setState({
        isActiveUsersVisible: !this.state.isActiveUsersVisible,
      });
    }

    onSetIsGuestInfoVisible(isGuestInfoVisible) {
      this.setState({
        isGuestInfoVisible,
      });
    }
    onValidateForm() {
      if (this.state.selectedUserEmails.size === 0) {
        const error = i18n.t('You forgot to type emails.');
        this.setState({ error });
        return false;
      }
      if (this.state.selectedSpaceIds.size === 0) {
        const error = i18n.t('You forgot to choose projects.');
        this.setState({ error });
        return false;
      }
      return true;
    }
    onClearErrors() {
      this.setState({ error: null });
    }
    isGuestsExceeded() {
      return this.props.occupiedGuestSeats + this.state.selectedSpaceIds.size > this.props.guestSeatCount;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      userIdList: selectCurrentOrganizationMemberUserIdsSortedByRole(state),
      guestUserIds: selectCurrentOrganizationActiveGuestUserIds(state),
      occupiedGuestSeats: selectCurrentOrganizationOccupiedGuestSeatsCount(state),
      deactivatedUserIds: selectDeactivatedUserIds(state),
      isCurrentUserOrganizationAdmin: selectIsCurrentUserOrganizationAdmin(state),
      userSeatCount: selectUsersPerWorkspaceLimit(state),
      guestSeatCount: selectCurrentSubscriptionGuestSeatCount(state),
      organizationPeopleRole: selectCurrentOrganizationActivePeopleRole(state),
      usersRegistrationStatus: selectUsersRegistrationStatus(state),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onInviteUsersToOrganization: (users) => dispatch(onInviteUsersToOrganization(users)),
      onInviteGuestsToOrganization: (guests, spaceIds) =>
        dispatch(onInviteGuestsToOrganization(guests, spaceIds, false)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWorkspaceSettingsMembers);
}
