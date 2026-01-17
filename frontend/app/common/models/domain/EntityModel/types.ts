import { Action } from 'typesafe-actions';
import { ImmutableMap, PayloadAction } from '../../../types';
import { Id } from '../../../utils/identifier';

export interface EntityInterface<T = any> {
  entityType?: EntityType;
  entityId: Id;
  optionalId?: Id;
  body?: T;
  operation?: OperationType;
  type: ActivityType;
}

export enum OperationType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EntityStatus {
  EXISTS = 'exists',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}

export enum EntityType {
  USER_DATA = 'user',
  USER_IN_ORGANIZATION = 'userInOrganization',
  USER_STATUS_DATA = 'userStatus',

  PROJECT_DATA = 'project',
  PROJECT_PEOPLE = 'projectPeople',
  PROJECT_PERSON = 'projectPerson',
  PROJECT_FOLLOWER = 'projectFollower',
  PROJECT_FILE = 'projectFile',
  GUEST_IN_PROJECT = 'guestInProject',

  CONVERSATION_SETTINGS = 'conversationSettings',

  ORGANIZATION_DATA = 'organization',

  TASK_LIST = 'taskList',
  TASK_LIST_FOLLOWER = 'taskListFollower',

  TASK_DATA = 'task',
  TASK_PERSON = 'taskPerson',
  TASK_FOLLOWER = 'taskFollower',
  CHECKLIST_ITEM = 'checklistItem',
  CHECKLIST_ITEM_ASSIGNEE = 'checklistItemAssignee',
  TASK_ATTACHMENTS_IDS = 'taskAttachments',
  TASK_SOURCE = 'task-source',

  MESSAGE_DATA = 'message',
  MESSAGE_READ_DATA = 'messageRead',
  MESSAGE_KEYPRESS_DATA = 'messageKeyPress',
  MESSAGE_REACTION_DATA = 'messageReaction',
  MESSAGE_ATTACHMENTS = 'messageAttachment',
  FILE_DATA = 'file',

  ACTIVITY_DATA = 'activity',

  TAG_DATA = 'tag',
  TASK_TAGS = 'taskTags',
  TASK_TIME_ESTIMATE = 'taskTimeEstimate',

  TASK_CHANGED_PROPS = 'taskChangedProps',
  PROJECT_CHANGED_PROPS = 'projectChangedProps',
  CHAT_NOTIFICATION_SETTINGS = 'chatNotificationSettings',

  EXTENSION_IN_ORGANIZATION = 'extensionInOrganization',
  EXTENSION_CUSTOM_FIELD_VALUE = 'extensionCustomFieldValue',

  EXTENSION_DATA_TASK_VOTING_REACTION = 'extensionDataTaskVotingReaction',
  EXTENSION_DATA_List_CARDS_LIMIT = 'extensionDataListCardsLimit',

  EXTENSION_DATA_TASK_RECURRENCE_SETTINGS = 'extensionDataTaskRecurrenceSettings',
  EXTENSION_DATA_TASK_RECURRENCE_DEPENDENCY = 'extensionDataTaskRecurrenceDependency',

  SUBSCRIPTION_CANCELLATION_IN_ORGANIZATION = 'subscriptionCancellationInOrganization',
  SUBSCRIPTION_IN_ORGANIZATION = 'subscriptionInOrganization',
  SUBSCRIPTION_PLAN = 'subscriptionPlan',
  SUBSCRIPTION_INVOICE = 'subscriptionInvoice',
  SUBSCRIPTION_COUPONS = 'subscriptionCoupons',

  INTEGRATION = 'integration',
  EXTENSION_APP = 'extensionApp',
  EXTENSION_USER_IN_APP = 'extensionUserInApp',

  JOB_STATUS = 'jobStatus',
  APP_VERSION = 'appVersion',

  PERSONAL_PROJECT_ORDER = 'personalProjectOrder',
  PERSONAL_PROJECT_GROUP = 'personalProjectGroup',
  PROJECT_IN_GROUP = 'projectInGroup',
}

export type EntityActionCreator<TEntity = any, TPayload = any> = (
  wrappedEntity: EntityInterface<TEntity>
) => PayloadAction<TPayload> | Action;
export type ActivityActionCreator<TActivity extends BaseWrappedActivity = any, TPayload = any> = (
  wrappedEntity: TActivity
) => PayloadAction<TPayload> | Action;
export type EntityOrActivityActionCreator = EntityActionCreator | ActivityActionCreator;

export interface EntityActionDescriptor<TEntity = any> {
  create?: EntityActionCreator<TEntity>;
  update?: EntityActionCreator<TEntity>;
  delete?: EntityActionCreator<TEntity>;
}

export type BaseEntity = {
  id: Id;
};

export enum ActivityType {
  ENTITY = 'entity',
  ENTITY_DIFF = 'entityDiff',
  MESSAGE = 'message',
  ONLINE_STATUS = 'onlineStatus',
  NOTIFICATION = 'notification',
  PUSH_NOTIFICATION = 'pushNotification',
  CONTROL_COMMAND = 'controlCommand',
}

export interface EntityState extends ImmutableMap<string, any> {
  entityTypes: Map<Id, EntityType>;
}

export interface BaseWrappedActivity {
  type: ActivityType;
}
