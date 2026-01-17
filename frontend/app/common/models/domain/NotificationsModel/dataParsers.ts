import { Map, List } from 'immutable'
import {
  UnreadNotificationsTypes,
  UnreadNotificationsCreationTimestmap,
  NotificationsExternalData,
  UnreadNotification,
} from './types';
import { NotificationExternalData } from './models';
import { Id } from 'common/utils/identifier';

const emptyMap = Map()

export function parseUnreadNotifications(unreadNotifications: UnreadNotification[]) {
  let unreadNotificationsTypes = emptyMap as UnreadNotificationsTypes
  let unreadNotificationsChronology = emptyMap as Map<Id, Map<Id, List<Id>>>
  let unreadNotificationsCreationTimestamp = emptyMap as UnreadNotificationsCreationTimestmap
  let notificationsExternalData = emptyMap as NotificationsExternalData

  unreadNotifications.forEach(unreadNotification => {
    const { containerId, notificationType, createdAt, notificationId, organizationId, data } = unreadNotification
    unreadNotificationsTypes = unreadNotificationsTypes.set(notificationId, notificationType)
    unreadNotificationsCreationTimestamp = unreadNotificationsCreationTimestamp.set(notificationId, createdAt)
    unreadNotificationsChronology = unreadNotificationsChronology
      .updateIn([organizationId, containerId], (list) => (list ? list.push(notificationId) : List([notificationId])))
    notificationsExternalData = notificationsExternalData.set(notificationId, new NotificationExternalData(data))
  })

  return {
    unreadNotificationsTypes,
    unreadNotificationsChronology,
    unreadNotificationsCreationTimestamp,
    notificationsExternalData,
  }
}