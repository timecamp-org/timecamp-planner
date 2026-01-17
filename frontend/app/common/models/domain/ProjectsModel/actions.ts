import { ProjectIconTypes } from 'commonComponents/ColoredProjectIcon/BaseProjectIcon';
import { List, Map } from 'immutable';
import { action } from 'typesafe-actions';
import { Dict, PayloadAction } from '../../../types';
import { Id } from '../../../utils/identifier';
import { ActionResultInterface } from '../ActionResultModel';
import { EntityInterface, EntityStatus } from '../EntityModel/types';
import { Project } from '../ProjectsModel/models';
import { ProjectQueryParams } from '../RequestModel/types';
import * as C from './constants';
import {
  OnCreateProjectFilesPayload,
  OnDebounceRefetchProjectFilesPayload,
  OnGetOrganizationProjectsPayload,
  OnSetProjectLatestVisitPayload,
  OnUploadProjectFilePayload,
} from './payloads';
import {
  ConversationVisibilityInterface,
  OrganizationProjectsData,
  OrganizationProjectsQueryParams,
  ProjectInterface,
  ProjectPeopleRole,
} from './types';

const emptyList = List();
const emptyMap = Map();

export const onFetchProject = (projectId: Id, queryParams?: ProjectQueryParams) =>
  action(C.onFetchProject, { projectId, queryParams });

export const onFetchProjectSuccess = (
  project: ProjectInterface,
  peopleIds: List<Id>,
  peopleRole: Map<Id, ProjectPeopleRole>,
) => action(C.onFetchProjectSuccess, { project, peopleIds, peopleRole });

export const onProjectCreate = (
  projectFields: Partial<ProjectInterface>,
  projectPeople: Id[] | List<Id>,
  isConversation: boolean = false,
  callback: CallableFunction = undefined,
) => action(C.onProjectCreate, { projectFields, projectPeople, isConversation, callback });

export const onProjectCreateSuccess = (actionResult: ActionResultInterface) =>
  action(C.onProjectCreateSuccess, actionResult);

export const onNameUpdate = (projectId: Id, name: string) => action(C.onNameUpdate, { projectId, name });

export const onDescriptionUpdate = (projectId: Id, description: string) =>
  action(C.onDescriptionUpdate, { projectId, description });

export const onColorUpdate = (projectId: Id, color: string) => action(C.onColorUpdate, { projectId, color });

export const onBackgroundUpdate = (projectId: Id, backgroundImageUrl: string) =>
  action(C.onBackgroundUpdate, { projectId, backgroundImageUrl });

export const onIconTypeUpdate = (projectId: Id, iconType: ProjectIconTypes) =>
  action(C.onIconTypeUpdate, { projectId, iconType });

export const onStatusUpdate = (projectId: Id, status: EntityStatus, ignoreDebounce?: boolean) =>
  action(C.onStatusUpdate, { projectId, status, ignoreDebounce });

export const onProjectUpdate = (projectId: Id, projectFields: Partial<ProjectInterface>, ignoreDebounce?: boolean) =>
  action(C.onProjectUpdate, { projectId, projectFields, ignoreDebounce });

export const onProjectUpdateSuccess = (actionResult: ActionResultInterface) =>
  action(C.onProjectUpdateSuccess, actionResult);

export const onMemberAdd = (projectId: Id, userId: Id, role: ProjectPeopleRole) =>
  action(C.onMemberAdd, { projectId, userId, role });

export const onMemberUpdate = (projectId: Id, userId: Id, role: ProjectPeopleRole) =>
  action(C.onMemberUpdate, { projectId, userId, role });

export const onMemberRemove = (projectId: Id, userId: Id) => action(C.onMemberRemove, { projectId, userId });

export const onRemoveGuestFromAllSpaces = (userId: Id) => action(C.onRemoveGuestFromAllSpaces, { userId });

export const onBatchProjects = (entities: ProjectInterface[]) => {
  let projectsData = Map();
  let projectOrganizationIds = Map();
  entities.forEach((entity) => {
    const projectRecord = Project(entity);
    projectsData = projectsData.set(entity.id, projectRecord);
    projectOrganizationIds = projectOrganizationIds.set(entity.id, entity.organizationId);
  });
  return action(C.onBatchProjects, { projectsData, projectOrganizationIds });
};

export const onCreateProjectData = (project: ProjectInterface) =>
  action(C.onCreateProjectData, {
    project: Project(project),
    organizationId: project.organizationId,
  });

export const onUpdateProjectData = (project: ProjectInterface) =>
  action(C.onUpdateProjectData, {
    project,
    organizationId: project.organizationId,
  });

export const onCreateProjectPeopleIds = (projectId: Id, peopleIds: Id[]) =>
  action(C.onCreateProjectPeopleIds, {
    projectId,
    projectPeople: List(peopleIds),
  });

export const onUpdateProjectPeopleIds = (projectId: Id, peopleIds: Id[]) =>
  action(C.onUpdateProjectPeopleIds, {
    projectId,
    projectPeople: List(peopleIds),
  });

export const onBatchProjectsPeopleIds = (projectPeople: Map<Id, List<Id>>) =>
  action(C.onBatchProjectsPeopleIds, {
    projectPeople,
  });

export const onCreateProjectPeopleRole = (projectId: Id, projectPeopleRole: Dict<ProjectPeopleRole>) =>
  action(C.onCreateProjectPeopleRole, {
    projectId,
    projectPeopleRole: Map(projectPeopleRole),
  });

export const onUpdateProjectPeopleRole = (projectId: Id, projectPeopleRole: Dict<ProjectPeopleRole>) =>
  action(C.onUpdateProjectPeopleRole, {
    projectId,
    projectPeopleRole: Map(projectPeopleRole),
  });

export const onRemoveProjectPerson = (entity: EntityInterface) => {
  const { userId } = entity.body;

  return action(C.onRemoveProjectPerson, {
    projectId: entity.entityId,
    userId,
  });
};

export const onAddProjectPerson = (entity: EntityInterface) => {
  const { userId, role } = entity.body;
  return action(C.onAddProjectPerson, {
    projectId: entity.entityId,
    userId,
    role,
  });
};

export const onUpdateProjectPerson = (entity: EntityInterface) => {
  const { userId, role } = entity.body;
  return action(C.onUpdateProjectPerson, {
    projectId: entity.entityId,
    userId,
    role,
  });
};

export const onUpdateProjectPeople = (entity: EntityInterface) => {
  const projectPeople = entity.body;
  let projectPeopleIds = emptyList;
  let projectPeopleRole = emptyMap;
  projectPeople.forEach((person) => {
    projectPeopleIds = projectPeopleIds.push(person.userId);
    projectPeopleRole = projectPeopleRole.set(person.userId, person.role);
  });
  return action(C.onUpdateProjectPeople, {
    projectId: entity.entityId,
    projectPeopleIds,
    projectPeopleRole,
  });
};

export const onUpdateProjectPeopleSuccess = (
  projectId: Id,
  projectPeopleIds: List<Id>,
  projectPeopleRole: Dict<ProjectPeopleRole>,
) =>
  action(C.onUpdateProjectPeopleSuccess, {
    projectId,
    projectPeopleIds,
    projectPeopleRole,
  });

export const onBatchProjectsPeopleRole = (projectPeopleRole: Map<Id, Map<Id, ProjectPeopleRole>>) =>
  action(C.onBatchProjectsPeopleRole, {
    projectPeopleRole,
  });

export const onAddProjectFollower = (entity: EntityInterface) => {
  const { userId } = entity.body;
  return action(C.onAddProjectFollower, {
    projectId: entity.entityId,
    userId,
  });
};

export const onRemoveProjectFollower = (entity: EntityInterface) => {
  const { userId } = entity.body;
  return action(C.onRemoveProjectFollower, {
    projectId: entity.entityId,
    userId,
  });
};

export const onUpdateProjectFollowerIds = (projectId: Id, projectFollowerIds: Id[]) =>
  action(C.onUpdateProjectFollowerIds, {
    projectId,
    projectFollowerIds: List(projectFollowerIds),
  });

export const onFollowerAdd = (projectId: Id, userId: Id) =>
  action(C.onFollowerAdd, {
    projectId,
    userId,
  });

export const onFollowerRemove = (projectId: Id, userId: Id) =>
  action(C.onFollowerRemove, {
    projectId,
    userId,
  });

export const onFollowerRemoveSuccess = (actionResult: ActionResultInterface) =>
  action(C.onFollowerRemoveSuccess, actionResult);

export const onCreateUserAndAddToSubscribers = (projectId: Id, email: string, role: ProjectPeopleRole, userId: Id) =>
  action(C.onCreateUserAndAddToSubscribers, { projectId, email, role, userId });

export const onUpdateProjectPrivacy = (projectId: Id, isPrivate: boolean) =>
  action(C.onUpdateProjectPrivacy, { projectId, isPrivate });

export const onSetSectionScrollTop = (sectionId: Id, scrollTop: number) =>
  action(C.onSetSectionScrollTop, { sectionId, scrollTop });

export const onSetKanbanScrollLeft = (projectId: Id, scrollLeft: number) =>
  action(C.onSetKanbanScrollLeft, { projectId, scrollLeft });

export const onSetIsConversationVisible = (conversationId: Id, isVisible: boolean) =>
  action(C.onSetIsConversationVisible, { conversationId, isVisible });

export const onSetIsConversationVisibleSuccess = (conversationId: Id, isVisible: boolean) =>
  action(C.onSetIsConversationVisibleSuccess, { conversationId, isVisible });

export const onBatchConversationsVisibility = (conversationsVisibility: Map<Id, boolean>) =>
  action(C.onBatchConversationsVisibility, { conversationsVisibility });

export const onCreateConversationVisibilityData = (conversationsVisibility: ConversationVisibilityInterface) =>
  action(C.onCreateConversationVisibilityData, { conversationsVisibility });

export const onCreateConversationIfDoesNotExist = (people: List<Id>, id?: Id) =>
  action(C.onCreateConversationIfDoesNotExist, { people, id });

export const onBatchProjectHasUnreadMessages = (projectsHaveUnreadMessages: Dict<boolean>) =>
  action(C.onBatchProjectHasUnreadMessages, {
    projectsHaveUnreadMessages: Map(projectsHaveUnreadMessages),
  });

export const onBatchOrganizationIdByProjectId = (organizationIdByProjectId: Dict<Id>) =>
  action(C.onBatchOrganizationIdByProjectId, {
    organizationIdByProjectId: Map(organizationIdByProjectId),
  });

export const onSetOrganizationIdByProjectId = (projectId: Id, organizationId: Id) =>
  action(C.onSetOrganizationIdByProjectId, { projectId, organizationId });

export const onSetProjectHasUnreadMessages = (projectId: Id, projectHasUnreadMessages: boolean) =>
  action(C.onSetProjectHasUnreadMessages, { projectId, projectHasUnreadMessages });

export const onSetProjectsHaveUnreadMessages = (projectIdsWithUnreadMessages: Id[]) =>
  action(C.onSetProjectsHaveUnreadMessages, { projectIdsWithUnreadMessages });

export const onAddFileIdToProjectFileIds = (fileId: Id, projectId: Id) =>
  action(C.onAddFileIdToProjectFileIds, { fileId, projectId });

export const onBatchProjectFileIds = (fileIds: List<Id>, projectId: Id) =>
  action(C.onBatchProjectFileIds, { fileIds, projectId });

export const onAddUsersToProject = (projectId: Id, userIds: List<Id>) =>
  action(C.onAddUsersToProject, { projectId, userIds });

export const onCopySpace = (projectId: Id, name: string) => action(C.onCopySpace, { projectId, name });

export const onGetOrganizationProjects = (
  params?: OrganizationProjectsQueryParams,
  fillWithDefaults: boolean = true,
): PayloadAction<OnGetOrganizationProjectsPayload> =>
  action(C.onGetOrganizationProjects, {
    params,
    fillWithDefaults,
  });

export const onGetOrganizationProjectsSuccess = (
  organizationProjectsData: OrganizationProjectsData,
): PayloadAction<OrganizationProjectsData> => action(C.onGetOrganizationProjectsSuccess, organizationProjectsData);

export const onGetOrganizationProjectsPeople = () => action(C.onGetOrganizationProjectsPeople);

export const onGetOrganizationProjectsHaveUnreadMessages = () => action(C.onGetOrganizationProjectsHaveUnreadMessages);

export const onGetConversationSettings = () => action(C.onGetConversationSettings);

export const onGetFirstProjectSuccess = (organizationId, projectId) =>
  action(C.onGetFirstProjectSuccess, {
    organizationId,
    projectId,
  });

export const onSetProjectLatestVisit = (projectId: Id): PayloadAction<OnSetProjectLatestVisitPayload> =>
  action(C.onSetProjectLatestVisit, { projectId });

export const onCreateProjectFiles = ({ projectId, files }): PayloadAction<OnCreateProjectFilesPayload> =>
  action(C.onCreateProjectFiles, { projectId, files });

export const onUploadProjectFile = (fileId, objectId, containerId): PayloadAction<OnUploadProjectFilePayload> =>
  action(C.onUploadProjectFile, { fileId, objectId, containerId });

export const onUploadProjectBackground = (fileId, objectId, containerId): PayloadAction<OnUploadProjectFilePayload> =>
  action(C.onUploadProjectBackground, { fileId, objectId, containerId });

export const onDebounceRefetchProjectFiles = (projectId): PayloadAction<OnDebounceRefetchProjectFilesPayload> =>
  action(C.onDebounceRefetchProjectFiles, { projectId });
