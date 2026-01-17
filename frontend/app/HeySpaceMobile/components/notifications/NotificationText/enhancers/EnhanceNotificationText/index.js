import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { List } from 'immutable'

import * as NotificationsModelSelectors from 'models/domain/NotificationsModel/selectors'
import { selectProjectIsPrivate } from 'models/domain/ProjectsModel/selectors'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { getNotificationPathConfig } from 'models/domain/NotificationsModel/utils'
import { getUserName } from 'common/utils/user'
import {
  selectUserEmail,
  selectUserFirstName,
  selectUserLastName,
} from 'models/domain/UsersModel/selectors/domain'

import BaseComponent from 'BaseComponent'

const emptyList = new List()

function Enhance(ComposedComponent) {
  class EnhanceNotificationText extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      notificationId: PropTypes.string.isRequired,

      notificationType: PropTypes.number.isRequired,
      notificationData: ImmutablePropTypes.map,
      activityChanges: ImmutablePropTypes.list,
    }

    static defaultProps = {
      activityChanges: emptyList,
    }

    render() {
      return (
        <ComposedComponent
          notificationId={this.props.notificationId}
          notificationType={this.props.notificationType}
          activityChanges={this.props.activityChanges}

          actorId={this.props.actorId}
          userId={this.props.userId}
          userName={this.getUserName()}

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
          userValue={this.props.userValue}

          isProjectPrivate={this.props.isProjectPrivate}
          isContainerNameVisible={this.shouldRenderContainerName()}
          taskSource={this.props.taskSource}
          isTaskCreatedFromOwnMessage={this.isTaskCreatedFromOwnMessage()}
        />
      )
    }

    getUserName() {
      const {
        firstName, lastName, email, displayLastNameFirst,
      } = this.props
      return getUserName(firstName, lastName, email, displayLastNameFirst)
    }

    shouldRenderContainerName() {
      return this.props.projectId && this.props.containerType !== 'project'
    }

    isTaskCreatedFromOwnMessage() {
      return this.props.taskSourceMessageId && this.props.isTaskSourceMessageBelongsToCurrentUser
    }

  }

  const mapStateToProps = (state, props) => {
    const notificationData = NotificationsModelSelectors.selectNotificationData(state, { notificationId: props.notificationId })
    const notificationType = NotificationsModelSelectors.selectNotificationType(state, { notificationId: props.notificationId })
    const projectId = notificationData.get('projectId')
    const projectValue = notificationData.get('projectValue')
    const taskId = notificationData.get('taskId')
    const taskValue = notificationData.get('taskValue')
    const taskListId = notificationData.get('taskListId')
    const taskListValue = notificationData.get('taskListValue')
    const userId = notificationData.get('userId')
    const messageId = notificationData.get('messageId')
    const taskSourceMessageId = notificationData.get('taskSourceMessageId')
    const taskSourceMessageOwnerId = notificationData.get('taskSourceMessageOwnerId')
    const actorId = NotificationsModelSelectors.selectNotificationActorId(state, { notificationId: props.notificationId })
    const messageValue = notificationData.get('messageValue')
    const fileValue = notificationData.get('fileValue')
    const userValue = notificationData.get('userValue')

    const { targetId, targetValue, targetType, containerId, containerValue, containerType } =
      getNotificationPathConfig(notificationType, notificationData)
    return {
      notificationType,
      activityChanges: NotificationsModelSelectors.selectFilteredNotificationActivityChanges(state, { notificationId: props.notificationId }),
      actorId,
      userId,
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
      userValue,
      isTaskSourceMessageBelongsToCurrentUser: taskSourceMessageOwnerId === selectCurrentUserId(state),
      fileValue,
      isProjectPrivate: selectProjectIsPrivate(state, { projectId }),
      firstName: selectUserFirstName(state, { userId: actorId }),
      lastName: selectUserLastName(state, { userId: actorId }),
      email: selectUserEmail(state, { userId: actorId }),
    }
  }

  return connect(mapStateToProps)(EnhanceNotificationText)
}

export default Enhance
