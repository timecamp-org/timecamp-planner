import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import { List } from 'immutable';
import fuzzysearch from 'fuzzysearch';

import { isValidEmail } from 'common/utils/validation';
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'

import BaseComponent from 'commonEnhancers/BaseComponent';

import {
  selectCurrentUserId,
  selectUsersSearchName,
} from 'models/domain/UsersModel/selectors/domain';
import {
  selectSortedProjectMembers,
  selectSortedProjectMembersWithGuests,
  selectProjectGuests,
  selectProjectColor,
  selectUserAssignedProjectIds,
} from 'models/domain/ProjectsModel/selectors';
import {
  selectIsProjectEditable,
  selectCanUserInviteToProject,
} from 'models/domain/ProjectsModel/selectors/permission';
import {
  onMemberRemove,
  onCreateUserAndAddToSubscribers,
  onMemberAdd,
  onCreateConversationIfDoesNotExist,
} from 'models/domain/ProjectsModel/actions';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectCurrentOrganizationActiveGuestUserIdsSorted,
  selectCurrentOrganizationMemberUserIdsSortedAlphabetically,
} from 'models/domain/OrganizationsModel/selectors';
import { onInviteGuestsToOrganization } from 'models/domain/OrganizationsModel/actions';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { onAddAlert } from 'models/component/PopUpAlertsModel/actions';
import * as RequestModelSelectors from 'models/domain/RequestModel/selectors';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { generateConversationId } from 'common/utils/generateCombinedId';
import { selectIsWorkspaceGuestSeatsAvailable } from 'models/domain/SubscriptionLimitsModel/selectors';
import { makeConversationLink } from 'common/utils/routerHelpers';

const emptyList = new List();

function Enhance(ComposedComponent) {
  @EnhanceWithRouter()
  class EnhanceMembersRightPanelChat extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      isConversation: PropTypes.bool,
      isWorkspaceGuestSeatsAvailable: PropTypes.bool.isRequired,
    };

    static defaultProps = {};

    state = {
      isInviteUserSearchVisible: false,
      isInvitingGuestChecked: false,
      isInvitingGuestDirectly: false,
    };

    render() {
      return (
        <ComposedComponent
          memberIds={this.props.memberIds}
          guestIds={this.props.guestIds}
          organizationGuestIds={this.props.organizationGuestIds}
          isInviteUserSearchVisible={this.state.isInviteUserSearchVisible}
          projectId={this.props.projectId}
          isOrganizationUsersLoading={this.props.isOrganizationUsersLoading}
          color={this.props.color}
          userIds={this.props.userIds}
          isConversation={this.props.isConversation}
          isProjectEditable={this.props.isProjectEditable}
          isWorkspaceGuestSeatsAvailable={
            this.props.isWorkspaceGuestSeatsAvailable
          }
          isInvitingGuestChecked={this.state.isInvitingGuestChecked}
          isInvitingGuestDirectly={this.state.isInvitingGuestDirectly}
          canCurrentUserAddMember={this.canCurrentUserAddMember()}
          userListFilter={this.userListFilter}
          onMemberClick={this.onMemberClick}
          onMemberRemove={this.onMemberRemove}
          onSetIsInviteUserSearchVisible={this.onSetIsInviteUserSearchVisible}
          onSetIsInviteGuestSearchVisible={this.onSetIsInviteGuestSearchVisible}
          onAddUserToSubscribers={this.onAddUserToSubscribers}
          onCreateUserAndAddToSubscribers={this.onCreateUserAndAddToSubscribers}
          onOpenUserSearch={this.onOpenUserSearch}
          onCloseUserSearch={this.onCloseUserSearch}
          onClickInvite={this.onClickInvite}
          onSearchClickOutside={this.onSearchClickOutside}
          shouldRenderMoreButton={this.shouldRenderMoreButton}
          onSetIsInvitingGuest={this.onSetIsInvitingGuest}
        />
      );
    }

    onSearchClickOutside(list, value) {
      if (value === '') {
        this.onCloseUserSearch();
      }
    }

    onOpenUserSearch() {
      this.onSetIsInviteUserSearchVisible(true);
    }

    onCloseUserSearch() {
      this.onSetIsInviteUserSearchVisible(false);
    }

    onSetIsInviteUserSearchVisible(isVisible) {
      this.setState({
        isInviteUserSearchVisible: isVisible,
        isInvitingGuestChecked: false,
        isInvitingGuestDirectly: false,
      });
    }

    onSetIsInviteGuestSearchVisible(isVisible) {
      this.setState({
        isInviteUserSearchVisible: isVisible,
        isInvitingGuestChecked: true,
        isInvitingGuestDirectly: true,
      });
    }

    onMemberClick(userId) {
      const { currentUserId, organizationId } = this.props;
      const people = new List(
        userId === currentUserId ? [userId] : [userId, currentUserId]
      );
      const conversationId = generateConversationId(people, organizationId);
      this.props.onCreateConversationIfDoesNotExist(people);
      this.props.history.push(makeConversationLink(conversationId));
    }

    onMemberRemove(userId) {
      const { currentUserId, organizationId } = this.props;
      if (currentUserId === userId) {
        const conversationId = generateConversationId(
          [currentUserId],
          organizationId
        );
        this.props.history.push(makeConversationLink(conversationId));
      }
      this.props.onMemberRemove(userId);
    }

    onAddUserToSubscribers(userId) {
      if (!this.props.memberIds.includes(userId)) {
        this.onSetIsInviteUserSearchVisible(false);
        this.props.onAddUserToSubscribers(userId);
      }
    }

    onCreateUserAndAddToSubscribers(email) {
      this.onSetIsInviteUserSearchVisible(false);
      this.props.onCreateUserAndAddToSubscribers(email);
    }

    onClickInvite(value) {
      const validationResult = isValidEmail(value, true);
      if (!validationResult.isValid) {
        this.props.onAddAlert(HumanMessage({
          kind: HumanMessageKind.error,
          text: validationResult.message,
        }))
      } else {
        if (this.state.isInvitingGuestChecked) {
          this.props.onInviteGuestToOrganization(value);
        } else {
          this.props.onCreateUserAndAddToSubscribers(value);
        }
        this.onSetIsInviteUserSearchVisible(false);
      }
    }

    userListFilter(userIds, value) {
      let result = emptyList;

      userIds.forEach((userId) => {
        const name = this.props.userSearchName.get(userId) || '';

        if (fuzzysearch(value.toLowerCase(), name.toLowerCase())) {
          result = result.push(userId);
        }
      });

      return result;
    }

    shouldRenderMoreButton(userId) {
      const isGuestLastSpace =
        this.props.isCurrentUserOrganizationGuest &&
        this.props.currentUserAssignedProjects.size === 1;
      return (
        !this.props.isConversation &&
        this.props.isProjectEditable &&
        !isGuestLastSpace
      );
    }

    canCurrentUserAddMember() {
      return !this.props.conversationId && this.props.canUserInviteToProject;
    }

    onSetIsInvitingGuest(isInvitingGuestChecked) {
      this.setState({ isInvitingGuestChecked });
    }
  }

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state);
    const currentUserId = selectCurrentUserId(state);
    return {
      memberIds: props.isConversation
        ? selectSortedProjectMembersWithGuests(state, {
            projectId: props.projectId,
          })
        : selectSortedProjectMembers(state, { projectId: props.projectId }),
      guestIds: selectProjectGuests(state, { projectId: props.projectId }),
      color: selectProjectColor(state, { projectId: props.projectId }),
      isOrganizationUsersLoading:
        !RequestModelSelectors.selectIsRequestFinished(state, {
          requestType: RequestTypesConstants.getOrganizationPeople,
          objectId: organizationId,
        }),
      currentUserId,
      organizationId,
      userIds:
        selectCurrentOrganizationMemberUserIdsSortedAlphabetically(state),
      organizationGuestIds:
        selectCurrentOrganizationActiveGuestUserIdsSorted(state),
      userSearchName: selectUsersSearchName(state),
      isProjectEditable: selectIsProjectEditable(state, {
        projectId: props.projectId,
      }),
      canUserInviteToProject: selectCanUserInviteToProject(state, {
        projectId: props.projectId,
      }),
      isWorkspaceGuestSeatsAvailable:
        selectIsWorkspaceGuestSeatsAvailable(state),
      isCurrentUserOrganizationGuest:
        selectIsCurrentUserOrganizationGuest(state),
      currentUserAssignedProjects: selectUserAssignedProjectIds(state, {
        userId: currentUserId,
      }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onMemberRemove: (userId) =>
        dispatch(onMemberRemove(props.projectId, userId)),
      onAddUserToSubscribers: (userId) =>
        dispatch(
          onMemberAdd(props.projectId, userId, ProjectPeopleRole.MEMBER)
        ),
      onCreateUserAndAddToSubscribers: (email) =>
        dispatch(
          onCreateUserAndAddToSubscribers(
            props.projectId,
            email,
            ProjectPeopleRole.MEMBER
          )
        ),
      onInviteGuestToOrganization: (email) =>
        dispatch(
          onInviteGuestsToOrganization([email], [props.projectId], false)
        ),
      onAddAlert: (humanMessage) => dispatch(onAddAlert({ humanMessage })),
      onCreateConversationIfDoesNotExist: (people) =>
        dispatch(onCreateConversationIfDoesNotExist(people)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceMembersRightPanelChat);
}

export default Enhance;
