import RouteName from "../components/AppNavigation/routeNames"
import { NotificationType, RouteCreatedFromNotification } from "../../common/models/domain/NotificationsModel/types";
import { NotificationLinkData } from "../../common/utils/notifications/types";
import { NotificationExternalData } from "../../common/models/domain/NotificationsModel/models";
import { ProjectType } from "../../common/models/domain/ProjectsModel/types";
import { Maybe } from "../../common/types";

export default function createRouteFromNotification({
  notificationType,
  notificationData,
}: NotificationLinkData): Maybe<RouteCreatedFromNotification> {
  const taskId = notificationData.taskId
  const projectId = notificationData.projectId

  switch (notificationType) {
    case NotificationType.HAIL_MENTIONED:
    case NotificationType.USER_MENTIONED:
    case NotificationType.CONVERSATION_MESSAGE_SENT:
    case NotificationType.TASK_MESSAGE_SENT: {
      return makeMessageRelatedRoute(notificationData)
    }
    case NotificationType.TASK_UPDATED:
    case NotificationType.USER_ASSIGNED_TO_TASK:
    case NotificationType.USER_UNASSIGNED_FROM_TASK:
    case NotificationType.FILE_ATTACHED_TO_TASK:
    case NotificationType.DUE_DATE_REMINDER:
    case NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM:
    case NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES:
    case NotificationType.TASK_CREATED: {
      return {
        routeName: RouteName.CARD_DETAILS,
        taskId,
        projectId,
      }
    }
    case NotificationType.PROJECT_UPDATED:
    case NotificationType.USER_ADDED_TO_PROJECT:
    case NotificationType.USER_REMOVED_FROM_PROJECT:
    case NotificationType.TASK_LIST_CREATED:
    case NotificationType.TASK_LIST_UPDATED:
      {
        return {
          routeName: RouteName.PROJECT,
          projectId,
        }
      }
    default:
      return null
  }
}

function makeMessageRelatedRoute(notificationData: NotificationExternalData) {
  const { taskId, projectId, conversationId, projectType } = notificationData
  if (taskId) {
    return {
      routeName: RouteName.CARD_DETAILS,
      taskId,
      projectId,
      openCardComments: true,
    }
  }

  switch (projectType) {
    case ProjectType.PROJECT: {
      return {
        routeName: RouteName.PROJECT,
        projectId,
      }
    }
    case ProjectType.DIRECT_CHAT:
    case ProjectType.GROUP_CHAT: {
      return {
        routeName: RouteName.CONVERSATION,
        conversationId,
      }
    }
    default: {
      return null
    }
  }
}
