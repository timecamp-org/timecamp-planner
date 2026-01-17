import { List, Map } from 'immutable';
import { TypedRecord } from 'typed-immutable-record';
import { i18mark } from '../../../i18n';
import { BaseQueryFieldValue, ImmutableMap } from '../../../types';
import { Id } from '../../../utils/identifier';
import { EntityStatus } from '../EntityModel/types';
import { CustomFieldsMap } from '../ExtensionsModel/types';
import { ResourceQueryParams } from '../RequestModel/types';

export enum ProjectType {
  PROJECT = 'project',
  DIRECT_CHAT = 'direct-chat',
  GROUP_CHAT = 'group-chat',
}

export enum ProjectPeopleRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  MEMBER = 'member',
}

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

export interface UserInProject {
  userId: Id;
  role: ProjectPeopleRole;
  projectId: Id;
}

export const projectRoleLabels = {
  [ProjectPeopleRole.OWNER]: i18mark('Project Owner'),
  [ProjectPeopleRole.MANAGER]: i18mark('Manager'),
  [ProjectPeopleRole.MEMBER]: i18mark('Member'),
};

export interface ProjectInterface {
  id: Id;
  status: EntityStatus;
  name: string;
  color: string;
  description: string;
  projectType: ProjectType;
  organizationId: Id;
  isPrivate: boolean;
  autoJoin: boolean;
  iconType: string;
  backgroundImageUrl?: string;
}

export interface ProjectRecordInterface extends TypedRecord<ProjectRecordInterface>, ProjectInterface {}

export type ProjectsData = Map<Id, ProjectRecordInterface>;
export type ProjectsPeople = Map<Id, List<Id>>;
export type ProjectsPeopleRole = Map<Id, ProjectRole>;
export type ProjectRole = Map<Id, ProjectPeopleRole>;

export interface BaseConversationDescriptorInterface {
  conversationId?: Id;
  projectId: Id;
  type: ProjectType;
  name: string;
  lastConversationMessageCreatedAt?: number;
}

export interface BaseConversationDescriptorRecordInterface
  extends TypedRecord<BaseConversationDescriptorRecordInterface>,
    BaseConversationDescriptorInterface {}

export interface ConversationDescriptorInterface extends BaseConversationDescriptorInterface {
  people?: List<Id>;
  isGuestConversation?: boolean;
}

export interface ConversationDescriptorRecordInterface
  extends TypedRecord<ConversationDescriptorRecordInterface>,
    ConversationDescriptorInterface {}

export interface QuickSwitcherChatDescriptorInterface extends BaseConversationDescriptorInterface {
  isCurrentUserSpaceMember?: boolean;
}

export interface QuickSwitcherChatDescriptorRecordInterface
  extends TypedRecord<QuickSwitcherChatDescriptorRecordInterface>,
    QuickSwitcherChatDescriptorInterface {}

export interface ConversationVisibilityInterface {
  conversationHash: Id;
  isVisible: boolean;
  organizationId: Id;
  userId: Id;
}

export interface ProjectsState extends ImmutableMap<string, any> {
  projectsData: Map<Id, ProjectInterface>;
  projectPeople: Map<Id, List<Id>>;
  projectPeopleRole: Map<Id, Map<Id, ProjectPeopleRole>>;
  projectFollowerIds: Map<Id, List<Id>>;
  projectOrganizationIds: Map<Id, List<Id>>;
  sectionsScrollTop: Map<Id, number>;
  kanbanScrollLeft: Map<Id, number>;
  isConversationVisible: Map<Id, boolean>;
  projectsHaveUnreadMessages: Map<Id, boolean>;
  projectFileIds: Map<Id, List<Id>>;
  firstProjectIds: Map<Id, Id>;
}

export interface PrepareProjectPeopleResult {
  projectPeopleIds: List<Id>;
  projectPeopleRole: Map<Id, ProjectPeopleRole>;
  rawProjectPeople: UserInProject[];
}

export interface OrganizationProjectsQueryParams
  extends ResourceQueryParams<OrganizationProjectsParamMetadata, OrganizationProjectsParamFields> {
  status?: EntityStatus | BaseQueryFieldValue.ALL;
  projectType?: ProjectType[];
  isMember?: boolean | BaseQueryFieldValue.ALL;
  isVisible?: boolean | BaseQueryFieldValue.ALL;
}

export enum OrganizationProjectsParamMetadata {
  PEOPLE = 'projectPeople',
  FOLLOWERS = 'projectFollowerId',
  UNREAD_MESSAGES = 'projectsHaveUnreadMessages',
  CUSTOM_FIELDS = 'customFields',
}

export enum OrganizationProjectsParamFields {
  id = 'id',
  organizationId = 'organizationId',
  status = 'status',
  name = 'name',
  description = 'description',
  projectType = 'projectType',
  creatorId = 'creatorId',
  isPrivate = 'isPrivate',
  color = 'color',
  iconType = 'iconType',
  startDate = 'startDate',
  dueDate = 'dueDate',
  autoJoin = 'autoJoin',
}

export interface OrganizationProjectsData {
  projectsData: ProjectsData;
  projectPeople?: Map<Id, List<Id>>;
  projectPeopleRole?: Map<Id, Map<Id, ProjectPeopleRole>>;
  projectsHaveUnreadMessages?: Map<Id, boolean>;
  customFields?: CustomFieldsMap;
  organizationIdByProjectId: Map<Id, Id>;
}

export enum ObjectResourceType {
  PROJECTS = 'projects',
  CONVERSATIONS = 'conversations',
}

export type ProjectViewDataQueryParams = {
  fetchArchived?: boolean;
};
