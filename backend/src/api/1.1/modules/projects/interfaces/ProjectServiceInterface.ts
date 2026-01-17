import { ProjectDbRow, UserInProjectDbRow } from '../../db/schema';
import {
  CreateProjectResult,
  ProjectsHaveUnreadMessagesResult,
  UpdateProjectResult,
  GetUserProjectsResult,
  GetUserArchivedProjectsViewDataResult,
  CopySpaceOptions,
  ProjectJson,
  CopySpaceResult,
  UpdateProjectEventData,
  GetProjectWithMetadataResult,
  ProjectQueryParams,
  SetProjectLatestVisitResult,
  GetProjectAttachmentsResult,
  CreateProjectFileResult,
} from '../types';
import { Id } from '../../common/identifier';
import { QueryModifier } from '../../../../../services/types';
import { EventDelegate } from '../../../../../utils/EventDelegate';

export interface ProjectServiceInterface {
  getProject(id, trx?: Transaction): PromiseLike<ProjectDbRow>;

  createProject(id: Id, userId: Id, projectJson: ProjectJson, trx?: Transaction): PromiseLike<CreateProjectResult>;

  createProjectWithPeople(
    id: Id,
    userId: Id,
    projectJson: ProjectJson,
    projectPersons: UserInProjectDbRow[]
  ): PromiseLike<CreateProjectResult>;

  updateProject(id, projectJson, actorId?: Id): PromiseLike<UpdateProjectResult>;

  getUserProjectsUnreadMessages(userId: Id): PromiseLike<ProjectsHaveUnreadMessagesResult>;

  getUserProjects(
    organizationId: Id,
    userId: Id,
    decorate?: QueryModifier,
    withConversations?: boolean
  ): PromiseLike<GetUserProjectsResult>;

  getUserArchivedProjectsViewData(organizationId: Id, userId: Id): PromiseLike<GetUserArchivedProjectsViewDataResult>;

  createProjects(projects: ProjectDbRow[], trx?: Transaction): PromiseLike<void>;

  copySpaceWithChildren(
    projectId: Id,
    userId: Id,
    name: string,
    options?: CopySpaceOptions
  ): PromiseLike<CopySpaceResult>;

  hasUserAccessToProject(userId: Id, projectId: Id, projectDbRow?: ProjectDbRow): PromiseLike<boolean>;

  updateProjectEvent: EventDelegate<UpdateProjectEventData>;

  getProjectIdsInOrganizationWithUnreadMessages(organizationId: Id, userId: Id): PromiseLike<Id[]>;

  getProjectWithMetadata(id: Id, queryParams: ProjectQueryParams): PromiseLike<GetProjectWithMetadataResult>;

  setProjectLatestVisit(userId: Id, projectId: Id): Promise<SetProjectLatestVisitResult>;

  getInitialProjectId(userId: Id, organizationId: Id): Promise<Id>;

  getProjectAttachments(projectId: Id): Promise<GetProjectAttachmentsResult>;

  createProjectFile(projectId: string, fileId: string, userId: string): Promise<CreateProjectFileResult>;
}
