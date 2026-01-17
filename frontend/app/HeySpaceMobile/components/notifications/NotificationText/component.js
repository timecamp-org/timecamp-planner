import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { NotificationType } from 'common/models/domain/NotificationsModel/types'

import { List } from 'immutable'
import handleError from 'common/utils/handleError'

import CommentText from './CommentText'
import MentionText from './MentionText'
import ObjectCreatedText from './ObjectCreatedText'
import ObjectModifiedText from './ObjectModifiedText'
import ObjectMovedText from './ObjectMovedText'
import PersonAddedText from './PersonAddedText'
import PersonRemovedText from './PersonRemovedText'
import ObjectAttachmentAdded from './ObjectAttachmentAdded'
import ObjectArchivedChangedText from './ObjectArchivedChangedText'
import TaskCreatedFromMessageText from './TaskCreatedFromMessageText'
import ObjectProgressChangedText from './ObjectProgressChangedText'
import ObjectStatusChangedText from './ObjectStatusChangedText'
import ObjectPrivacyChangedText from './ObjectPrivacyChangedText'
import DueDateReminderText from './DueDateReminderText'
import InvitationJoinedText from './InvitationJoinedText'
import ChecklistItemAssigneeChanged from './ChecklistItemAssigneeChanged'
import { EntityStatus } from 'models/domain/EntityModel/types'

Component.propTypes = {
  notificationType: PropTypes.number.isRequired,
  isTaskCreatedFromOwnMessage: PropTypes.bool,
  activityChanges: ImmutablePropTypes.list,
}

Component.defaultProps = {
  isTaskCreatedFromOwnMessage: false,
  activityChanges: new List(),
}

function Component(props) {
  switch (props.notificationType) {
    case NotificationType.TASK_MESSAGE_SENT:
      return <CommentText {...props} />
    case NotificationType.USER_MENTIONED:
    case NotificationType.HAIL_MENTIONED:
      return <MentionText {...props} />
    case NotificationType.TASK_UPDATED:
    case NotificationType.TASK_LIST_UPDATED:
    case NotificationType.PROJECT_UPDATED: {
      const isProgressChanged = props.activityChanges.find(change => change.get('propertyName') === 'progress')
      const isOrderChanged = props.activityChanges.find(change => change.get('propertyName') === 'order')
      const isPrivacyChanged = props.activityChanges.find(change => change.get('propertyName') === 'isPrivate')

      if (isArchivedChanged()) {
        return <ObjectArchivedChangedText {...props} />
      } else if (isProgressChanged) {
        const newValue = isProgressChanged.get('new')
        if (newValue > 0 && newValue < 100) {
          return <ObjectProgressChangedText {...props} />
        } else {
          return <ObjectStatusChangedText {...props} />
        }
      } else if (isOrderChanged) {
        return <ObjectMovedText {...props} />
      } else if (isPrivacyChanged) {
        return <ObjectPrivacyChangedText {...props} />
      } else {
        return <ObjectModifiedText {...props} />
      }
    }
    case NotificationType.TASK_LIST_CREATED:
    case NotificationType.TASK_CREATED: {
      if (props.isTaskCreatedFromOwnMessage) {
        return <TaskCreatedFromMessageText {...props} />
      } else {
        return <ObjectCreatedText {...props} />
      }
    }
    case NotificationType.USER_ASSIGNED_TO_TASK:
    case NotificationType.USER_ADDED_TO_PROJECT:
      return <PersonAddedText {...props} />
    case NotificationType.USER_UNASSIGNED_FROM_TASK:
    case NotificationType.USER_REMOVED_FROM_PROJECT:
      return <PersonRemovedText {...props} />
    case NotificationType.FILE_ATTACHED_TO_TASK:
      return <ObjectAttachmentAdded {...props} />
    case NotificationType.DUE_DATE_REMINDER:
      return <DueDateReminderText {...props} />
    case NotificationType.INVITATION_JOINED:
      return <InvitationJoinedText {...props} />
    case NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM:
    case NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES:
      return <ChecklistItemAssigneeChanged 
        {...props} 
        wasAdded={props.notificationType === NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM} 
      />

    default:
      handleError(`Unimplemented notification type: ${props.notificationType}`)
      return <View style={props.style}>
        <Text>{'NOTIFICATION TEXT'}</Text>
      </View>
  }

  function isArchivedChanged() {
    return props.activityChanges.find(change => change.get('propertyName') === 'isArchived') ||
      props.activityChanges.find(change => change.get('propertyName') === 'status' && change.get('new') === EntityStatus.ARCHIVED)
  }
}

export default Component
