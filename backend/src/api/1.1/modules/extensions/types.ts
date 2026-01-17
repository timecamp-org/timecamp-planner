import { AnyDict } from '../common/types';
import { CustomRelationColumnDbRow, CustomFieldTargetType, TargetType, ExtensionDbRow } from '../db/schema';
import { EntityStatus } from '../common/enum';
import { ResourceQueryParams } from '../../../../infrastructure/resources/types';
import { Id } from '../common/identifier';

export type FullyQualifiedCustomField = {
  namespace: string;
  name: string;
};

export type CustomFieldValues = {
  [fqFieldName: string]: ExtensionCustomFieldValues;
};

export type ExtensionCustomFieldValues = {
  [extensionId: string]: any;
};

export type ExtensionsData = {
  [fullNamespace: string]: any;
};

export type ExtensionRelation = {
  namespace: string;
  relationName: string;
  tableName: string;
};

export type CustomFieldTargetValues = {
  [targetId: string]: any;
};

export type CustomFieldExtensionValues = {
  [extensionId: string]: CustomFieldTargetValues;
};

export type CustomFieldValuesMap = {
  [fqFieldName: string]: CustomFieldTargetValues;
};

export enum SetCustomRelationValueStatus {
  OK,
  NAMESPACE_DOES_NOT_EXIST,
  CUSTOM_RELATION_DOES_NOT_EXIST,
  CUSTOM_RELATION_FIELD_DOES_NOT_EXIST,
  UNIQUE_KEY_MALFORMED,
}

export enum GetExtensionsDataStatus {
  OK,
}

export type SetCustomRelationValueResult =
  | { status: SetCustomRelationValueStatus.OK }
  | { status: SetCustomRelationValueStatus.NAMESPACE_DOES_NOT_EXIST; namespace: string }
  | { status: SetCustomRelationValueStatus.CUSTOM_RELATION_DOES_NOT_EXIST; relation: string }
  | { status: SetCustomRelationValueStatus.CUSTOM_RELATION_FIELD_DOES_NOT_EXIST; field: string }
  | { status: SetCustomRelationValueStatus.UNIQUE_KEY_MALFORMED }
  | { status: GetBoundColumnsStatus.MISSING_PK_COLUMN; columnName: string }
  | { status: GetBoundColumnsStatus.MISSING_VALUE_COLUMN; columnName: string };

export type GetExtensionsDataResult = {
  status: GetExtensionsDataStatus.OK;
  values: AnyDict;
};

export type GetCustomRelationResult = {
  status: SetCustomRelationValueStatus;
  values?: AnyDict;
};

export enum SetCustomFieldValueStatus {
  OK,
  CUSTOM_FIELD_FULLY_QUALIFIED_NAME_MALFORMED,
  CUSTOM_FIELD_DOES_NOT_EXIST,
  NAMESPACE_DOES_NOT_EXIST,
  UNKNOWN_TARGET_TYPE,
}

export enum GetCustomFieldValueStatus {
  OK,
  NAMESPACE_DOES_NOT_EXIST,
}

export type GetValuesResult = {
  status: GetCustomFieldValueStatus;
  values?: CustomFieldValues;
};
export type GetValuesForTargetIdsResult = {
  status: GetCustomFieldValueStatus;
  values?: CustomFieldValuesMap;
};
export type GetValueResult = {
  status: SetCustomFieldValueStatus;
  values?: any;
};

export type SetValueResult = {
  status: SetCustomFieldValueStatus;
  fieldName: string;
};

export enum GetBoundColumnsStatus {
  OK,
  MISSING_PK_COLUMN,
  MISSING_VALUE_COLUMN,
}

export type GetRelationColumnsResult = {
  pkColumns: CustomRelationColumnDbRow[];
  valueColumns: CustomRelationColumnDbRow[];
};

export type GetColumnValuesResult = {
  values: AnyDict;
  missing: string[];
};

export enum UpdateExtensionStatusInWorkspaceResultStatus {
  OK,
  EXTENSION_NOT_FOUND,
}

export interface UpdateExtensionStatusInWorkspaceResult {
  status: UpdateExtensionStatusInWorkspaceResultStatus;
}

export interface WorkspaceExtension extends ExtensionDbRow {
  status: EntityStatus;
}

export const CustomFieldTargetTypeMap = {
  [CustomFieldTargetType.PROJECT]: TargetType.PROJECT,
  [CustomFieldTargetType.TASK]: TargetType.TASK,
};

export enum ExtensionNamespace {
  TRELLO_DATA_IMPORT = 'trello-data-import',
  TASK_VOTING = 'task-voting',
  AGILE = 'agile',
  CALENDAR_SYNC = 'calendar-sync',
  INTERNAL_CALENDAR = 'internal-calendar',
  HANGOUTS_LINK = 'hangouts-link',
  TASK_RECURRENCE = 'task-recurrence',
  CHAT_WITH_ME = 'chat-with-me',
  PROJECT_GROUPS = 'project-groups-and-order',
  KANBAN_LIMITS = 'kanban-limits',
  TIMECAMP = 'timecamp',
}

export type CustomFieldName =
  | 'estimatesEnabled'
  | 'votingEnabled'
  | 'enabledStatus'
  | 'estimatedEffort'
  | 'syncToken'
  | 'estimatesEnabled'
  | 'isInvitedFromLink'
  | 'inviterId'
  | 'inviteToken'
  | 'access_token';

export interface ExtensionQueryParams extends ResourceQueryParams {
  namespaces: string;
}

export interface WorkspaceExtensionContext {
  organizationId: Id;
}

export interface WorkspaceExtensionResourceData {
  extensions: WorkspaceExtension[];
}
