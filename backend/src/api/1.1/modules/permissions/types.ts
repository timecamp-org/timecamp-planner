import { Id } from '../common/identifier';
import {
  TargetType,
  ContainerType,
  MessageContainerType,
  CustomFieldTargetType,
  OrganizationRole,
  ProjectRole,
  TaskRole,
  ProjectType,
  ViewSettingsType,
  ViewContainerType,
  UserInOrganizationSettingsType,
} from '../db/schema';
import { EntityStatus } from '../common/enum';
import { AnyDict } from '../common/types';
import { ViewSettingsJson } from '../settings/types';
import { ProjectPersonalContainerType } from '../projectPersonalStructure/types';

export enum PermissionType {
  DELETE_USER = 'delete_user',
  VIEW_ORGANIZATION = 'view_organization',
  UPDATE_ORGANIZATION = 'update_organization',
  UPDATE_ORGANIZATION_ROLE = 'update_organization_role',
  DEACTIVATE_USER_FROM_ORGANIZATION = 'deactivate_user_from_organization',
  REACTIVATE_USER_FROM_ORGANIZATION = 'reactivate_user_from_organization',
  DELETE_GUEST_FROM_ALL_SPACES = 'delete_guest_from_all_spaces',
  VIEW_ACTIVITIES = 'view_activities',
  CREATE_PROJECT = 'create_project',
  VIEW_PROJECT = 'view_project',
  UPDATE_PROJECT_PEOPLE = 'update_project_people',
  DELETE_PROJECT_PEOPLE = 'delete_project_people',
  VIEW_LIST = 'view_list',
  CREATE_LIST = 'create_list',
  VIEW_CONVERSATION_DATA = 'view_conversation_data',
  VIEW_TASK = 'view_task',
  CREATE_TASK = 'create_task',
  UPDATE_CHECKLIST_ITEM = 'update_checklist_item',
  UPDATE_CHECKLIST_ITEM_ASSIGNEES = 'update_checklist_item_assignees',
  VIEW_CUSTOM_FIELD = 'view_custom_field',
  UPDATE_CUSTOM_FIELD = 'update_custom_field',
  UPDATE_EXTENSION_RELATION = 'update_extension_relation',
  UPDATE_EXTENSION_STATUS = 'update_extension_status',
  UPDATE_INTEGRATION_STATUS = 'update_integration_status',
  CREATE_FILE = 'create_file',
  VIEW_MESSAGES = 'view_messages',
  CREATE_MESSAGE = 'create_message',
  UPDATE_MESSAGE = 'update_message',
  CREATE_REACTION = 'create_reaction',
  UPDATE_REACTION = 'update_reaction',
  UPDATE_NOTIFICATION = 'update_notification',
  CREATE_PAYMENT = 'create_payment',
  UPDATE_SUBSCRIPTION = 'create_payment',
  CREATE_TAG = 'create_tag',
  UPDATE_TAG = 'update_tag',
  VIEW_TAGS_OVERVIEW = 'view_tags_overview',
  TEST = 'view_tags_overview',
  UPDATE_APP = 'update_app',
  DELETE_APP = 'delete_app',
  ADD_APP_MEMBER = 'add_app_member',
  REMOVE_APP_MEMBER = 'remove_app_member',
  EXPORT_DATA = 'export_data',
  CAN_CREATE_VIEW_SETTINGS = 'create_view_settings',
  CAN_UPDATE_VIEW_SETTINGS = 'update_view_settings',
  CAN_UPDATE_VIEW_SETTINGS_LINK = 'update_view_settings_link',
  GET_PERSONAL_PROJECT_STRUCTURE = 'get_personal_project_structure',
  UPDATE_PERSONAL_PROJECT_STRUCTURE = 'update_personal_project_structure',
  CREATE_PROJECT_GROUP = 'create_project_group',
  UPDATE_PROJECT_GROUP = 'update_project_group',
  CAN_UPDATE_USER_IN_ORGANIZATION_SETTINGS = 'update_user_in_organization_settings',
  CAN_GET_USER_IN_ORGANIZATION_SETTINGS = 'get_user_in_organization_settings',
  CREATE_GROUP = 'create_group',
  UPDATE_GROUP = 'update_group',
}

export type PermissionMiddlewareHandler = (
  permissionTypes: PermissionType[]
) => (req: any, res: any, next?: any) => any;

export interface PermissionContext {
  currentUserId: Id;
  userId?: Id;
  organizationId?: Id;
  extensionId?: Id;
  namespace?: string;
  extensionIds?: Id[];
  userInOrganizationId?: Id;
  projectId?: Id;
  projectType?: ProjectType;
  taskListId?: Id;
  listId?: Id;
  sourceListId?: Id;
  taskId?: Id;
  checklistItemId?: Id;
  fileId?: Id;
  sourceTaskId?: Id;
  containerType?:
    | ContainerType
    | MessageContainerType
    | ViewContainerType
    | ProjectPersonalContainerType;
  containerId?: Id;
  targetType?: TargetType | CustomFieldTargetType;
  targetId?: Id;
  messageId?: Id;
  reactionId?: Id;
  notificationId?: Id;
  appId?: Id;
  tagId?: Id;
  role?: OrganizationRole | ProjectRole | TaskRole;
  status?: EntityStatus;
  metadata: AnyDict;
  viewSettingsId?: Id;
  viewType?: ViewSettingsType;
  settingsId?: Id;
  settingsType?: UserInOrganizationSettingsType;
  baseViewSettings?: ViewSettingsJson;
  groupId?: Id;
}

export enum CheckPermissionStatus {
  OK,
  NOT_PERMITTED,
  RESOURCE_NOT_FOUND,
}

export interface CheckPermissionResult {
  status: CheckPermissionStatus;
  reason?: PermissionDeniedReason | string;
}

export enum PermissionDeniedReason {
  USER_NOT_IN_ORGANIZATION = "User doesn't belong to organization",
  USER_NOT_IN_PROJECT = "User doesn't belong to project",
  INSUFFICIENT_ROLE_PRIVILEGES = 'Insufficient role privileges',
  USER_NOT_ORGANIZATION_OWNER = 'User is not an organization owner',
  USER_NOT_ORGANIZATION_ADMIN = 'User must be at least an organization admin',
  USER_NOT_ORGANIZATION_MEMBER = 'User must be at least an organization member',
  CANNOT_DEACTIVATE_OWNER = 'Cannot deactivate workspace owner',
  SUBSCRIPTION_NOT_ACTIVE = 'Subscription is not active',
  HAS_ACTIVE_SUBSCRIPTION = 'At least one subscription is active',
  CONVERSATION_DOESNT_EXIST = "Conversation doesn't exist",
  NOT_ENOUGH_SEAT_COUNT = 'Not enough seat count in organization',
  NOT_ENOUGH_GUEST_SEAT_COUNT = 'Not enough guest seat count in organization',
  NOT_ENOUGH_ASSIGNED_PROJECTS = 'Not enough assigned spaces',
  EXTENSION_NOT_AVAILABLE = 'Extension not available in current subscription plan',
  USER_NOT_APP_MEMBER = 'User is not a member of app',
  USER_NOT_APP_OWNER = 'User is not app owner',
  CANNOT_REMOVE_APP_OWNER = 'Cannot remove app owner',
  USER_NOT_MESSAGE_OWNER = 'User is not message owner',
  USER_NOT_REACTION_OWNER = 'User is not reaction owner',
  USER_NOT_VIEW_OWNER = 'User is not view owner',
  USER_NOT_PROJECT_GROUP_OWNER = 'User is not project group owner',
  PROJECT_MUST_BE_SPACE = 'Target project must be a space',
  RESOURCE_NOT_FOUND = 'Target resource not found',
  USER_NOT_SETTINGS_OWNER = 'User is not settings owner',
}

export interface PermissionOptions {
  isEnabled: boolean;
}
