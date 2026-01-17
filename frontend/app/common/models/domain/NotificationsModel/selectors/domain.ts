import { createSelector } from 'reselect'
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'
import { domain as NotificationsDomain } from '../constants'
import {
  NotificationsData,
  UnreadNotificationsTypes,
  UnreadNotificationsChronology,
  UnreadNotificationsCreationTimestmap,
  NotificationsExternalData,
  ObjectIdChatNotificationSettingsType,
  NotificationMethod,
  NotificationCenterType
} from '../types'
import { Id } from 'common/utils/identifier'
import { Map } from 'immutable'

export const notificationsDomain = (state) => state.get(NotificationsDomain)

export const selectNotificationsData = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('notificationsData') as NotificationsData,
)

export const selectUnreadNotificationsTypes = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('unreadNotificationsTypes') as UnreadNotificationsTypes,
)

export const selectUnreadNotificationsChronologyDomain = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('unreadNotificationsChronology') as UnreadNotificationsChronology,
)

export const selectUnreadNotificationsCreationTimestamp = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('unreadNotificationsCreationTimestamp') as UnreadNotificationsCreationTimestmap,
)

export const selectNotificationsExternalData = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('notificationsExternalData') as NotificationsExternalData,
)

export const selectEnablePushNotifications = createSelector(
  notificationsDomain,
  (domain) => domain.getIn(['notificationsSettings', NotificationMethod.PUSH]) as boolean,
)

export const selectEnableEmailNotifications = createSelector(
  notificationsDomain,
  (domain) => domain.getIn(['notificationsSettings', NotificationMethod.EMAIL]) as boolean,
)

export const selectEnableMobileNotifications = createSelector(
  notificationsDomain,
  (domain) => domain.getIn(['notificationsSettings', NotificationMethod.MOBILE]) as boolean,
)

export const selectEnableSoundNotifications = createSelector(
  notificationsDomain,
  (domain) => domain.getIn(['notificationsSettings', NotificationMethod.SOUND]) as boolean,
)

export const selectChatNotificationSettingsTypeMap = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('objectIdChatNotificationSettingsType') as ObjectIdChatNotificationSettingsType,
)

export const selectUserLatestNotificationCenterDisplaysDomain = createImmutableEqualSelector(
  notificationsDomain,
  domain => domain.get('userLatestNotificationCenterDisplays') as Map<Id, Map<NotificationCenterType, number>>,
)
