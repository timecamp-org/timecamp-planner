import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "immutable-prop-types";
import { connect } from "react-redux";
import { Map, List } from "immutable";

import * as NotificationsModelSelectors from "models/domain/NotificationsModel/selectors";
import { selectProjectIsPrivate } from "models/domain/ProjectsModel/selectors";
import { selectCurrentUserId } from "models/domain/UsersModel/selectors/domain";
import { getNotificationPathConfig } from "models/domain/NotificationsModel/utils";
import { Quill } from "react-quill";

const Delta = Quill.import("delta");

import BaseComponent from "commonEnhancers/BaseComponent";

const emptyMap = new Map();
const emptyList = new List();

function Enhance(ComposedComponent) {
  class EnhanceMentionText extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      notificationId: PropTypes.string.isRequired,
      className: PropTypes.string,
      t: PropTypes.func,

      notificationType: PropTypes.number.isRequired,
      notificationData: ImmutablePropTypes.map,
      activityChanges: ImmutablePropTypes.list,
    };

    static defaultProps = {
      activityChanges: emptyList,
    };

    render() {
      return (
        <ComposedComponent
          notificationId={this.props.notificationId}
          notificationType={this.props.notificationType}
          activityChanges={this.props.activityChanges}
          actorId={this.props.actorId}
          userId={this.props.userId}
          userValue={this.props.userValue}
          targetId={this.props.targetId}
          targetValue={this.props.targetValue}
          targetType={this.props.targetType}
          containerId={this.props.containerId}
          containerValue={this.props.containerValue}
          containerType={this.props.containerType}
          projectId={this.props.projectId}
          projectValue={this.props.projectValue}
          taskListId={this.props.taskListId}
          taskListValue={this.props.taskListValue}
          taskId={this.props.taskId}
          taskValue={this.props.taskValue}
          messageId={this.props.messageId}
          messageValue={this.props.messageValue}
          fileValue={this.props.fileValue}
          taskSourceMessageId={this.props.taskSourceMessageId}
          isProjectPrivate={this.props.isProjectPrivate}
          isContainerNameVisible={this.shouldRenderContainerName()}
          taskSource={this.props.taskSource}
          isTaskCreatedFromOwnMessage={this.isTaskCreatedFromOwnMessage()}
          t={this.props.t}
        />
      );
    }

    shouldRenderContainerName() {
      return this.props.projectId && this.props.containerType !== "project";
    }

    isTaskCreatedFromOwnMessage() {
      return (
        this.props.taskSourceMessageId &&
        this.props.isTaskSourceMessageBelongsToCurrentUser
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const notificationData = NotificationsModelSelectors.selectNotificationData(
      state,
      { notificationId: props.notificationId }
    );
    const notificationType = NotificationsModelSelectors.selectNotificationType(
      state,
      { notificationId: props.notificationId }
    );
    const projectId = notificationData.get("projectId");
    const projectValue = notificationData.get("projectValue");
    const taskId = notificationData.get("taskId");
    const taskValue = notificationData.get("taskValue");
    const taskListId = notificationData.get("taskListId");
    const taskListValue = notificationData.get("taskListValue");
    const userId = notificationData.get("userId");
    const userValue = notificationData.get("userValue");
    const messageId = notificationData.get("messageId");
    const taskSourceMessageId = notificationData.get("taskSourceMessageId");
    const taskSourceMessageOwnerId = notificationData.get(
      "taskSourceMessageOwnerId"
    );
    let messageValue = "";
    try {
      messageValue = new Delta(
        JSON.parse(notificationData.get("messageValue"))
      );
    } catch (error) {
      messageValue = notificationData.get("messageValue");
    }
    const fileValue = notificationData.get("fileValue");

    const {
      targetId,
      targetValue,
      targetType,
      containerId,
      containerValue,
      containerType,
    } = getNotificationPathConfig(notificationType, notificationData);
    return {
      notificationType,
      activityChanges:
        NotificationsModelSelectors.selectFilteredNotificationActivityChanges(
          state,
          { notificationId: props.notificationId }
        ),
      actorId: NotificationsModelSelectors.selectNotificationActorId(state, {
        notificationId: props.notificationId,
      }),
      userId,
      userValue,
      projectId,
      projectValue,
      taskListId,
      taskListValue,
      taskId,
      taskValue,
      targetId,
      targetValue,
      targetType,
      containerId,
      containerValue,
      containerType,
      messageId,
      messageValue,
      taskSourceMessageId,
      taskSourceMessageOwnerId,
      isTaskSourceMessageBelongsToCurrentUser:
        taskSourceMessageOwnerId === selectCurrentUserId(state),
      fileValue,
      isProjectPrivate: selectProjectIsPrivate(state, { projectId }),
    };
  };

  return connect(mapStateToProps)(EnhanceMentionText);
}

export default Enhance;
