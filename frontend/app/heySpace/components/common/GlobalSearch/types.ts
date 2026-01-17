import { Id } from 'common/utils/identifier';
import { EntityStatus, EntityType } from 'models/domain/EntityModel/types';
import { ProjectType } from 'models/domain/ProjectsModel/types';
import { TaskPriorityTypes, TaskStatus } from 'models/domain/TasksModel/types';
import { RegistrationStatus } from 'models/domain/UsersModel/types';

export enum GlobalSearchResource {
  ALL = '',
  MESSAGE = 'message',
  TASK = 'task',
  PROJECT = 'project',
  FILE = 'file',
  USER = 'user',
}

interface MessageResultInterface {
  containerId: string;
  containerType: EntityType;
  content: string;
  createdAt: number;
  editedAt: number;
  editorId: number;
  id: Id;
  organizationId: Id;
  senderId: Id;
}

interface TaskResultInterface {
  id: Id;
  creatorId: Id;
  projectId: Id;
  sourceMessageId: Id;
  taskListId: Id;
  description: string;
  dueDate?: number;
  isArchived: boolean;
  name: string;
  progress: number;
  startDate: number;
  status: TaskStatus;
  taskPriorityType: TaskPriorityTypes;
}

interface ProjectResultInterface {
  id: Id;
  creatorId: Id;

  color: string;
  description: string;
  dueDate: number;
  iconType: string;
  isArchived: boolean;
  isPrivate: boolean;
  name: string;
  organizationId: Id;
  projectType: ProjectType;
  startDate: number;
  status: EntityStatus;
}

interface FileResultInterface {
  id: Id;
  url: string;
}

interface UserResultInterface {
  id: Id;
  avatarUrl?: string;
  createdAt: number;
  email: string;
  firstName: string;
  isBot: boolean;
  lastName: string;
  modifiedAt: number;
  nickname?: string;
  registrationStatus: RegistrationStatus;
  status: EntityStatus;
}

export type ResultEntity =
  | MessageResultInterface
  | TaskResultInterface
  | ProjectResultInterface
  | FileResultInterface
  | UserResultInterface;

export interface SearchResultInterface {
  entityType: GlobalSearchResource;
  id: string;
  entity: ResultEntity;
}

export interface GlobalSearchResponse {
  nextPage?: string;
  results: SearchResultInterface[];
}

export type MessageSearchResponse = {
  containerId: Id;
  content: string;
  createdAt: number;
  editedAt: number;
  editorId: Id;
  id: Id;
  isLinkPreviewEnabled: boolean;
  organizationId: Id;
  senderId: Id;
}[];
