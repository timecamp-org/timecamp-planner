import { Id } from '../common/utils/identifier'
import { AnyDict, Dict } from '../common/types'
import { DeviceType, NotificationExternalDataInterface } from '../common/models/domain/NotificationsModel/types'

export interface PushNotificationsConfigInterface {
  baseUrl: string,
  topicPrefix?: string,
}

export interface PushNotificationClientOptions extends PushNotificationsConfigInterface {
  canShowForegroundNotification: CanShowForegroundNotificationListener,
  onNotificationOpened: NotificationOpenedListener,
  onTokenRefresh: TokenRefreshListener,
  icon?: string,
}

export type CanShowForegroundNotificationListener = (notificationData: PushNotification) => boolean
export type NotificationOpenedListener = (notificationData: PushNotification) => boolean
export type TokenRefreshListener = (refreshedToken: string | null) => void
export type MessageListener = (message: PushNotificationMessage) => void

export interface PushNotificationMessage extends Dict<string> {
  actorId?: Id,
  body?: string,
  containerId?: Id,
  data?: NotificationExternalDataInterface | string | null,
  notificationId?: Id,
  notificationType?: string,
  organizationId?: Id,
  title?: string,
  topic?: string,
}

export interface PushNotification {
  actorId: Id,
  body: string,
  containerId: Id,
  data: NotificationExternalDataInterface | null,
  notificationType: string,
  title: string,
  topic: string,
  notificationId?: string,
}

export interface NativeNotification {
  id: string,
  title: string,
  body: string,
  data: AnyDict,
}

export interface DeviceInfo {
  deviceId: string,
  deviceType: DeviceType,
}
