import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import generateSelectorName from '../../../../utils/generateSelectorName';
import {
  checkWasNotificationDisplayedBefore,
  excludedTaskChangeProperties,
  getProjectUnreadMessagesCount,
  getUserLatestNotificationCenterDisplays,
  hasAccessToNotification,
  isNotificationVisible,
} from '../utils';

import {
  selectAvailableVisibleSpacesIds,
  selectCurrentUserConversationsProjectIds,
  selectProjectsHaveUnreadMessagesInWorkspace,
} from '../../ProjectsModel/selectors';
import { selectCurrentUserAccessibleProjectIds } from '../../ProjectsModel/selectors/accessSelectors';
import {
  selectIsConversationVisibleDomain,
  selectProjectStatuses,
  selectProjectsHaveUnreadMessages,
  selectProjectsPeople,
} from '../../ProjectsModel/selectors/domain';
import { NotificationCenterType, NotificationType } from '../types';
import {
  selectChatNotificationSettingsTypeMap,
  selectNotificationsData,
  selectNotificationsExternalData,
  selectUnreadNotificationsChronologyDomain,
  selectUnreadNotificationsCreationTimestamp,
  selectUnreadNotificationsTypes,
  selectUserLatestNotificationCenterDisplaysDomain,
} from './domain';

import { selectSortedConversationDescriptors } from 'common/models/domain/ProjectsModel/selectors';
import { Id } from 'common/utils/identifier';
import createLinkFromNotification from '../../../../utils/notifications/createLinkFromNotification';
import { EntityStatus } from '../../EntityModel/types';
import { selectCurrentOrganizationId } from '../../OrganizationsModel/selectors/domain';
import { selectCurrentUserId } from '../../UsersModel/selectors/domain';
import { NotificationExternalData } from '../models';
import { ChatNotificationSettingsType } from '../types';

const emptyList = List();
const emptyMap = Map();

const taskChangedNotificationTypes = [NotificationType.TASK_UPDATED, NotificationType.TASK_LIST_UPDATED];

// args: notificationId
export const selectNotification = createCachedSelector(
  selectNotificationsData,
  (_, args) => args.notificationId,
  (notificationsData, notificationId) => notificationsData.get(notificationId)
)((_, args) => generateSelectorName(args, ['notificationId']));

// args: notificationId
export const selectNotificationData = createCachedSelector(
  selectNotificationsExternalData,
  (_, args) => args.notificationId,
  (notificationsExternalData, notificationId) =>
    notificationsExternalData.get(notificationId) || (emptyMap as NotificationExternalData)
)((_, args) => generateSelectorName(args, ['notificationId']));

// args: notificationId, property
export const selectNotificationDataProperty = createCachedSelector(
  selectNotificationData,
  (_, args) => args.property,
  (data, property) => data.get(property)
)((_, args) => generateSelectorName(args, ['notificationId', 'property']));

// args: notificationId
export const selectNotificationType = createCachedSelector(selectNotification, (notification) =>
  notification ? notification.type : null
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectLinkFromNotification = createCachedSelector(
  selectNotificationType,
  selectNotificationData,
  (notificationType, notificationData) => createLinkFromNotification({ notificationType, notificationData })
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectNotificationCreationTimestamp = createCachedSelector(selectNotification, (notification) =>
  notification ? notification.creationTimestamp : null
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectNotificationIsArchived = createCachedSelector(selectNotification, (notification) =>
  notification ? notification.isArchived : null
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectNotificationIsUnread = createCachedSelector(
  selectNotification,
  (notification) => notification && !notification.readAt
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectNotificationActorId = createCachedSelector(selectNotification, (notification) =>
  notification ? notification.actorId : null
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectNotificationContainerId = createCachedSelector(selectNotification, (notification) =>
  notification ? notification.containerId : null
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectNotificationActivityChanges = createCachedSelector(selectNotificationData, (notificationData) =>
  notificationData.get('changedProps')
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectUnreadNotifications = createSelector(selectNotificationsData, (notifications) =>
  notifications.filter((notification) => !notification.readAt)
);

// args: notificationTypes
export const selectUnreadNotificationsFilteredByNotificationTypes = createSelector(
  selectUnreadNotifications,
  (_, args) => args.notificationTypes,
  (unreadNotifications, notificationTypes: NotificationType[]) =>
    unreadNotifications.filter((notification) => notificationTypes.includes(notification.type))
);

export const selectHasCurrentUserUnreadNotifications = createSelector(
  selectUnreadNotifications,
  (unreadNotifications) => unreadNotifications.size > 0
);

export const selectFilteredNotificationActivityChanges = createCachedSelector(
  selectNotificationActivityChanges,
  selectNotificationType,
  (activityChanges, notificationType) => {
    if (activityChanges) {
      const isTaskChanged = taskChangedNotificationTypes.includes(notificationType);
      return isTaskChanged
        ? activityChanges.filter((change) => !excludedTaskChangeProperties.includes(change.get('property')))
        : activityChanges;
    } else {
      return undefined;
    }
  }
)((_, args) => generateSelectorName(args, ['notificationId']));

export const selectOrganizationNotifications = createSelector(
  selectNotificationsData,
  selectCurrentOrganizationId,
  (notificationsData, organizationId) =>
    notificationsData.filter(
      (notification) => notification.organizationId === organizationId || !notification.organizationId
    )
);

export const selectOrganizationNotificationIds = createSelector(selectOrganizationNotifications, (notifications) =>
  notifications
    .map((notification) => notification.id)
    .keySeq()
    .toList()
);

// args: notificationCenterType
export const selectFilteredNotifications = createSelector(
  selectOrganizationNotifications,
  selectNotificationsExternalData,
  selectCurrentUserAccessibleProjectIds,
  (_, args) => args.notificationCenterType,
  (notifications, externalData, accessibleProjectIds, notificationCenterType) =>
    notifications.filter((notification) => {
      const externalNotificationData = externalData.get(notification.id);
      let hasAccess = hasAccessToNotification(accessibleProjectIds, externalNotificationData);
      return isNotificationVisible(notification, externalNotificationData, notificationCenterType) && hasAccess;
    })
);

// args: notificationCenterType
export const selectNotificationIds = createSelector(selectFilteredNotifications, (notifications) => {
  const sortedNotifications = notifications
    .valueSeq()
    .toList()
    .sortBy((notification) => notification.creationTimestamp)
    .reverse();

  return sortedNotifications.map((notification) => notification.id) as List<Id>;
});

// args: notificationCenterType
export const selectAreThereUnarchivedNotifications = createSelector(selectFilteredNotifications, (notifications) =>
  notifications.some((notification) => !notification.isArchived)
);

export const selectUnreadNotificationsChronology = createSelector(
  selectUnreadNotificationsChronologyDomain,
  selectCurrentOrganizationId,
  (domain, currentOrganizationId) => domain.get(currentOrganizationId)
);

// args: organizationId
export const selectOrganizationUnreadNotificationsChronology = createSelector(
  selectUnreadNotificationsChronologyDomain,
  (_, args) => args.organizationId,
  (domain, organizationId) => domain.get(organizationId)
);

export const selectObjectChronology = createCachedSelector(
  selectUnreadNotificationsChronology,
  (_, args) => args.objectId,
  (chronology, objectId) => (chronology ? chronology.get(objectId) : undefined)
)((_, args) => generateSelectorName(args, ['objectId']));

// args: objectId
export const selectUnreadNotificationsCount = createCachedSelector(selectObjectChronology, (chronology) => {
  if (chronology) {
    return chronology.size;
  } else {
    return 0;
  }
})((_, args) => generateSelectorName(args, ['objectId']));

// args: objectId
export const selectAreThereUnreadObjectNotifications = createCachedSelector(
  selectUnreadNotificationsCount,
  (counter) => counter > 0
)((_, args) => generateSelectorName(args, ['objectId']));

// args: organizationId
export const selectUserWorkspaceLatestNotificationCenterDisplays = createCachedSelector(
  selectUserLatestNotificationCenterDisplaysDomain,
  (_, args) => args.organizationId,
  (userLatestNotificationCenterDisplays, organizationId) =>
    getUserLatestNotificationCenterDisplays(userLatestNotificationCenterDisplays, organizationId)
)((_, args) => generateSelectorName(args, ['organizationId']));

export const selectUserCurrentWorkspaceLatestNotificationCenterDisplays = createSelector(
  selectUserLatestNotificationCenterDisplaysDomain,
  selectCurrentOrganizationId,
  (userLatestNotificationCenterDisplays, organizationId) =>
    getUserLatestNotificationCenterDisplays(userLatestNotificationCenterDisplays, organizationId)
);

export const selectAllUnreadNotificationsSinceLastDisplayCount = createSelector(
  selectNotificationsData,
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  selectUnreadNotificationsCreationTimestamp,
  selectUserCurrentWorkspaceLatestNotificationCenterDisplays,
  selectCurrentUserAccessibleProjectIds,
  selectNotificationsExternalData,
  (_, args) => args.includedNotificationTypes,
  (
    notificationData,
    chronology,
    unreadNotificationTypes,
    unreadNotificationsCreationTimestamp,
    userLatestNotificationsCenterDisplayTimestamps,
    accessibleProjectIds,
    notificationsExternalData,
    includedNotificationTypes
  ) => {
    let count = 0;
    if (chronology) {
      chronology.forEach((objectUnreadNotifications) => {
        objectUnreadNotifications.forEach((notificationId) => {
          const isArchived = notificationData.get(notificationId)?.isArchived;
          const notificationType = unreadNotificationTypes.get(notificationId);
          const creationTimestamp = unreadNotificationsCreationTimestamp.get(notificationId);
          const isProperNotificationType = includedNotificationTypes
            ? includedNotificationTypes.includes(notificationType)
            : ![NotificationType.CONVERSATION_MESSAGE_SENT].includes(notificationType);

          if (!isProperNotificationType) {
            return;
          }

          const externalData = notificationsExternalData.get(notificationId);
          if (!hasAccessToNotification(accessibleProjectIds, externalData)) {
            return;
          }
          const wasNotificationDisplayedBefore = checkWasNotificationDisplayedBefore(
            userLatestNotificationsCenterDisplayTimestamps as Map<NotificationCenterType, number>,
            notificationType,
            creationTimestamp
          );
          if (!wasNotificationDisplayedBefore && !isArchived) {
            count++;
          }
        });
      });
    }
    return count;
  }
);

// args: organizationId
export const selectWorkspaceUnreadNotificationsAndMessages = createCachedSelector(
  selectOrganizationUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  selectUnreadNotificationsCreationTimestamp,
  selectUserWorkspaceLatestNotificationCenterDisplays,
  selectProjectsHaveUnreadMessagesInWorkspace,
  selectChatNotificationSettingsTypeMap,
  selectProjectStatuses,
  selectIsConversationVisibleDomain,
  (
    chronology,
    unreadNotificationTypes,
    unreadNotificationsCreationTimestamp,
    userLatestNotificationsCenterDisplayTimestamps,
    projectsHasUnreadMessages,
    chatNotificationSettingsTypeMap,
    projectsStatuses,
    isConversationVisibleDomain
  ) => {
    let count = 0;
    if (chronology) {
      chronology.forEach((objectUnreadNotifications) => {
        objectUnreadNotifications.forEach((notificationId) => {
          const notificationType = unreadNotificationTypes.get(notificationId);
          const creationTimestamp = unreadNotificationsCreationTimestamp.get(notificationId);
          const isConversationNotification = notificationType === NotificationType.CONVERSATION_MESSAGE_SENT;
          const wasNotificationDisplayed = checkWasNotificationDisplayedBefore(
            userLatestNotificationsCenterDisplayTimestamps as Map<NotificationCenterType, number>,
            notificationType,
            creationTimestamp
          );
          if (isConversationNotification && !wasNotificationDisplayed) {
            count++;
          }
        });
      });
    }
    projectsHasUnreadMessages.forEach((hasUnreadMessages, projectId) => {
      const isMuted = chatNotificationSettingsTypeMap.get(projectId) === ChatNotificationSettingsType.NOTHING;
      const isExists = projectsStatuses.get(projectId) === EntityStatus.EXISTS;
      const isVisible = isConversationVisibleDomain.get(projectId);
      if (hasUnreadMessages && !isMuted && isExists && isVisible) {
        count++;
      }
    });

    return count;
  }
)((_, args) => generateSelectorName(args, ['organizationId']));

export const selectChatUnreadNotificationsCounter = createSelector(
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  selectNotificationsExternalData,
  selectProjectsPeople,
  selectIsConversationVisibleDomain,
  selectCurrentUserId,
  (
    unreadNotificationsChronology,
    unreadNotificationTypes,
    notificationsExternalData,
    projectsPeople,
    isConversationVisibleDomain,
    currentUserId
  ) => {
    let result = 0;
    if (unreadNotificationsChronology) {
      unreadNotificationsChronology.forEach((notifications) => {
        const projectUnreadNotifications = notifications.filter((notificationId) => {
          const externalData = notificationsExternalData.get(notificationId) || emptyMap;
          const isConversationMessage =
            unreadNotificationTypes.get(notificationId) === NotificationType.CONVERSATION_MESSAGE_SENT;
          const isMention = [NotificationType.HAIL_MENTIONED, NotificationType.USER_MENTIONED].includes(
            unreadNotificationTypes.get(notificationId)
          );
          const isFromProject = !externalData.get('taskId');
          const projectId = externalData.get('projectId') as Id;
          const projectPeople = projectsPeople.get(projectId) || emptyList;
          const isUserInProject = projectPeople.includes(currentUserId);
          const isConversationVisible = isConversationVisibleDomain.get(projectId) !== false;
          return isUserInProject && ((isConversationMessage && isConversationVisible) || (isMention && isFromProject));
        });

        result += projectUnreadNotifications.size;
      });
    }

    return result;
  }
);

export const selectAllVisibleSpacesAndConversationsUnreadMessagesCount = createSelector(
  selectAvailableVisibleSpacesIds,
  selectCurrentUserConversationsProjectIds,
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  (spaceIds, conversationIds, unreadNotificationsChronology, unreadNotificationTypes) => {
    if (unreadNotificationsChronology) {
      let unreadMessagesCount = 0;
      unreadMessagesCount += spaceIds.reduce(
        (acc, spaceId) =>
          acc + getProjectUnreadMessagesCount(spaceId, unreadNotificationsChronology, unreadNotificationTypes),
        0
      );
      unreadMessagesCount += conversationIds.reduce(
        (acc, conversationId) =>
          acc + getProjectUnreadMessagesCount(conversationId, unreadNotificationsChronology, unreadNotificationTypes),
        0
      );

      return unreadMessagesCount;
    } else {
      return 0;
    }
  }
);

export const selectAllVisibleSpacesUnreadMessagesCount = createSelector(
  selectAvailableVisibleSpacesIds,
  selectCurrentUserConversationsProjectIds,
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  (spaceIds, conversationIds, unreadNotificationsChronology, unreadNotificationTypes) => {
    if (unreadNotificationsChronology) {
      let unreadMessagesCount = 0;
      unreadMessagesCount += spaceIds.reduce(
        (acc, spaceId) =>
          acc + getProjectUnreadMessagesCount(spaceId, unreadNotificationsChronology, unreadNotificationTypes),
        0
      );

      return unreadMessagesCount;
    } else {
      return 0;
    }
  }
);

export const selectProjectUnreadMessagesCount = createCachedSelector(
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  (_, args) => args.projectId,
  (unreadNotificationsChronology, unreadNotificationTypes, projectId) => {
    if (unreadNotificationsChronology) {
      return getProjectUnreadMessagesCount(projectId, unreadNotificationsChronology, unreadNotificationTypes);
    } else {
      return 0;
    }
  }
)((_, args) => generateSelectorName(args, ['projectId']));

export const selectConversationsUnreadMessagesCount = createSelector(
  selectCurrentUserConversationsProjectIds,
  selectUnreadNotificationsChronology,
  selectUnreadNotificationsTypes,
  (conversationsIds, unreadNotificationsChronology, unreadNotificationTypes) => {
    if (unreadNotificationsChronology) {
      let projectsNotificationsSize = emptyMap;
      conversationsIds.forEach((conversationIds) => {
        let projectUnreadNotifications = unreadNotificationsChronology.get(conversationIds) || (emptyList as List<Id>);
        projectUnreadNotifications = projectUnreadNotifications.filter((notificationId) =>
          [
            NotificationType.CONVERSATION_MESSAGE_SENT,
            NotificationType.HAIL_MENTIONED,
            NotificationType.USER_MENTIONED,
          ].includes(unreadNotificationTypes.get(notificationId))
        ) as List<Id>;
        projectsNotificationsSize = projectsNotificationsSize.set(conversationIds, projectUnreadNotifications.size);
      });
      return projectsNotificationsSize;
    } else {
      return emptyMap;
    }
  }
);

export const selectTotalConversationsMessagesCount = createSelector(
  selectConversationsUnreadMessagesCount,
  (state) => selectSortedConversationDescriptors(state, { shouldIncludeInvisibleConversations: false }),
  (notificationCountByProjectId, userConversations) =>
    userConversations.reduce((acc, conversation) => {
      const projectNotificationCount = (notificationCountByProjectId.get(conversation.projectId) || 0) as number;

      return acc + projectNotificationCount;
    }, 0)
);

// args: objectId
export const selectChatNotificationSettingsType = createCachedSelector(
  selectChatNotificationSettingsTypeMap,
  (_, args) => args.objectId,
  (chatNotificationSettingsTypeMap, objectId) =>
    chatNotificationSettingsTypeMap.get(objectId) || ChatNotificationSettingsType.ONLY_MENTIONS
)((_, args) => generateSelectorName(args, ['objectId']));

// args: objectId
export const selectIsChatMuted = createCachedSelector(
  selectChatNotificationSettingsType,
  (chatNotificationSettingsType) => chatNotificationSettingsType === ChatNotificationSettingsType.NOTHING
)((_, args) => generateSelectorName(args, ['objectId']));

export const selectSpacesHaveUnreadMessages = createSelector(
  selectProjectsHaveUnreadMessages,
  selectAvailableVisibleSpacesIds,
  selectChatNotificationSettingsTypeMap,
  (projectsHaveUnreadMessages, visibleSpacesIds, chatNotificationSettingsTypeMap) => {
    let result = false;
    visibleSpacesIds.forEach((spaceId) => {
      const isSpaceMuted = chatNotificationSettingsTypeMap.get(spaceId) === ChatNotificationSettingsType.NOTHING;
      if (projectsHaveUnreadMessages.get(spaceId) && !isSpaceMuted) {
        result = true;
      }
    });

    return result;
  }
);
