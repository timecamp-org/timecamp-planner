import { AnalyticsEngine } from '../analytics/AnalyticsEngine';
import { FeedbackJson, FeedbackType } from '../analytics/types';
import { ChecklistItemBasicData } from '../checklist/types';
import { EntityStatus, UserRegistrationStatus } from '../common/enum';
import { Id } from '../common/identifier';
import { AnyDict } from '../common/types';
import { NotificationCenterType } from '../dict/types';
import { EntityHistory } from '../entityHistory/types';
import { CustomFieldName } from '../extensions/types';
import { IntegrationStatus } from '../integration/types';
import { JobNamespace } from '../messageQueue/types';
import { NotificationType, NotificationsDeliverySettingsJsonInterface } from '../notifications/types';
import {
  AgentCode,
  FeatureCode,
  OrganizationSubscriptionCancellationStatus,
  SubscriptionFeature,
  SubscriptionStatus,
} from '../payment/types';
import { ProjectIconType, ProjectPanelType } from '../projects/types';
import { RecurrenceSettingsData, TaskPriorityType } from '../tasks/types';

export enum ProjectRole {
  OWNER = 'owner',
  MEMBER = 'member',
  MANAGER = 'manager',
}

export enum MessageHailType {
  HERE = 'here',
  ASSIGNEES = 'assignees',
  PROJECT = 'project',
  SPACE = 'space', // deprecated - TODO: fix the DB enum
}

export enum MessageContainerType {
  PROJECT = 'project',
  TASK = 'task',
}

export enum ProjectType {
  PROJECT = 'project',
  DIRECT_CHAT = 'direct-chat',
  GROUP_CHAT = 'group-chat',
}

export enum TaskRole {
  OWNER = 'owner',
  COLLABORATOR = 'collaborator',
  ASSIGNEE = 'assignee',
}

export enum TaskStatus {
  COMPLETE = 'complete',
  INCOMPLETE = 'incomplete',
}

export enum TaskProgress {
  COMPLETE = 100,
}

export enum CustomFieldTargetType {
  TASK = 'task',
  PROJECT = 'project',
  TASK_LIST = 'task-list',
  ORGANIZATION = 'organization',
  USER_IN_ORGANIZATION = 'user-in-organization',
}

export interface FileDbRow {
  id: Id;
  userId: Id;
  name: string;
  contentType: string;
  url: string;
  height: number;
  width: number;
  size: number;
  organizationId: Id;
  status: EntityStatus;
  createdAt: Date;
}

export interface UserSessionDbRow {
  id: Id;
  userId: Id;
  startedAt: Date;
  finishedAt?: Date;
  deviceType?: DeviceType;
}
export interface UserOnlineDbRow {
  userId: Id;
  isOnline: boolean;
}

export interface PublicUserDbRow {
  id: Id;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  email: string;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: EntityStatus;
  avatarUrl?: string;
  isOnline?: boolean;
  isBot?: boolean;
  locale?: string;
  registrationStatus: UserRegistrationStatus;
  ipAddress?: string;
  referrer?: string;
}

export interface UserDbRow extends PublicUserDbRow {
  passwordHash?: string;
}

export interface TagDbRow {
  id: Id;
  name: string;
  organizationId: string;
  color: string;
}

export interface MessageDbRow {
  id: Id;
  senderId: Id;
  editorId: Id;
  editedAt: Date;
  organizationId: Id;
  content: string;
  containerType: MessageContainerType;
  containerId: Id;
  createdAt: Date;
  isLinkPreviewEnabled: boolean;
}
export interface AbstractMessageContainerMetadataDbRow {
  userId: Id;
  timestamp: Date;
}
export interface ProjectKeyPressDbRow extends AbstractMessageContainerMetadataDbRow {
  projectId: Id;
}

export interface TaskKeyPressDbRow extends AbstractMessageContainerMetadataDbRow {
  taskId: Id;
}

export interface MessageMentionsUserDbRow {
  messageId: Id;
  userId: Id;
}

export interface MessageContainerProjectDbRow {
  projectId: Id;
  messageId: Id;
}

export interface MessageContainerTaskDbRow {
  taskId: Id;
  messageId: Id;
}

export interface MessageReactionDbRow {
  id: Id;
  userId: Id;
  messageId: Id;
  emojiCode: string;
}

export interface MessageFileDbRow {
  messageId: Id;
  fileId: Id;
}

export interface MessageHailDbRow {
  messageId: Id;
  hailType: MessageHailType;
}

export interface UserInProjectDbRow {
  id: Id;
  userId: Id;
  projectId: Id;
  role: ProjectRole;
}

export interface ProjectFileDbRow {
  projectId: Id;
  fileId: Id;
}

export interface ProjectDbRow {
  id?: Id;
  organizationId?: Id;
  status?: EntityStatus;
  name?: string;
  description?: string;
  projectType?: ProjectType;
  creatorId: Id;
  isPrivate?: boolean;
  isArchived?: boolean;
  color?: string;
  startDate?: Date;
  dueDate?: Date;
  autoJoin?: boolean;
  iconType?: ProjectIconType;
  backgroundImageUrl?: Id;
}

export type ProjectTemplateDbRow = { id?: Id; projectTemplateId: Id } & Pick<
  ProjectDbRow,
  'name' | 'projectType' | 'color' | 'organizationId' | 'creatorId'
>;

export type ListTemplateDbRow = Partial<ListDbRow> & { taskTemplates: TaskTemplateDbRow[]; projectTemplateId: Id };

export type TaskTemplateDbRow = Partial<TaskDbRow> & { tagTemplates: TagTemplateDbRow[] };

export type ChecklistItemTemplateDbRow = Partial<ChecklistItemDbRow>;

export type TagTemplateDbRow = TagDbRow;

export interface GuestInProjectDbRow {
  id: Id;
  userInOrganizationId: Id;
  userInProjectId: Id;
  organizationId: Id;
}

export interface GuestInProjectFullDbRow extends GuestInProjectDbRow {
  projectId: Id;
  userId: Id;
}

export interface ListDbRow {
  id: Id;
  projectId: Id;
  order: number;
  name: string;
  isArchived: boolean;
  creatorId: Id;
}

export interface ChecklistItemDbRow extends ChecklistItemBasicData {
  order: number;
  name: string;
  entityHistory: EntityHistory<ChecklistItemDbRow>;
}

export interface UserInChecklistDbRow {
  userId: Id;
  checklistItemId: Id;
}

export interface TaskDbRow {
  id: Id;
  projectId?: Id;
  taskListId?: Id;
  creatorId?: Id;
  name: string;
  order: number;
  description?: string;
  isArchived: boolean;
  status: TaskStatus;
  progress?: number;
  dueDate?: Date;
  startDate?: Date;
  sourceMessageId?: Id;
  taskPriorityType?: TaskPriorityType;
}

export type TaskLatestVisitDbRow = {
  taskId: Id;
  userId: Id;
  latest_visit_at: Date;
};

export type SubscriptionFeatureDbRow = {
  planId: Id;
  code: FeatureCode;
  value: SubscriptionFeature;
};

export type PlanFeatureDbRow = {
  subscriptionId: Id;
  code: FeatureCode;
  value: SubscriptionFeature;
};

export type ExtensionConfigForSubscriptionPlanDbRow = {
  id: Id;
  subscriptionPlanId: Id;
  extensionId: Id;
  isEnabled: boolean;
};

export type UserFeedbackDbRow = {
  userId: Id;
  feedbackType: FeedbackType;
  feedback: FeedbackJson;
  createdAt: Date;
};

export interface ChangedPropertyInterface {
  propertyName: string;
  old: any;
  new: any;
}

export interface ActivityChangedPropDbRow extends ChangedPropertyInterface {
  id: Id;
  activityId: Id;
}

export enum ActivityType {
  CREATE = 'create',
  ADD = 'add',
  DELETE = 'delete',
  REMOVE = 'remove',
  MODIFY = 'modify',
}

export enum ContainerType {
  TASK = 'task',
  PROJECT = 'project',
  TASK_LIST = 'task_list',
  CHECKLIST_ITEM = 'checklist_item',
}

export enum TargetType {
  TASK = 'task',
  PROJECT = 'project',
  USER = 'user',
  TASK_LIST = 'task_list',
  FILE = 'file',
}

export interface ActivityDbRow {
  id?: Id;
  actorId: Id;
  type: ActivityType;
  createdAt?: number;
  targetType: TargetType;
  targetValue: string;
  containerType?: ContainerType;
  containerValue?: string;
}
export interface AbstractActivityTargetDbRow {
  activityId: Id;
}
export interface AbstractActivityContainerDbRow {
  activityId: Id;
}
export interface ActivityTargetUserDbRow extends AbstractActivityTargetDbRow {
  userId: Id;
}
export interface ActivityTargetFileDbRow extends AbstractActivityTargetDbRow {
  fileId: Id;
}
export interface ActivityTargetProjectDbRow extends AbstractActivityTargetDbRow {
  projectId: Id;
}
export interface ActivityTargetTaskDbRow extends AbstractActivityTargetDbRow {
  taskId: Id;
}
export interface ActivityTargetTaskListDbRow extends AbstractActivityTargetDbRow {
  taskListId: Id;
}
export interface ActivityContainerProjectDbRow extends AbstractActivityContainerDbRow {
  projectId: Id;
}

export interface ActivityContainerTaskDbRow extends AbstractActivityContainerDbRow {
  taskId: Id;
}

export interface ActivityContainerChecklistItemDbRow extends AbstractActivityContainerDbRow {
  checklistItemId: Id;
}

export interface OrganizationDbRow {
  id: Id;
  name: string;
  createdAt?: Date;
  modifiedAt?: Date;
  logo?: string;
  status: EntityStatus;
}

export enum OrganizationRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export interface UserInOrganizationDbRow {
  id: Id;
  userId: Id;
  organizationId: Id;
  role: OrganizationRole;
  entityStatus?: EntityStatus;
  createdAt: Date;
  modifiedAt: Date;
}

export interface UserInTaskDbRow {
  userId: Id;
  taskId: Id;
  role: TaskRole;
}

export interface UserFollowsTaskDbRow {
  userId: Id;
  taskId: Id;
}

export interface UserFollowsProjectDbRow {
  userId: Id;
  projectId: Id;
}

export interface UserFollowsTaskListDbRow {
  userId: Id;
  taskListId: Id;
}

export interface UserFollowsTaskDbRow {
  userId: Id;
  taskId: Id;
}

export interface UnreadNotificationDbRow {
  notificationId: Id;
  readAt?: Date;
  notificationType: NotificationType;
  createdAt: Date;
  data: NotificationData;
  containerId: Id;
  organizationId: Id;
}

export interface NotificationsDeliverySettingsDbRow extends NotificationsDeliverySettingsJsonInterface {
  userId: Id;
  organizationId: Id;
}

export interface NotificationDbRow {
  id: Id;
  createdAt?: Date;

  notificationType: NotificationType;
  recipientId: Id;
  activityId: Id;

  actorId: Id;
  organizationId: Id;

  data: NotificationData;
}

export type NotificationData = Partial<{
  projectId: Id;
  projectValue: string;
  projectType: ProjectType;

  taskListId: Id;
  taskListValue: string;

  taskId: Id;
  taskValue: string;
  taskSourceMessageId: Id;
  taskSourceMessageOwnerId: Id;

  checklistItemId: Id;
  checklistItemValue: string;

  messageId: Id;
  messageValue: string;

  conversationId?: Id;

  userId: Id;
  userValue: string;

  fileId: Id;
  fileValue: string;
  fileIsImage: boolean;
  fileUrl: string;
  fileThumbUrl: string;
  fileContentType: string;
  fileImageWidth: number;
  fileImageHeight: number;

  changedProps?: ChangedPropertyInterface[];
}>;

export interface NotificationInAppDbRow {
  notificationId: Id;
  readAt?: Date;
  isArchived: boolean;
}

export interface PushNotificationDbRow {
  notificationId: Id;
  sentAt?: Date;
  retryCount: number;
}

export interface NotificationPushDeviceDbRow {
  deviceId: Id;
  userId: Id;
  status: EntityStatus;
  deviceType: DeviceType;
}

export interface TaskHasTagDbRow {
  tagId: Id;
  taskId: Id;
}

export interface ProjectHasTagDbRow {
  tagId: Id;
  projectId: Id;
}

export interface TaskAttachmentDbRow {
  fileId: Id;
  taskId: Id;
}

export interface ProjectAttachmentDbRow {
  fileId: Id;
  projectId: Id;
}

export interface ProjectMessageReadDbRow {
  projectId: Id;
  userId: Id;
  timestamp: Date;
  messageId: Id;
}

export interface TaskMessageReadDbRow {
  taskId: Id;
  userId: Id;
  timestamp: Date;
  messageId: Id;
}

export type UserShipmentLogDbRow = {
  userId: Id;
  engineCode: AnalyticsEngine;
  shipmentSuccessful: boolean;
  sentAt?: Date;
  failCount?: number;
};

export type EventShipmentLogDbRow = {
  eventId: Id;
  engineCode: AnalyticsEngine;
  shipmentSuccessful: boolean;
  sentAt?: Date;
  failCount?: number;
};

export type UsageTrackerEventDbRow = {
  id: Id;
  userId: Id;
  name: string;
  timestamp: Date;
  customProps: any;
  ip: string;
  deviceId: string;
};

export enum ChatNotificationSettingsType {
  ALL = 'all',
  ONLY_MENTIONS = 'onlyMentions',
  NOTHING = 'nothing',
}

export interface ChatNotificationSettingsDbRow {
  userId: Id;
  projectId: Id;
  chatNotificationSettingsType: ChatNotificationSettingsType;
}

export type ExtensionDbRow = {
  id?: Id;
  namespace: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  isInMarketplace: boolean;
};

export type ExtensionInOrganizationDbRow = {
  extensionId: Id;
  organizationId: Id;
  status: EntityStatus;
};

export type CustomFieldDbRow = {
  id?: Id;
  extensionId: Id;
  name: CustomFieldName;
  targetType: CustomFieldTargetType;
  generateActivities: boolean;
};

export type CustomFieldValueDbRow = {
  fieldId: Id;
  value: any; // This is "JSONB" field in Postgres
  targetType: CustomFieldTargetType;
  targetId: Id;
  createdAt: Date;
  isInternal: boolean;
};

export type CustomRelationDbRow = {
  id: Id;
  extensionId: Id;
  name: string;
};

export type CustomRelationColumnDbRow = {
  relationId: Id;
  name: string;
  referenceTable: string;
  isPk: boolean;
};

export type TaskVotingReactionDbRow = {
  taskId: Id;
  userId: Id;
  emojiCode: string;
};

export type TaskRecurrenceSettingsDbRow = {
  id: Id;
  taskId: Id;
  value: RecurrenceSettingsData;
  nextRecurrenceAt: Date;
  createdAt: Date;
};

export type TaskRecurrenceDependencyDbRow = {
  id: Id;
  taskId: Id;
  targetTaskId: Id;
  recurrencySettingsId: Id;
};

export enum DeviceType {
  BROWSER = 'browser',
  DESKTOP_APP = 'desktopApp',
  // TODO: remove DeviceType.MOBILE in the future; it's kept for backward compatibility
  MOBILE = 'mobile',
  IOS = 'ios',
  ANDROID = 'android',
}

export type UserInvitationDbRow = {
  inviterId: Id;
  invitedUserId: Id;
  organizationId: Id;
  createdAt: Date;
  resentAt: Date;
  resentCount: number;
  invitationCount?: number;
  updatedAt: Date;
};

export type ConversationSettingsDbRow = {
  userId: Id;
  conversationHash: string;
  organizationId: Id;
  isVisible: boolean;
};

export type PaymentAgentDbRow = {
  id: Id;
  code: AgentCode;
};

export type PaymentDbRow = {
  id: Id;
  agentPaymentId: Id;
  userId: Id;
  planId: Id;
  createdAt: Date;
  seatCount: number;
  paymentUrl: string;
  expiresAt: Date;
  organizationId: Id;
};

export type SubscriptionInOrganizationDbRow = {
  id: Id;
  agentSubscriptionId: Id;
  agentId: Id;
  planId: Id;
  nextPlanId: Id;
  nextBillingAmount: number;
  seatCount: number;
  billingPeriod: number;
  organizationId: Id;
  status: SubscriptionStatus;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
};

export type SubscriptionPlanDbRow = {
  id: Id;
  planCode: string;
  name: string;
  costPerSeat: number;
  billingPeriod: number;
  isEnabled: boolean;
};

export type SubscriptionCancellationInOrganizationDbRow = {
  subscriptionId: Id;
  organizationId: Id;
  status: OrganizationSubscriptionCancellationStatus;
};

export type OAuthAccessTokenDbRow = {
  accessToken: string;
  clientId: string;
  scope: string;
  userId: Id;
  expiresAt: Date;
};

export type OAuthRefreshTokenDbRow = {
  refreshToken: string;
  clientId: string;
  scope: string;
  userId: Id;
  expiresAt: Date;
};

export type OAuthAuthorizationCodeDbRow = {
  authorizationCode: string;
  clientId: string;
  userId: Id;
  redirectUri: string;
  scope: string;
  expiresAt: Date;
};

export type OAuthClientDbRow = {
  id: Id;
  name: string;
  clientSecret: string;
  thumbnailUrl: string;
  redirectUris: string;
  grants: string;
  accessTokenLifetime: number;
  refreshTokenLifetime: number;
};

export interface AppDbRow {
  id: Id;
  oauthClientId: Id;
}

export interface UserInAppDbRow {
  appId: Id;
  userId: Id;
  role: AppUserRole;
}

export enum AppUserRole {
  OWNER = 'owner',
  COLLABORATOR = 'collaborator',
}

export interface UserMailSentDbRow {
  userId: Id;
  userInOrganizationId: Id;
  mailType: MailType;
  createdAt?: Date;
}

export enum MailType {
  FIRST_TRIAL_EXPIRE = 'firstTrialExpire',
  SECOND_TRIAL_EXPIRE = 'secondTrialExpire',
}

export interface UserStatusDbRow {
  id: Id;
  userId: Id;
  organizationId: Id;
  title: string;
  emojiCode: string;
  resetAt: Date;
  createdAt: Date;
}

export interface ProjectSettingsDbRow {
  userId: Id;
  projectId: Id;
  lastOpenedPanel: ProjectPanelType;
  isRightPanelOpened: boolean;
}

export interface ChatWithMeTokenDbRow {
  userInOrganizationId: Id;
  token: Id;
}

export interface IntegrationDbRow {
  extensionId: Id;
  organizationId: Id;
  userId: Id;
  status: IntegrationStatus;
  isRead: boolean;
  createdAt: Date;
}

export interface JobStatusDbRow {
  id: Id;
  userId?: Id;
  organizationId?: Id;
  namespace: JobNamespace;
  jobsSpawned: number;
  jobsDone: number;
  iterationCount: number;
  isFailed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum ViewSettingsType {
  OVERWATCH = 'overwatch',
  TIMELINE = 'timeline',
  BOARD = 'board',
  chat = 'chat',
  MY_TASKS = 'myTasks',
}

export interface DictDbRow<T> {
  id: Id;
  value: T;
  label?: string;
}

export enum ViewContainerType {
  ORGANIZATION = 'organization',
  PROJECT = 'project',
  TASK = 'task',
  OVERWATCH_SPACE_TILE = 'overwatchSpaceTile',
  CONVERSATION = 'conversation',
  MY_TASKS = 'myTasks',
}

export interface ViewSettingsDbRow {
  id: Id;
  viewTypeId: Id;
  userId: Id;
  containerId: Id;
  containerType: ViewContainerType;
  settings: AnyDict;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ViewSettingsFullDbRow extends ViewSettingsDbRow {
  viewType: ViewSettingsType;
}

export interface LinkedViewSettingsDbRow {
  baseViewSettingsId: Id;
  linkedViewSettingsId: Id;
  createdAt?: Date;
}

export interface AppVersionDbRow {
  versionCode: string;
  deployedAt: number;
  appPlatformId: Id;
}

export interface UserLatestNotificationsDisplayDbRow {
  userInOrganizationId: Id;
  notificationCenterTypeId: Id;
  displayedAt: Date;
}

export interface UserLatestNotificationsDisplayFullDbRow extends UserLatestNotificationsDisplayDbRow {
  notificationCenterType: NotificationCenterType;
}

export interface UserProjectOrderDbRow {
  id: Id;
  userInOrganizationId: Id;
  projectId: Id;
  order: number;
}

export interface UserProjectGroupDbRow {
  id: Id;
  userInOrganizationId: Id;
  name: string;
  order: number;
  isExpanded: boolean;
}

export interface ProjectInGroupDbRow {
  id: Id;
  projectId: Id;
  groupId: Id;
  userId: Id;
  order: number;
}

export interface ProjectLatestVisitDbRow {
  id: Id;
  userId: Id;
  organizationId: Id;
  projectId: Id;
  userInProjectId: Id;
}

export interface UserInOrganizationSettingsDbRow<T = AnyDict> {
  id: Id;
  userInOrganizationId: Id;
  typeId: Id;
  value: T;
  createdAt: Date;
}

export enum UserInOrganizationSettingsType {
  CHATS_RETENTION = 'chats_retention',
}

export interface UserInOrganizationSettingsFullDbRow<T = AnyDict> extends UserInOrganizationSettingsDbRow<T> {
  settingsType: UserInOrganizationSettingsType;
}

export interface GroupDbRow {
  id: Id;
  name: string;
  slug: string;
  organizationId: Id;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInGroupDbRow {
  userInOrganizationId: Id;
  userId?: Id;
  groupId: Id;
  createdAt: Date;
}

export enum SumPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  TOTAL = 'total',
}

export interface TaskTimeEstimateDbRow {
  minutes: number;
  skipWeekends: boolean;
  sumPeriod: SumPeriod;
  taskId: Id;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDbRow {
  id: Id;
  userId: Id;
  callbackUrl: string;
  createdAt?: number;
  timestamp: string;
  secretKey: string;
  status?: EntityStatus;
}

export interface WebhookFailDbRow {
  id?: Id;
  webhookId: Id;
  response: Record<string, any>;
  failed_at?: number;
}
