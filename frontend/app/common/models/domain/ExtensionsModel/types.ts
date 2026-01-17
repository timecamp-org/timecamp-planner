import { AnyDict, ImmutableMap } from '../../../types';
import { Id } from '../../../utils/identifier';

export interface ExtensionInterface {
  id: Id;
  namespace: ExtensionNamespace;
  name: string;
  description: string;
  thumbnailUrl: string;
  type: ExtensionType;
  isInMarketplace: boolean;
}

export interface ExtensionsState extends ImmutableMap<string, any> {
  extensionsData: Map<Id, ExtensionInterface>;
  isExtensionEnabledForOrganization: Map<Id, Map<Id, boolean>>;
  customFields: Map<Id, Map<Id, any>>;
}

export enum TargetType {
  ORGANIZATION = 'organization',
  USER_IN_ORGANIZATION = 'user-in-organization',
  PROJECT = 'project',
  TASK = 'task',
  TASK_LIST = 'task-list',
}

export enum EnabledStatus {
  ENABLE_FOR_ALL_SPACES = 'all-spaces',
  ENABLE_FOR_SPECIFIC_SPACES = 'specific-spaces',
  ESTIMATES_ENABLED = 'estimatesEnabled',
  VOTING_ENABLED = 'votingEnabled',
  RECURRING_TASKS_ENABLED = 'recurringTasksEnabled',
  KANBAN_LIMITS_ENABLED = 'kanbanLimitsEnabled',
}

export enum FieldType {
  SYNC_TOKEN = 'syncToken',
  INVITE_TOKEN = 'inviteToken',
  ENABLED_STATUS = 'enabledStatus',
  ESTIMATED_EFFORT = 'estimatedEffort',
  INVITER_ID = 'inviterId',
}

export enum ExtensionType {
  INTERNAL = 'internal',
  INTEGRATION = 'integration',
}

export enum ExtensionNamespace {
  AGILE = 'agile',
  TASK_VOTING = 'task-voting',
  CALENDAR_SYNC = 'calendar-sync',
  INTERNAL_CALENDAR = 'internal-calendar',
  GOOGLE_DRIVE_PICKER = 'google-drive-picker',
  DROPBOX_CHOOSER = 'dropbox-chooser',
  TRELLO_DATA_IMPORT = 'trello-data-import',
  CHAT_WITH_ME = 'chat-with-me',
  TASK_RECURRENCE = 'task-recurrence',
  OVERWATCH = 'overwatch',
  MY_TASKS = 'my-tasks',
  TIMELINE = 'timeline',
  SPACE_GROUPS = 'space-groups',
  SPACE_TASK_LIST = 'space-task-list',
  HEYSPACE_MEETS = 'heyspace-meets',
  KANBAN_LIMITS = 'kanban-limits',
  FILE_LIST = 'file-list',
  SCHEDULE = 'schedule',
}

export enum RelationType {
  REACTION = 'reaction',
  SETTINGS = 'settings',
  DEPENDENCY = 'dependency',
  TOKEN = 'token',
  CARDS_LIMIT = 'cardsLimit',
}

export type ExtensionsData = AnyDict;

export type CustomFieldsMap = AnyDict;
