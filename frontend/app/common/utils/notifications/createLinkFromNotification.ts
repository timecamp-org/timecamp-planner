import * as RouterHelpers from '../routerHelpers'
import { NotificationType } from '../../models/domain/NotificationsModel/types'
import { NotificationLinkData } from './types'
import { ProjectType } from '../../models/domain/ProjectsModel/types';
import { ProjectPanelType, RightPanelType } from '../../models/domain/ProjectsSettingsModel/types';

export default function createLinkFromNotification({
  notificationType,
  notificationData,
}: NotificationLinkData) {
  const taskId = notificationData.taskId
  const projectId = notificationData.projectId

  switch (notificationType) {
    case NotificationType.HAIL_MENTIONED:
    case NotificationType.USER_MENTIONED:
    case NotificationType.CONVERSATION_MESSAGE_SENT:
    case NotificationType.TASK_MESSAGE_SENT: {
      return makeMessageRelatedLink()
    }
    case NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM:
    case NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES:
    case NotificationType.TASK_UPDATED:
    case NotificationType.USER_ASSIGNED_TO_TASK:
    case NotificationType.USER_UNASSIGNED_FROM_TASK:
    case NotificationType.FILE_ATTACHED_TO_TASK:
    case NotificationType.DUE_DATE_REMINDER:
    case NotificationType.TASK_CREATED: {
      return RouterHelpers.makeTaskLink({
        taskId,
        projectId,
      })
    }
    case NotificationType.PROJECT_UPDATED:
    case NotificationType.USER_ADDED_TO_PROJECT:
    case NotificationType.USER_REMOVED_FROM_PROJECT:
    case NotificationType.TASK_LIST_CREATED:
    case NotificationType.TASK_LIST_UPDATED: {
      return RouterHelpers.makeProjectSettingsLink({
        projectId,
      })
    }
    default:
      return null
  }

  function makeMessageRelatedLink() {
    if (taskId) {
      return RouterHelpers.makeTaskLink({
        taskId,
        projectId,
      })
    } else {
      switch (notificationData.projectType) {
        case ProjectType.GROUP_CHAT: {
          const conversationId = notificationData.conversationId
          return RouterHelpers.makeConversationLink(conversationId, ProjectPanelType.CHAT, RightPanelType.MEMBERS)
        }
        case ProjectType.DIRECT_CHAT: {
          const conversationId = notificationData.conversationId
          return RouterHelpers.makeConversationLink(conversationId, ProjectPanelType.CHAT, RightPanelType.TASKS)
        }
        default: 
          return RouterHelpers.makeProjectChatLink({ projectId })
      }
    }
  }
}
