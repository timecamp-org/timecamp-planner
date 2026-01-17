import React from "react";
import { connect } from "react-redux";
import { UserTrackerEvent } from "models/component/UserTrackerEventModel/constants";

import {
  selectProjectIdByObjectId,
  selectProjectIdByConversationId,
} from "models/domain/ProjectsModel/selectors";
import { ProjectPanelType } from "models/domain/ProjectsSettingsModel/types";
import { ObjectResourceType } from "models/domain/ProjectsModel/types";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";
import EhanceWithUserTrackerEvent from 'enhancers/EhanceWithUserTrackerEvent';
import { onSetProjectLastOpenedPanel } from "../../../../../utils/lastOpenedPanelController";

export default function enhance(Component) {
  @EhanceWithUserTrackerEvent(UserTrackerEvent.pageOpen, { type: "chat" })
  class EnhanceProjectMessageBoard extends BaseComponent {
    render() {
      return (
        <Component
          projectId={this.props.projectId}
          isConversation={this.isConversation()}
          isProjectExist={this.props.isProjectExist}
          addUsersToProjectModalProjectId={
            this.props.addUsersToProjectModalProjectId
          }
        />
      );
    }

    isConversation() {
      return this.props.objectType === ObjectResourceType.CONVERSATIONS;
    }

    onUpdateLastPanelType() {
      onSetProjectLastOpenedPanel(this.props.projectId, ProjectPanelType.CHAT);
    }

    componentDidMount() {
      this.onUpdateLastPanelType();
    }

    componentDidUpdate() {
      this.onUpdateLastPanelType();
    }
  }

  const mapStateToProps = (state, props) => {
    const { projectId: objectId, objectType } = props.match.params;
    let projectId;
    if (objectType === ObjectResourceType.PROJECTS) {
      projectId = selectProjectIdByObjectId(state, { objectId });
    } else if (objectType === ObjectResourceType.CONVERSATIONS) {
      projectId = selectProjectIdByConversationId(state, {
        conversationId: objectId,
      });
    }
    return {
      projectId,
      objectType,
      currentUserId: selectCurrentUserId(state),
    };
  };

  return connect(mapStateToProps)(EnhanceProjectMessageBoard);
}
