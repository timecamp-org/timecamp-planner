import { Id } from '../common/identifier';
import {
  NotificationDbRow,
  PushNotificationDbRow,
  NotificationInAppDbRow,
  DeviceType,
  ContainerType,
} from '../db/schema';
import { EntityType } from '../common/enum';
import { JobInterface } from '../messageQueue/types';
import { ResourceQueryParams } from '../../../../infrastructure/resources/types';

export enum NotificationType {
  TASK_CREATED = 0,
  TASK_UPDATED = 1,

  USER_ADDED_TO_PROJECT = 2,
  USER_REMOVED_FROM_PROJECT = 3,

  PROJECT_UPDATED = 4,

  USER_ASSIGNED_TO_TASK = 5,
  USER_UNASSIGNED_FROM_TASK = 6,

  TASK_LIST_CREATED = 7,
  TASK_LIST_UPDATED = 8,

  TASK_MESSAGE_SENT = 9,

  FILE_ATTACHED_TO_TASK = 10,

  CONVERSATION_MESSAGE_SENT = 11,

  USER_MENTIONED = 12,
  HAIL_MENTIONED = 13,

  DUE_DATE_REMINDER = 14,
  GLOBAL = 15,
  INVITATION_JOINED = 16,

  USER_ASSIGNED_TO_CHECKLIST_ITEM = 17,
  USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES = 18,
}

export enum ReadNotificationResultStatus {
  OK,
  RESOURCE_NOT_EXIST,
}

export enum PushNotificationDeviceResultStatus {
  OK,
}

export interface ReadNotificationsResult {
  status: ReadNotificationResultStatus;
}

export interface PushNotificationDeviceResult {
  status: PushNotificationDeviceResultStatus;
}

export interface GetNotifcationInAppResult {
  inAppNotification: NotificationInAppDbRow;
  notification: NotificationDbRow;
}

export interface GetPushNotifcationResult {
  pushNotification: PushNotificationDbRow;
  notification: NotificationDbRow;
}

export interface NotificationData {
  projectId: Id;
  projectValue: string;
  taskListId: Id;
  taskListValue: string;
  taskId: Id;
  taskValue: string;
  messageId: Id;
  messageValue: string;
  userId: Id;
  userValue: string;
}

export interface PaginatedUserNotifications {
  page?: string;
  data: NotificationDbRow[];
}

export const EXCLUDED_NOTIFICATION_TYPES = [NotificationType.CONVERSATION_MESSAGE_SENT];

export enum NotificationMethod {
  EMAIL = 'emailNotifications',
  PUSH = 'pushNotifications',
  MOBILE = 'mobileNotifications',
  SOUND = 'soundNotifications',
}

export const DEFAULT_DELIVERY_SETTINGS: NotificationsDeliverySettingsJsonInterface = {
  [NotificationMethod.EMAIL]: false,
  [NotificationMethod.PUSH]: true,
  [NotificationMethod.MOBILE]: true,
  [NotificationMethod.SOUND]: true,
};

export type NotificationsDeliverySettingsJsonInterface = {
  [type in NotificationMethod]: boolean;
};

export enum NotificationsDeliverySettingsResultStatus {
  OK,
}

export enum ChatNotificationSettingsResultStatus {
  OK,
  PROJECT_NOT_FOUND,
  USER_NOT_FOUND,
}

export interface NotificationsDeliverySettingsResult {
  status: NotificationsDeliverySettingsResultStatus;
}

export interface ChatNotificationSettingsResult {
  status: ChatNotificationSettingsResultStatus;
}

export interface NotificationContent {
  content: string;
}

export interface PushNotificationContent extends NotificationContent {
  title: string;
  iconUri?: string;

  // Those props should be pushed as custom data (in case of OneSignal it's .data property)
  // so that the client is able to generate a proper redirection on click.
  objectType?: EntityType;
  objectId?: Id;
  containerType?: ContainerType;
  containerId?: Id;
}

export type RecipientDevicesMap = Record<DeviceType, Id[]>;

export type SendMessageResult = {
  deviceId?: Id;
  error?: string;
};

export const UnregisteredDeviceErrors = ['NotRegistered', 'InvalidRegistration'];

export type PushNotificationJson = {
  notificationId: Id;
  sentAt?: Date;
  retryCount?: number;
};

export enum PushNotificationPriority {
  NORMAL = 'normal',
  HIGH = 'high',
}

export enum AudienceType {
  ONLINE = 'online',
  ALL = 'all',
}

export enum NotificationQueueType {
  NOTIFICATIONS = 'notifications',
}

export enum NotificationJobType {
  ARCHIVE_NOTIFICATION = 'archive_notification',
  WEBHOOK_NOTIFICATION = 'webhook_notification',
}

export type NotificationsJobInterface = JobInterface<NotificationJobType>;

export interface ArchiveNotificationsJobInterface extends NotificationsJobInterface {
  userId: Id;
  organizationId: Id;
  notificationTypesToArchive?: NotificationType[];
}

// user organization notifications resource

export interface UserOrganizationNotificationsResourceQueryParams extends ResourceQueryParams {
  isArchived: boolean;
  notificationType: string;
  excludedNotificationType: string;
}

export interface UserOrganizationNotificationsResourceContext {
  userId: Id;
  organizationId: Id;
}

export interface UserOrganizationNotificationsResourceData {
  data: NotificationDbRow[];
  page?: string;
}
