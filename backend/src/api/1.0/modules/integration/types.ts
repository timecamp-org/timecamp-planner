import { Id } from '../common/identifier';
import { ProjectDbRow, ListDbRow, TaskDbRow, TagDbRow, TaskHasTagDbRow, UserInProjectDbRow, ChecklistItemDbRow, TaskStatus } from '../db/schema';
import { JobInterface } from '../messageQueue/types';

export enum IntegrationStatus {
  IN_PROGRESS = 'inProgress',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export type EntityInternalIdByExternalId = {
  [externalId: string]: Id,
}

export enum ExternalEntityType {
  TASK, LIST, PROJECT, TAG
}

export type EntitiesInternalIdByExternalId = {
  [ExternalEntityType.TAG]: EntityInternalIdByExternalId,
  [ExternalEntityType.TASK]: EntityInternalIdByExternalId,
  [ExternalEntityType.LIST]: EntityInternalIdByExternalId,
  [ExternalEntityType.PROJECT]: EntityInternalIdByExternalId,
}

export type ExternalEntity = {
  id: string,
}

export type ExternalEntityIdByExternalEntityId = {
  [externalId: string]: string,
}

export type ExternalEntitiesIdsByExternalEntityId = {
  [externalId: string]: string[],
}

export type ExternalTag = {
  name: string,
}

export type ExternalEntityIdsByExternalEntityId = {
  [externalId: string]: Id[],
}

export type ExternalEntities = {
  externalProjects: Partial<ProjectDbRow>[],
  externalLists: Partial<ListDbRow>[],
  externalTasks: Partial<TaskDbRow>[],
  externalChecklists: any[],
  externalTags: Partial<TagDbRow>[],
  externalTagIdsByExternalTaskId: ExternalEntityIdsByExternalEntityId,
  projectsPeople: UserInProjectDbRow[],
}

export type InternalProjectsData = {
  internalProjects: ProjectDbRow[],
  newProjectInternalIdByExternalId: EntityInternalIdByExternalId,
}

export type InternalListsData = {
  internalLists: ListDbRow[],
  newListInternalIdByExternalId: EntityInternalIdByExternalId,
}

export type InternalTasksData = {
  internalTasks: TaskDbRow[],
  newTaskInternalIdByExternalId: EntityInternalIdByExternalId,
}

export type NewInternalEntities = {
  newProjects: ProjectDbRow[],
  newLists: ListDbRow[],
  newTasks: TaskDbRow[],
  newTags: TagDbRow[],
  newTaskTags: TaskHasTagDbRow[],
  newChecklistItems: ChecklistItemDbRow[],
  newProjectsPeople: UserInProjectDbRow[],
}

export type ExternalChecklist = {
  id: string,
  name: string,
  projectId: string,
  taskId: string,
  order: number,
  checklistItems: Partial<ChecklistItemDbRow>[],
}

export interface DefaultTask extends Partial<TaskDbRow> {
  name: string,
  isArchived: boolean,
  status: TaskStatus,
}

export interface DefaultList extends Partial<ListDbRow> {
  name: string,
  isArchived: boolean,
  creatorId: string
}

export interface DefaultProject extends Partial<ProjectDbRow> {
  name: string;
  creatorId: Id;
}

export type IntegrationResult = {
  status: IntegrationResultStatus,
}

export enum IntegrationResultStatus {
  OK, INTEGRATION_ALREADY_IN_PROGRESS
}

export enum DataImportQueueType {
  TRELLO = 'trello_data_import',
  TRELLO_DELAYED = 'trello_data_import_delayed',
}

export interface DataImportJobInterface<T> extends JobInterface<T> {
  userId: Id,
  organizationId: Id,
  extensionId: Id,
}

export enum HandleRateLimitStatus {
  RATE_LIMIT_VIOLATED,
  RATE_LIMIT_UNTOUCHED
}

export interface HandleRateLimitResult {
  status: HandleRateLimitStatus,
}

export interface IntegrationDescriptor {
  extensionId: Id,
  userId: Id,
  organizationId: Id,
}

export enum APIRateLimitDelay {
  TRELLO = 10000,
}

export type IntegrationRateLimitDelay = {
  [jobDescriptor: string]: Date
}

export enum FetchExternalDataResultStatus {
  OK,
  RATE_LIMIT_VIOLATED,
  UNAUTHORIZED,
}

export type FetchExternalDataResult<R> = {
  status: FetchExternalDataResultStatus,
  result?: R,
}

export enum WorkerHandleStatus {
  OK,
  FAILED,
  UNAUTHORIZED,
}

export type WorkerHandleResult = {
  status: WorkerHandleStatus,
  error?: Error
}
