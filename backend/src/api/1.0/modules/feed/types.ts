import { Id } from '../common/identifier';
import {
  DeviceType,
  NotificationDbRow,
  NotificationInAppDbRow,
} from '../db/schema';
import {
  NotificationData,
  NotificationType,
  PushNotificationContent,
} from '../notifications/types';
import { NotificationAction } from '../db/types';

export type UserOnlineStatusListener = (userId: Id) => void;
export type UserFeedStatusListener = (
  userId: Id,
  feedId: Id,
  onlineStatusChanged: boolean
) => void;
export type ClientMessageListener = (
  userId: Id,
  feedId: Id,
  ClientMessage: ClientMessage
) => void;
export type SocketIdType = string;

export enum UserFeedEvent {
  USER_OFFLINE = 'user-offline',
  USER_ONLINE = 'user-online',
  USER_FEED_OPENED = 'feed-opened',
  USER_FEED_CLOSED = 'feed-closed',
  CLIENT_MESSAGE = 'client-message',
}

export enum FeedMessageType {
  NOTIFICATION = 'notification',
  MESSAGE = 'message',
  ENTITY = 'entity',
  ONLINE_STATUS = 'onlineStatus',
  WELCOME = 'welcome',
  ENTITY_DIFF = 'entityDiff',
  PUSH_NOTIFICATION = 'pushNotification',
  PING = 'ping',
  CONTROL_COMMAND = 'controlCommand',
}

interface FeedMessageInterface {
  type: FeedMessageType;
  version?: string;
}

export enum ClientMessageType {
  SET_DEVICE_INFO = 'setDeviceInfo',
}

export interface ClientMessage {
  type: ClientMessageType;
  deviceType?: DeviceType;
}

export interface NewNotification extends FeedMessageInterface {
  type: FeedMessageType.NOTIFICATION;
  notificationId: Id;
  notification: NotificationDbRow | any;
  inApp: NotificationInAppDbRow | any;
  operation?: NotificationAction;
}

export interface PutEntityMessage extends FeedMessageInterface {
  type: FeedMessageType.ENTITY;
  entityType?: string;
  entityId: Id;
  optionalId?: Id;
  body?: any;
  operation?: NotificationAction;
}

export interface OnlineStatusMessge extends FeedMessageInterface {
  type: FeedMessageType.ONLINE_STATUS;
  userId: Id;
  isOnline: boolean;
  modifiedAt: Date;
}

export interface WelcomeMessage extends FeedMessageInterface {
  type: FeedMessageType.WELCOME;
  userId: Id;
}

export interface EntityDiffMessage extends FeedMessageInterface {
  type: FeedMessageType.ENTITY_DIFF;
  entityType?: string;
  entityId: Id;
  optionalId?: Id;
  body?: any;
  operation?: NotificationAction;
}

export interface PushNotificationMessage extends FeedMessageInterface {
  type: FeedMessageType.PUSH_NOTIFICATION;
  pushNotification: PushNotificationContent;
  notificationType: NotificationType;
  actorId: Id;
  organizationId?: Id;
  data?: Partial<NotificationData>;
}

export type FeedMessage =
  | NewNotification
  | PutEntityMessage
  | OnlineStatusMessge
  | WelcomeMessage
  | EntityDiffMessage
  | PushNotificationMessage;

export type BroadcastRecipients = Id[] | '*';

export interface Broadcast {
  message: FeedMessage;
  recipients: BroadcastRecipients;
}
