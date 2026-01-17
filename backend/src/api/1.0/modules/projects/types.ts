import { Id } from '../common/identifier';

import {
  ProjectDbRow,
  ProjectType,
  ListDbRow,
  TaskDbRow,
  UserInProjectDbRow,
  ProjectRole,
} from '../db/schema';
import { OrganizationProjectsPeople } from '../organizations/types';
import { EntityStatus } from '../common/enum';
import { CopyListOptions } from '../lists/types';
import { TaskPeopleMap, TaskTagsMap, TaskFollowersMap } from '../tasks/types';
import { ResourceQueryParams } from '../../../../infrastructure/resources/types';
import { CustomFieldValuesMap } from '../extensions/types';
import { JobInterface } from '../messageQueue/types';

export interface Result {
  status: ResultStatus;
  id?: Id;
  data?: any;
  error?: string;
}

export type ProjectJson = {
  id?: Id;
  organizationId: Id;
  status?: EntityStatus;
  name?: string;
  description?: string;
  projectType?: ProjectType;
  creatorId?: Id;
  isArchived?: boolean;
  isPrivate?: boolean;
  color?: string;
  startDate?: number;
  dueDate?: number;
};

export type UserInProjectJson = {
  id?: Id;
  userId: Id;
  projectId: Id;
  role: ProjectRole;
};

export type GuestInProjectJson = {
  id?: Id;
  userInOrganizationId: Id;
  userInProjectId: Id;
  organizationId: Id;
};

export enum ProjectPanelType {
  CHAT = 'chat',
  KANBAN = 'kanban',
  CALENDAR = 'calendar',
}

export interface ProjectSettingsJson {
  lastOpenedPanel?: ProjectPanelType;
  isRightPanelOpened?: boolean;
}

export enum SetUserProjectSettingsStatus {
  OK,
  USER_NOT_FOUND,
  PROJECT_NOT_FOUND,
}

export interface SetUserProjectSettingsResult {
  status: SetUserProjectSettingsStatus;
}

export enum ResultStatus {
  OK,
  PROJECT_NOT_FOUND,
  PROJECT_PEOPLE_NOT_FOUND,
  USER_ALREADY_IN_PROJECT,
  USER_NOT_FOUND,
  USER_ALREADY_FOLLOWING_PROJECT,
  PROJECT_FOLLOWER_NOT_FOUND,
}

export enum CreateProjectStatus {
  OK,
  PROJECT_ALREADY_EXISTS,
  ORGANIZATION_NOT_FOUND,
}

export enum UpdateProjectStatus {
  OK,
  PROJECT_NOT_FOUND,
}

export type CreateProjectResult = {
  status: CreateProjectStatus;
  project?: ProjectDbRow;
};

export type UpdateProjectResult = {
  status: UpdateProjectStatus;
};

export enum GetProjectWithMetadataStatus {
  OK,
  PROJECT_NOT_FOUND,
}

export type GetProjectWithMetadataResult = {
  status: GetProjectWithMetadataStatus;
  data?: ProjectResourceData;
};

export interface ProjectsFollowersMap {
  [projectId: string]: Id[];
}

export enum ProjectsHaveUnreadMessagesResultStatus {
  OK,
}

export interface ProjectsHaveUnreadMessages {
  [projectId: string]: boolean;
}
export interface OrganizationIdByProjectId {
  [projectId: string]: Id;
}

export interface ProjectsHaveUnreadMessagesResult {
  status: ProjectsHaveUnreadMessagesResultStatus;
  projectsHaveUnreadMessages: ProjectsHaveUnreadMessages;
  organizationIdByProjectId: OrganizationIdByProjectId;
}

export interface ProjectIdsByListIds {
  [listId: string]: Id;
}

export type RemoveProjectFollowerEventData = {
  projectId: Id;
  userId: Id;
  trx: Transaction;
};

export type UpdateProjectEventData = {
  projectId: Id;
  projectJson: ProjectJson;
  trx: Transaction;
  projectBeforeUpdate: ProjectDbRow;
};

export type RemoveProjectMemberEventData = {
  projectId: Id;
  userId: Id;
  trx: Transaction;
  actorId?: Id;
};

export type AddProjectMemberEventData = {
  projectId: Id;
  userId: Id;
  trx: Transaction;
  actorId?: Id;
};

export enum AddProjectPersonStatus {
  OK,
  USER_ALREADY_IN_PROJECT,
  PROJECT_NOT_FOUND,
  USER_NOT_FOUND,
}

export type AddProjectPersonResult = {
  status: AddProjectPersonStatus;
};

export enum AddProjectPersonsStatus {
  OK,
  USER_ALREADY_IN_PROJECT,
  PROJECT_NOT_FOUND,
  USER_NOT_FOUND,
}

export type AddProjectPersonsResult = {
  status: AddProjectPersonsStatus;
};

export enum GetProjectPersonsStatus {
  OK,
  PROJECT_NOT_FOUND,
}

export type GetProjectPersonsResult = {
  status: GetProjectPersonsStatus;
  projectPeople?: UserInProjectDbRow[];
};

export enum UpdateProjectPeopleRoleStatus {
  OK,
  PROJECT_PEOPLE_NOT_FOUND,
}

export type UpdateProjectPeopleRoleResult = {
  status: UpdateProjectPeopleRoleStatus;
};

export enum DeleteProjectPeopleRoleStatus {
  OK,
  PROJECT_PEOPLE_NOT_FOUND,
}

export type DeleteProjectPeopleRoleResult = {
  status: DeleteProjectPeopleRoleStatus;
};

export enum GetProjectTasksWithMetadataStatus {
  OK,
  PROJECT_NOT_FOUND,
}

export interface ProjectTasksResourceData {
  tasks: TaskDbRow[];
  taskPeople?: TaskPeopleMap;
  taskTags?: TaskTagsMap;
  taskFollowerIds?: TaskFollowersMap;
}

export interface ProjectResourceData {
  project: ProjectDbRow;
  projectPeople?: UserInProjectDbRow[];
  projectFollowers?: Id[];
  customFields?: CustomFieldValuesMap;
}

export type GetProjectTasksWithMetadataResult = {
  status: GetProjectTasksWithMetadataStatus;
  data?: ProjectTasksResourceData;
};

export enum ProjectTasksMetadataType {
  PEOPLE = 'taskPeople',
  FOLLOWERS = 'taskFollowerIds',
  TAGS = 'taskTags',
  CHECKLIST = 'taskChecklist',
}

export enum ProjectMetadataType {
  PEOPLE = 'projectPeople',
  FOLLOWERS = 'projectFollowerIds',
  CUSTOM_FIELDS = 'customFields',
}

export interface ProjectQueryParams extends ResourceQueryParams {}

export interface ProjectTasksResourceContext {
  project: ProjectDbRow;
  taskIds?: Id[];
}

export interface ProjectResourceContext {
  projectId: Id;
}

export enum AddProjectFollowerStatus {
  OK,
  USER_ALREADY_FOLLOWING_PROJECT,
  PROJECT_NOT_FOUND,
  USER_NOT_FOUND,
}

export type AddProjectFollowerResult = {
  status: AddProjectFollowerStatus;
};

export enum RemoveProjectFollowerStatus {
  OK,
  PROJECT_FOLLOWER_NOT_FOUND,
}

export type RemoveProjectFollowerResult = {
  status: RemoveProjectFollowerStatus;
};

export enum UpdateConversationSettingsResultStatus {
  OK,
  PROJECT_NOT_FOUND,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
}

export type UpdateConversationSettingsResult = {
  status: UpdateConversationSettingsResultStatus;
};

export enum GetUserProjectsStatus {
  OK,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
}

export type GetUserProjectsResult = {
  status: GetUserProjectsStatus;
  projects?: Array<ProjectDbRow>;
};

export enum GetUserArchivedProjectsViewDataStatus {
  OK,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
}

export type GetUserArchivedProjectsViewDataResult = {
  status: GetUserArchivedProjectsViewDataStatus;
  projects?: ProjectDbRow[];
  projectsPeople?: OrganizationProjectsPeople;
};

export enum DeleteGuestFromAllSpacesStatus {
  OK,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
  FORBIDDEN,
}

export type DeleteGuestFromAllSpacesResult = {
  status: DeleteGuestFromAllSpacesStatus;
};

export interface CopySpaceOptions extends CopyListOptions {}

export enum CopySpaceStatus {
  OK,
  PROJECT_NOT_FOUND,
}

export type CopySpaceResult = {
  status: CopySpaceStatus;
};

export type ProjectRelatedSourceData = {
  project: ProjectDbRow;
  projectLists: ListDbRow[];
};

export enum AddGuestInProjectStatus {
  OK,
  PROJECT_NOT_FOUND,
  GUEST_ALREADY_IN_PROJECT,
  ORGANIZATION_NOT_FOUND,
}

export type AddGuestInProjectResult = {
  status: AddGuestInProjectStatus;
};

export enum RemoveGuestInProjectStatus {
  OK,
  NOT_FOUND,
  PROJECT_NOT_FOUND,
}

export type RemoveGuestInProjectResult = {
  status: RemoveGuestInProjectStatus;
};

export enum ProjectsQueueType {
  PROJECTS = 'projects',
}

export enum ProjectsJobType {
  DETERMINE_ORDER_FOR_UNARCHIVED_SPACE = 'determine_order_for_unarchived_space',
}

export type ProjectsJobInterface = JobInterface<ProjectsJobType>;

export enum SetProjectLatestVisitStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  USER_NOT_IN_PROJECT,
  PROJECT_NOT_FOUND,
}

export interface SetProjectLatestVisitResult {
  status: SetProjectLatestVisitStatus;
}
