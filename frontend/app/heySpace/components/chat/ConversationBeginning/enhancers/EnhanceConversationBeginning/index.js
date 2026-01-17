import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ImmutablePropTypes from "react-immutable-proptypes";

import BaseComponent from "commonEnhancers/BaseComponent";

import {
  selectProjectIsGroupChat,
  selectProjectIsDirectChat,
  selectProjectName,
} from "models/domain/ProjectsModel/selectors";
import { selectProjectPeople } from "models/domain/ProjectsModel/selectors/domain";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";
import { EntityType } from "models/domain/EntityModel/types";
import { selectEntityType } from "models/domain/EntityModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceConversationBeginning extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,

      // This enhancer
      currentUserId: PropTypes.string.isRequired,
      isTaskConversation: PropTypes.bool.isRequired,
      isDirectChat: PropTypes.bool.isRequired,
      isGroupChat: PropTypes.bool.isRequired,
      projectPeopleIds: ImmutablePropTypes.list.isRequired,
    };

    render() {
      const isUserOwnChat =
        this.props.isDirectChat &&
        this.props.projectPeopleIds.size === 1 &&
        this.props.projectPeopleIds.includes(this.props.currentUserId);
      return (
        <ComposedComponent
          userId={this.getUserId()}
          userIds={this.getUserIds()}
          isUserOwnChat={isUserOwnChat}
          isTaskConversation={this.props.isTaskConversation}
          isDirectChat={this.props.isDirectChat}
          isGroupChat={this.props.isGroupChat}
          projectId={this.props.objectId}
          projectName={this.props.projectName}
        />
      );
    }

    getUserId() {
      const projectPeopleWithoutCurrentUser =
        this.props.projectPeopleIds.filter(
          (id) => id !== this.props.currentUserId
        );
      if (projectPeopleWithoutCurrentUser.count() > 0) {
        return projectPeopleWithoutCurrentUser.first();
      } else {
        return this.props.currentUserId;
      }
    }

    getUserIds() {
      const projectPeopleWithoutCurrentUser =
        this.props.projectPeopleIds.filter(
          (id) => id !== this.props.currentUserId
        );
      if (projectPeopleWithoutCurrentUser.count() > 0) {
        return projectPeopleWithoutCurrentUser;
      } else {
        return this.props.projectPeopleIds;
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isTaskConversation:
        selectEntityType(state, { entityId: props.objectId }) ===
        EntityType.TASK_DATA,
      isDirectChat: selectProjectIsDirectChat(state, {
        projectId: props.objectId,
      }),
      isGroupChat: selectProjectIsGroupChat(state, {
        projectId: props.objectId,
      }),
      projectName: selectProjectName(state, { projectId: props.objectId }),
      currentUserId: selectCurrentUserId(state),
      projectPeopleIds: selectProjectPeople(state, {
        projectId: props.objectId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceConversationBeginning);
}

export default Enhance;
