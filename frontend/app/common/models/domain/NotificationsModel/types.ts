import { Id } from "../../../utils/identifier";
import { ProjectType } from "../ProjectsModel/types";
import { EntityType } from "../EntityModel/types";
import { Map, List } from 'immutable'
import { NotificationExternalData, NotificationsSettings } from "./models";
import { ImmutableMap } from "../../../types";

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

export const chatNotificationTypes = [
  NotificationType.TASK_MESSAGE_SENT,
  NotificationType.USER_MENTIONED,
  NotificationType.HAIL_MENTIONED,
]

export const projectCounterNotificationTypes = [
  NotificationType.CONVERSATION_MESSAGE_SENT,
  NotificationType.USER_MENTIONED,
  NotificationType.HAIL_MENTIONED,
]

export const actionNotificationTypes = [
  NotificationType.TASK_CREATED,
  NotificationType.TASK_UPDATED,
  NotificationType.USER_ADDED_TO_PROJECT,
  NotificationType.USER_REMOVED_FROM_PROJECT,
  NotificationType.PROJECT_UPDATED,
  NotificationType.USER_ASSIGNED_TO_TASK,
  NotificationType.USER_UNASSIGNED_FROM_TASK,
  NotificationType.TASK_LIST_CREATED,
  NotificationType.TASK_LIST_UPDATED,
  NotificationType.FILE_ATTACHED_TO_TASK,
  NotificationType.DUE_DATE_REMINDER,
  NotificationType.GLOBAL,
  NotificationType.INVITATION_JOINED,
  NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM,
  NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES,
]

export const allNotificationTypes = [...chatNotificationTypes, ...actionNotificationTypes]

export interface NotificationInApp {
  id: Id,
  createdAt?: Date,

  notificationType: NotificationType,
  recipientId: Id,
  activityId: Id,

  actorId: Id,
  organizationId: Id,

  data: NotificationExternalDataInterface,
}

export interface RawNotificationInApp {
  notificationType: string,
  data: string,
}

export interface UnreadNotification {
  notificationId: Id,
  organizationId: Id,
  notificationType: NotificationType,
  createdAt: number,
  containerId: Id,
  data: NotificationExternalDataInterface,
}

export interface NotificationExternalDataInterface {

  projectId: Id,
  projectValue: string,
  projectType: ProjectType,

  taskListId: Id,
  taskListValue: string,

  taskId: Id,
  taskValue: string,
  taskSourceMessageId: Id,
  taskSourceMessageOwnerId: Id,

  messageId: Id,
  messageValue: string,

  conversationId?: Id,

  userId: Id,
  userValue: string,

  fileId: Id,
  fileValue: string,

  changedProps?: ChangedProperty[]
};

export interface ChangedProperty extends Map<string, any> {
  propertyName: string,
  old: any,
  new: any,
}

export enum ChatNotificationSettingsType {
  ALL = 'all',
  ONLY_MENTIONS = 'onlyMentions',
  NOTHING = 'nothing',
}

export interface NotificationInterface {
  id: Id,
  type: NotificationType,
  organizationId: Id,
  creationTimestamp: number,
  isArchived: boolean,
  readAt: number,
  actorId: Id,
  containerId: Id,
}

export interface NotificationSettingsInterface {
  emailNotifications: boolean,
  mobileNotifications: boolean,
  pushNotifications: boolean,
  soundNotifications: boolean,
}

export enum DeviceType {
  BROWSER = 'browser',
  DESKTOP_APP = 'desktopApp',
  MOBILE = 'mobile',
  ANDROID = 'android',
  IOS = 'ios',
}


export interface NotificationPathConfigInputInterface {
  targetType: EntityType,
  containerType: EntityType | EntityType[],
}

export interface NotificationPathConfigOutputInterface {
  targetId: Id,
  targetValue: string,
  targetType: EntityType,
  containerId: Id,
  containerValue: string,
  containerType: EntityType,
}

export type NotificationsData = Map<Id, NotificationInterface>

export type UnreadNotificationsTypes = Map<Id, NotificationType>
export type UnreadNotificationsChronology = Map<Id, Map<Id, List<Id>>>
export type UnreadNotificationsCreationTimestmap = Map<Id, number>
export type NotificationsExternalData = Map<Id, NotificationExternalData>
export type ObjectIdChatNotificationSettingsType = Map<Id, ChatNotificationSettingsType>

export interface NotificationsState extends ImmutableMap<string, any> {
  notificationsData: NotificationsData,
  notificationsExternalData: NotificationsExternalData,
  notificationsSettings: NotificationsSettings,
  unreadNotificationsCreationTimestamp: UnreadNotificationsCreationTimestmap,
  unreadNotificationsChronology: UnreadNotificationsChronology,
  unreadNotificationsTypes: UnreadNotificationsTypes,
  objectIdChatNotificationSettingsType: ObjectIdChatNotificationSettingsType,
  userLatestNotificationCenterDisplays: Map<Id, Map<NotificationCenterType, number>>,
}

export enum NotificationMethod {
  EMAIL = 'emailNotifications',
  PUSH = 'pushNotifications',
  MOBILE = 'mobileNotifications',
  SOUND = 'soundNotifications',
}

export const notificationMethodTrackingNames = {
  [NotificationMethod.EMAIL]: 'notification',
  [NotificationMethod.MOBILE]: 'notification',
  [NotificationMethod.SOUND]: 'notification',
  [NotificationMethod.PUSH]: 'push-notification',
}

export type RouteCreatedFromNotification = {
  routeName: string,
  taskId?: Id,
  projectId?: Id,
  openCardComments?: boolean,
}

export enum NotificationCenterType {
  CHAT = 'CHAT',
  ACTION_BASED = 'ACTION_BASED',
  ALL = 'ALL'
}
