import { ProjectInGroupDbRow, UserProjectGroupDbRow } from '../db/schema';
import { Id } from '../common/identifier';
import { ResourceQueryParams } from '../../../../infrastructure/resources/types';

import { ProjectsJobInterface } from '../projects/types';

export enum UpdateOrganizationProjectOrderResultStatus {
  OK,
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  USER_NOT_IN_ORGANIZATION = 'USER_NOT_IN_ORGANIZATION',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
}

export interface UpdateOrganizationProjectOrderResult {
  status: UpdateOrganizationProjectOrderResultStatus
}

export enum CreatePersonalProjectGroupResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  USER_NOT_IN_ORGANIZATION = 'USER_NOT_IN_ORGANIZATION',
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  MALFORMED_REQUEST_CONTENT = 'MALFORMED_REQUEST_CONTENT',
}

export interface CreatePersonalProjectGroupResult {
  status: CreatePersonalProjectGroupResultStatus,
  groupId?: Id,
}

export type ProjectGroupJson = Partial<UserProjectGroupDbRow>

export interface UpdatePersonalProjectGroupResult {
  status: UpdatePersonalProjectGroupResultStatus
}

export enum UpdatePersonalProjectGroupResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  USER_NOT_IN_ORGANIZATION = 'USER_NOT_IN_ORGANIZATION',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
}

export enum DeletePersonalProjectGroupResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  USER_NOT_IN_ORGANIZATION = 'USER_NOT_IN_ORGANIZATION',
  PROJECT_GROUP_NOT_FOUND = 'PROJECT_GROUP_NOT_FOUND',
}

export interface DeletePersonalProjectGroupResult {
  status: DeletePersonalProjectGroupResultStatus,
}

export type DeleteProjectGroupEventData = {
  groupId: Id,
  trx: Transaction,
}

export enum ProjectPersonalContainerType {
  LOOSE = 'loose',
  GROUP = 'group',
}

export interface ProjectPersonalStructureResourceQueryParams
  extends ResourceQueryParams { }

export interface ProjectPersonalStructureResourceContext {
  userId: Id,
  organizationId: Id,
}

export interface ProjectPersonalStructureResourceData {
  projectOrder: ProjectOrderMap
  projectGroups?: GroupMap
}

export interface ProjectOrderMap {
  [projectId: string]: StructuredProject,
}

export interface StructuredProject {
  order: number,
  containerType: ProjectPersonalContainerType,
  containerId?: Id,
}

interface GroupMap {
  [groupId: string]: UserProjectGroupDbRow
}

export interface DetermineOrderForUnarchivedSpaceJobInterface extends ProjectsJobInterface {
  projectId: Id,
  organizationId: Id,
  lastUserId?: Id,
}

export interface PersonalProjectOrderJson {
  userId: Id,
  organizationId: Id,
  projectId: Id,
  order: number,
  targetContainerType: ProjectPersonalContainerType,
  targetContainerId?: Id,
}

export type ProjectInGroupJson = Partial<ProjectInGroupDbRow>

