import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ImmutablePropTypes from "react-immutable-proptypes";
import { List } from "immutable";

import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";

import {
  selectUserFirstName,
  selectUserLastName,
  selectUserEmail,
  selectCurrentUserId,
  selectUserNickname,
  selectUserIsBot,
} from "models/domain/UsersModel/selectors/domain";
import { selectProjectPeople } from "models/domain/ProjectsModel/selectors/domain";
import {
  selectIsUserActiveInCurrentOrganization,
  selectIsUserOrganizationGuest,
} from "models/domain/OrganizationsModel/selectors/domain";

function Enhance(ComposedComponent) {
  class EnhanceUserLabel extends BaseComponent {
    static propTypes = {
      userId: PropTypes.string.isRequired,
      currentUserId: PropTypes.string.isRequired,
      projectId: PropTypes.string,
      shouldRenderProjectStatus: PropTypes.bool,
      projectPeople: ImmutablePropTypes.list,

      userFirstName: PropTypes.string,
      userLastName: PropTypes.string,
      userEmail: PropTypes.string,

      onClick: PropTypes.func,
    };

    static defaultProps = {
      projectPeople: new List(),
      shouldRenderProjectStatus: false,
      onClick: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          isCurrentUserLabel={this.isCurrentUserLabel()}
          isProjectMember={this.isProjectMember()}
          shouldRenderProjectStatus={this.props.shouldRenderProjectStatus}
          shouldRenderEmail={this.props.shouldRenderEmail && !this.props.isBot}
          isUserActive={this.props.isUserActive}
          isUserGuest={this.props.isUserGuest}
          onClick={this.onClick}
        />
      );
    }

    onClick() {
      if (!(this.props.shouldRenderProjectStatus && this.isProjectMember())) {
        this.props.onClick();
      }
    }

    isProjectMember() {
      return this.props.projectPeople.indexOf(this.props.userId) > -1;
    }

    isCurrentUserLabel() {
      return this.props.currentUserId === this.props.userId;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      userFirstName: selectUserFirstName(state, { userId: props.userId }),
      userLastName: selectUserLastName(state, { userId: props.userId }),
      userEmail: selectUserEmail(state, { userId: props.userId }),
      userNickname: selectUserNickname(state, { userId: props.userId }),
      isBot: selectUserIsBot(state, { userId: props.userId }),
      projectPeople: selectProjectPeople(state, { projectId: props.projectId }),
      currentUserId: selectCurrentUserId(state),
      isUserActive: selectIsUserActiveInCurrentOrganization(state, {
        userId: props.userId,
      }),
      isUserGuest: selectIsUserOrganizationGuest(state, {
        userId: props.userId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceUserLabel);
}

export default Enhance;
