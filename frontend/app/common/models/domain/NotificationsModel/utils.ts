import { List, Map } from 'immutable';
import {
  actionNotificationTypes,
  chatNotificationTypes,
  NotificationCenterType,
  NotificationExternalDataInterface,
  NotificationInterface,
  NotificationPathConfigInputInterface,
  NotificationPathConfigOutputInterface,
  NotificationType,
  projectCounterNotificationTypes,
  allNotificationTypes,
} from './types';
import { i18n } from '../../../i18n';
import { AnyMap, Maybe } from '../../../types';
import notificationPathConfig from './constants/notificationPathConfig';
import { EntityType } from '../EntityModel/types';
import { Id } from '../../../utils/identifier';
import isMobileApp from 'common/utils/isMobileApp';

const emptyMap = Map<string, any>();
const emptyList = List<Id>();

export const visibleNotificationTypes = [
  NotificationType.TASK_CREATED,
  NotificationType.TASK_UPDATED,
  NotificationType.USER_ADDED_TO_PROJECT,
  NotificationType.USER_REMOVED_FROM_PROJECT,
  NotificationType.PROJECT_UPDATED,
  NotificationType.USER_ASSIGNED_TO_TASK,
  NotificationType.USER_UNASSIGNED_FROM_TASK,
  NotificationType.TASK_LIST_CREATED,
  NotificationType.TASK_LIST_UPDATED,
  NotificationType.TASK_MESSAGE_SENT,
  NotificationType.FILE_ATTACHED_TO_TASK,
  NotificationType.CONVERSATION_MESSAGE_SENT,
  NotificationType.USER_MENTIONED,
  NotificationType.HAIL_MENTIONED,
  NotificationType.DUE_DATE_REMINDER,
  NotificationType.INVITATION_JOINED,
  NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM,
  NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES,
];

export const excludedTaskChangeProperties = ['description', 'source'];
export const excludedProjectChangeProperties = ['description', 'name', 'color'];

export const getNotificationTypesByNotificationCenterType = (
  notificationCenterType: NotificationCenterType
): NotificationType[] => {
  switch (notificationCenterType) {
    case NotificationCenterType.CHAT: {
      return chatNotificationTypes;
    }
    case NotificationCenterType.ACTION_BASED: {
      return actionNotificationTypes;
    }

    case NotificationCenterType.ALL: {
      return allNotificationTypes;
    }

    default:
      return [];
  }
};

const aliases = {
  task: i18n.t('notification|task'),
  project: i18n.t('notification|project'),
  taskList: i18n.t('notification|list'),
};

export function getAlias(objectType) {
  const alias = aliases[objectType];
  return i18n.t(`notification|${alias}`);
}

export function isNotificationVisible(
  notification: NotificationInterface,
  externalNotificationData: AnyMap = emptyMap,
  notificationCenterType: NotificationCenterType
): boolean {
  const isMessageFromSpace = notification.type === NotificationType.CONVERSATION_MESSAGE_SENT;

  const changeProperty = externalNotificationData.getIn(['changedProps', 0, 'propertyName']);

  const hasTaskExcludedChange =
    notification.type === NotificationType.TASK_UPDATED && excludedTaskChangeProperties.includes(changeProperty);
  const hasProjectExcludedChange =
    notification.type === NotificationType.PROJECT_UPDATED && excludedProjectChangeProperties.includes(changeProperty);

  const visibleNotifications = notificationCenterType
    ? getNotificationTypesByNotificationCenterType(notificationCenterType)
    : visibleNotificationTypes;

  const isInVisibleNotificationTypes = visibleNotifications.includes(notification.type);

  return (
    !isMessageFromSpace &&
    !hasTaskExcludedChange &&
    !hasProjectExcludedChange &&
    isInVisibleNotificationTypes &&
    !notification.isArchived
  );
}

export function getNotificationPathConfig(
  notificationType: NotificationType,
  notificationData: AnyMap
): NotificationPathConfigOutputInterface {
  const config: NotificationPathConfigInputInterface = notificationPathConfig[notificationType];
  let containerType = null;
  let targetId = null;
  let targetValue = null;
  let targetType = null;

  if (config) {
    if (Array.isArray(config.containerType)) {
      config.containerType.forEach((type) => {
        if (notificationData.get(`${type}Id`)) {
          containerType = type;
        }
      });
    } else {
      containerType = config.containerType;
    }

    targetId = notificationData.get(`${config.targetType}Id`);
    targetValue = notificationData.get(`${config.targetType}Value`);
    targetType = config.targetType;
  }

  const containerId = notificationData.get(`${containerType}Id`);
  const containerValue = notificationData.get(`${containerType}Value`);

  return {
    targetId,
    targetValue,
    targetType,
    containerId,
    containerValue,
    containerType,
  };
}

export function getNotificationEntityTypes(
  notificationExternalData: NotificationExternalDataInterface
): Map<Id, EntityType> {
  let entityTypes = emptyMap as Map<Id, EntityType>;
  if (notificationExternalData.taskId) {
    entityTypes = entityTypes.set(notificationExternalData.taskId, EntityType.TASK_DATA);
  }
  if (notificationExternalData.taskListId) {
    entityTypes = entityTypes.set(notificationExternalData.taskListId, EntityType.TASK_LIST);
  }
  if (notificationExternalData.projectId) {
    entityTypes = entityTypes.set(notificationExternalData.projectId, EntityType.PROJECT_DATA);
  }
  return entityTypes;
}

export function hasAccessToNotification(
  accessibleProjectIds: List<Id>,
  externalData: NotificationExternalDataInterface
): boolean {
  let hasAccess = true;
  const projectId = externalData ? externalData.projectId : null;
  if (!externalData || (projectId && !accessibleProjectIds.includes(projectId))) {
    hasAccess = false;
  }
  return hasAccess;
}

export const getProjectUnreadMessagesCount = (
  projectId: Id,
  unreadNotificationsChronology: Map<Id, List<Id>>,
  unreadNotificationTypes: Map<Id, NotificationType>
): number => {
  let projectUnreadNotifications = unreadNotificationsChronology.get(projectId) || emptyList;
  projectUnreadNotifications = projectUnreadNotifications.filter((notificationId) =>
    projectCounterNotificationTypes.includes(unreadNotificationTypes.get(notificationId))
  ) as List<Id>;

  return projectUnreadNotifications.size;
};
export function getInitialUserLatestNotificationCenterDisplays(value: Maybe<number> = null): {
  [key in keyof typeof NotificationCenterType]?: Maybe<number>;
} {
  const userLatestNotificationCenterDisplays = {};
  Object.values(NotificationCenterType).forEach((notificationCenterType) => {
    userLatestNotificationCenterDisplays[notificationCenterType] = value;
  });

  return userLatestNotificationCenterDisplays;
}

export function checkWasNotificationDisplayedBefore(
  userLatestNotificationsDisplayTimestamps: Map<NotificationCenterType, Maybe<number>>,
  notificationType: NotificationType,
  notificationCreationTimestamp: number
): boolean {
  const notificationCenterType = getNotificationCenterTypeByNotificationType(notificationType);
  const latestNotificationCenterDisplayTimestamp = getLatestNotificationCenterDisplayTimestamp(
    notificationCenterType,
    userLatestNotificationsDisplayTimestamps
  );
  return (
    !!latestNotificationCenterDisplayTimestamp &&
    latestNotificationCenterDisplayTimestamp >= notificationCreationTimestamp
  );
}

export function getLatestNotificationCenterDisplayTimestamp(
  notificationCenterType: Maybe<NotificationCenterType>,
  userLatestNotificationsDisplayTimestamps: Map<NotificationCenterType, Maybe<number>>
): number {
  if (notificationCenterType) {
    return userLatestNotificationsDisplayTimestamps.get(notificationCenterType);
  } else {
    return userLatestNotificationsDisplayTimestamps.valueSeq().sort().first();
  }
}

export function getNotificationCenterTypeByNotificationType(
  notificationType: NotificationType
): Maybe<NotificationCenterType> {
  if (isMobileApp()) {
    return NotificationCenterType.ALL;
  }
  if (actionNotificationTypes.includes(notificationType)) {
    return NotificationCenterType.ACTION_BASED;
  } else if (chatNotificationTypes.includes(notificationType)) {
    return NotificationCenterType.CHAT;
  } else {
    return null;
  }
}

export function getUserLatestNotificationCenterDisplays(
  userLatestNotificationCenterDisplays: Map<Id, Map<NotificationCenterType, number>>,
  organizationId: Id
): Map<NotificationCenterType, number> {
  return (
    userLatestNotificationCenterDisplays.get(organizationId) ||
    (Map(getInitialUserLatestNotificationCenterDisplays()) as Map<NotificationCenterType, number>)
  );
}
