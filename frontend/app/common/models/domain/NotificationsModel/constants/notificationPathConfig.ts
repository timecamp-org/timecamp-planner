import { NotificationType, NotificationPathConfigInputInterface } from '../types'
import { EntityType } from '../../EntityModel/types';

export default {
  [NotificationType.TASK_CREATED]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.TASK_DATA },
  [NotificationType.TASK_UPDATED]: { containerType: EntityType.TASK_LIST, targetType: EntityType.TASK_DATA },

  [NotificationType.USER_ADDED_TO_PROJECT]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.USER_DATA },
  [NotificationType.USER_REMOVED_FROM_PROJECT]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.USER_DATA },

  [NotificationType.PROJECT_UPDATED]: { containerType: null, targetType: EntityType.PROJECT_DATA },

  [NotificationType.USER_ASSIGNED_TO_TASK]: { containerType: EntityType.TASK_DATA, targetType: EntityType.USER_DATA },
  [NotificationType.USER_UNASSIGNED_FROM_TASK]: { containerType: EntityType.TASK_DATA, targetType: EntityType.USER_DATA },

  [NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM]: { containerType: EntityType.CHECKLIST_ITEM, targetType: EntityType.USER_DATA },
  [NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES]: { containerType: EntityType.CHECKLIST_ITEM, targetType: EntityType.USER_DATA },


  [NotificationType.TASK_LIST_CREATED]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.TASK_LIST },
  [NotificationType.TASK_LIST_UPDATED]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.TASK_LIST },

  [NotificationType.TASK_MESSAGE_SENT]: { containerType: EntityType.TASK_DATA, targetType: EntityType.MESSAGE_DATA },

  [NotificationType.FILE_ATTACHED_TO_TASK]: { containerType: EntityType.TASK_DATA, targetType: EntityType.FILE_DATA },

  [NotificationType.CONVERSATION_MESSAGE_SENT]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.MESSAGE_DATA },

  [NotificationType.USER_MENTIONED]: { containerType: [EntityType.TASK_DATA, EntityType.PROJECT_DATA], targetType: EntityType.MESSAGE_DATA },
  [NotificationType.HAIL_MENTIONED]: { containerType: [EntityType.TASK_DATA, EntityType.PROJECT_DATA], targetType: EntityType.MESSAGE_DATA },

  [NotificationType.DUE_DATE_REMINDER]: { containerType: EntityType.PROJECT_DATA, targetType: EntityType.TASK_DATA },
} as Record<NotificationType, NotificationPathConfigInputInterface>
