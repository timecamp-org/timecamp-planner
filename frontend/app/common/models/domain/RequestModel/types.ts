import { List, Map } from 'immutable';
import { AnyDict, Dict, ImmutableMap } from '../../../types';
import { Id } from '../../../utils/identifier';
import { ChecklistItemBasicData, ChecklistItemInterface } from '../ChecklistsModel/types';
import { EntityType } from '../EntityModel/types';
import { TaskListInterface } from '../ListsModel/types';
import { TaskInterface, TaskPeopleRole } from '../TasksModel/types';

import { ProjectMetadataType, ProjectTasksMetadataType } from '../ProjectsModel/types';
import { TaskTimeEstimate } from '../TaskTimeEstimateModel/models';

export type ProjectViewQueryParams = {
  fetchArchived: boolean;
};

export enum APIResultStatus {
  OK = 0,
}

export enum RequestError {
  FETCH_ERROR = 'FETCH_ERROR',
}

export enum RequestStatus {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum ResponseCode {
  RESOURCE_NOT_FOUND = 404,
  FORBIDDEN = 403,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
}

export interface RoleItemInterface<T> {
  userId: Id;
  role: T;
}

export interface ProjectViewDataInterface {
  lists: TaskListInterface[];
  listFollowers: Dict<Id[]>;
  tasks: TaskInterface[];
  taskPeople: Dict<RoleItemInterface<TaskPeopleRole>[]>;
  taskFollowers: Dict<Id[]>;
  taskTagIds: Dict<Id[]>;
  taskTimeEstimates: TaskTimeEstimate[];
  extensionsData: Dict<AnyDict[]>;
  projectFollowers: Id[];
  checklistsItemsBasicData: ChecklistItemBasicData[];
  ClearReques;
}

export interface ConversationViewDataInterface {
  lists: TaskListInterface[];
  listFollowers: Dict<Id[]>;
  tasks: TaskInterface[];
  taskPeople: Dict<RoleItemInterface<TaskPeopleRole>[]>;
  taskFollowers: Dict<Id[]>;
  taskTagIds: Dict<Id[]>;
  extensionsData: Dict<AnyDict[]>;
  projectsFollowers: Dict<Id[]>;
}

export interface ParsedProjectViewDataInterface {
  normalizedListsData: NormalizedList;
  listFollowers: Map<Id, List<Id>>;
  listsOrderByProjectId: Map<Id, Map<Id, number>>;
  tasksData: Map<Id, TaskInterface>;
  tasksOrderByListId: Map<Id, Map<Id, number>>;
  taskTimeEstimatesByTaskId: Map<Id, TaskTimeEstimate>;
  projectIdsByTaskIds: Map<Id, Id>;
  taskPeopleIds: Map<Id, List<Id>>;
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>;
  listIdByTaskId: Map<Id, Id>;
  taskFollowerIds: Map<Id, List<Id>>;
  taskTagIds: Map<Id, List<Id>>;
  taskReactions: Map<Id, Map<Id, string>>;
  listLimits: Map<Id, number>;
  checklistItemsData: Map<Id, ChecklistItemInterface>;
  checklistsByTaskId: Map<Id, List<Id>>;
  taskIdByChecklistItemId: Map<Id, Id>;
  projectFollowerIds: List<Id>;
}

export interface ParsedConversationViewDataInterface {
  normalizedListsData: NormalizedList;
  listFollowers: Map<Id, List<Id>>;
  listsOrderByProjectId: Map<Id, Map<Id, number>>;
  tasksData: Map<Id, TaskInterface>;
  tasksOrderByListId: Map<Id, Map<Id, number>>;
  projectIdsByTaskIds: Map<Id, Id>;
  taskPeopleIds: Map<Id, List<Id>>;
  taskPeopleRole: Map<Id, Map<Id, TaskPeopleRole>>;
  listIdByTaskId: Map<Id, Id>;
  taskFollowerIds: Map<Id, List<Id>>;
  taskTagIds: Map<Id, List<Id>>;
  taskReactions: Map<Id, Map<Id, string>>;
  projectsFollowerIds: Map<Id, List<Id>>;
}

export interface NormalizedTasksDataInterface {
  tasksData: Map<Id, TaskInterface>;
  tasksOrderByListId: Map<Id, Map<Id, number>>;
  listIdByTaskId: Map<Id, Id>;
  projectIdsByTaskIds: Map<Id, Id>;
  taskFollowerIds?: List<Id>;
  taskTagIds?: Map<Id, List<Id>>;
  taskPeopleIds?: Map<Id, List<Id>>;
  taskPeopleRole?: Map<Id, Map<Id, TaskPeopleRole>>;
  checklistItemsData?: Map<Id, ChecklistItemInterface>;
  checklistsByTaskId?: Map<Id, List<Id>>;
  taskIdByChecklistItemId?: Map<Id, Id>;
}

export interface NormalizedList {
  names: Map<Id, string>;
  orders: Map<Id, number>;
  isArchivedStatuses: Map<Id, boolean>;
  projectIdsByListIds: Map<Id, Id>;
}
export interface NormalizedListsDataInterface {
  normalizedListsData: NormalizedList;
  listsOrderByProjectId: Map<Id, Map<Id, number>>;
  listFollowers?: List<Id>;
}

export interface ParsedObjectPeopleInterface<T> {
  peopleIds: Map<Id, List<Id>>;
  peopleRole: Map<Id, Map<Id, T>>;
}

export interface ParsedPeopleInterface<T> {
  peopleIds: List<Id>;
  peopleRole: Map<Id, T>;
}

export interface RequestsState extends ImmutableMap<string, any> {
  status: Map<Id, RequestStatus>;
  data: Map<Id, AnyDict>;
  error: Map<Id, Error>;
  count: Map<Id, number>;
  dirty: Id[];
  timestamp: Map<Id, number>;
  containerAccessLossTimestamp: Map<EntityType, Map<Id, number>>;
}

export interface LatestVisitedTasksInterface {
  tasksData: Map<Id, TaskInterface>;
  projectIdsByTaskIds: Map<Id, Id>;
  listIdByTaskId: Map<Id, Id>;
  tasksOrderByListId: Map<Id, Map<Id, number>>;
  taskLatestVisit: Map<Id, Date>;
  projectIdsByListIds: Map<Id, Id>;
}

export interface ResourceQueryParams<TMetadata = AnyDict, TField = string> {
  page?: string;
  since?: number;
  before?: number;
  limit?: number;
  metadata?: TMetadata[];
  fields?: TField[];
}

export interface ProjectTasksQueryParams extends ResourceQueryParams<ProjectTasksMetadataType> {
  organizationId?: Id;
  fetchArchived: boolean;
}

export interface ConversationViewDataQueryParams extends ResourceQueryParams {
  fetchArchived: boolean;
}

export interface ProjectQueryParams extends ResourceQueryParams<ProjectMetadataType> {}
