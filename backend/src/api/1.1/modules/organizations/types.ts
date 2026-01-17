import {
  UserDbRow,
  OrganizationDbRow,
  ProjectDbRow,
  ProjectRole,
  OrganizationRole,
  UserInOrganizationDbRow,
  ProjectType,
  UserInProjectDbRow,
  PublicUserDbRow,
  SubscriptionInOrganizationDbRow,
} from '../db/schema';

import { Id } from '../common/identifier';
import { AddProjectPersonResult, ProjectsHaveUnreadMessages } from '../projects/types';
import { CustomFieldValuesMap } from '../extensions/types';
import { EntityStatus } from '../common/enum';
import { Dict } from '../common/types';
import { BaseQueryFieldValue, ResourceQueryParams } from '../../../../infrastructure/resources/types';

/******************************************
 * Data passed between app and REST (request and response)
 ******************************************/
export interface OrganizationJson {
  name: string;
}

/******************************************
 * Service return types
 ******************************************/
export enum GetOrganizationResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
}

export interface GetOrganizationResult {
  status: GetOrganizationResultStatus;
  organization?: OrganizationDbRow;
}

export enum CreateOrganizationResultStatus {
  OK,
  ORGANIZATION_ALREADY_EXISTS = 'ORGANIZATION_ALREADY_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export interface CreateOrganizationResult {
  status: CreateOrganizationResultStatus;
  organization?: OrganizationDbRow;
  userInOrganization?: UserInOrganizationDbRow;
}

export enum UpdateOrganizationResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
}

export interface UpdateOrganizationResult {
  status: UpdateOrganizationResultStatus;
}

export enum GetOrganizationProjectsResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
}

export interface GetOrganizationProjectsResult {
  status: GetOrganizationProjectsResultStatus;
  organizationProjects?: Array<ProjectDbRow>; // TODO: change that to Array<ProjectDbRow>
}

export enum GetOrganizationOwnerIdStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND = 'USER_IN_ORGANIZATION_NOT_FOUND',
}

export interface GetOrganizationOwnerIdResult {
  status: GetOrganizationOwnerIdStatus;
  userId?: Id;
}

export enum CheckIfUserIsOrganizationOwnerStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND = 'USER_IN_ORGANIZATION_NOT_FOUND',
}

export enum CheckIfUserIsOrganizationGuestStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND = 'USER_IN_ORGANIZATION_NOT_FOUND',
}

export enum CheckIfUserIsOrganizationMemberStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND = 'USER_IN_ORGANIZATION_NOT_FOUND',
}

export interface CheckIfUserIsOrganizationOwnerStatusResult {
  status: CheckIfUserIsOrganizationOwnerStatus;
  userIsOrganizationOwner?: boolean;
}

export interface CheckIfUserIsOrganizationGuestStatusResult {
  status: CheckIfUserIsOrganizationGuestStatus;
  userIsOrganizationGuest?: boolean;
}

export interface CheckIfUserIsOrganizationMemberStatusResult {
  status: CheckIfUserIsOrganizationMemberStatus;
  userIsOrganizationMember?: boolean;
}

export enum CheckIfUserIsOrganizationAdminStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND = 'USER_IN_ORGANIZATION_NOT_FOUND',
}
export interface CheckIfUserIsOrganizationAdminStatusResult {
  status: CheckIfUserIsOrganizationAdminStatus;
  userIsOrganizationAdmin?: boolean;
}

export interface OrganizationProjectsPeople {
  [projectId: string]: Array<{ userId: Id; role: ProjectRole }>;
}

export interface GetOrganizationProjectsPeopleResult {
  status: GetOrganizationProjectsResultStatus;
  organizationProjectsPeople?: OrganizationProjectsPeople;
}

export enum InviteUserToOrganizationResultStatus {
  OK,
  USER_REACTIVATED = 'USER_REACTIVATED',
  USER_ALREADY_IN_ORGANIZATION = 'USER_ALREADY_IN_ORGANIZATION',
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  INVITER_NOT_FOUND = 'INVITER_NOT_FOUND',
  INVITED_USER_NOT_FOUND = 'INVITED_USER_NOT_FOUND',
  USER_IS_NOT_WORKSPACE_OWNER = 'USER_IS_NOT_WORKSPACE_OWNER',
}

export interface InviteUserToOrganizationResult {
  status: InviteUserToOrganizationResultStatus;
  user?: Partial<UserDbRow>;
}

export enum GetOrganizationPeopleResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
}

export interface OrganizationPeopleRoleMap {
  [userId: string]: OrganizationRole;
}

export interface OrganizationPeopleStatusMap {
  [userId: string]: EntityStatus;
}

export interface UserInOrganizationIdsMap {
  [userId: string]: Id;
}

export interface GetOrganizationPeopleResult {
  status: GetOrganizationPeopleResultStatus;
  organizationPeople?: Array<Partial<UserDbRow>>;
  organizationPeopleRole?: OrganizationPeopleRoleMap;
  organizationPeopleStatus?: OrganizationPeopleStatusMap;
  userInOrganizationIds?: UserInOrganizationIdsMap;
  userInOrganizationCustomFields?: CustomFieldValuesMap;
}

export enum InviteUserToOrganizationAndCreateConversationResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  USER_ALREADY_IN_ORGANIZATION = 'USER_ALREADY_IN_ORGANIZATION',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  PROJECT_ALREADY_EXISTS = 'PROJECT_ALREADY_EXISTS',
  USER_ALREADY_IN_PROJECT = 'USER_ALREADY_IN_PROJECT',
  INVITER_NOT_FOUND = 'INVITER_NOT_FOUND',
  INVITED_USER_NOT_FOUND = 'INVITED_USER_NOT_FOUND',
  USER_IS_NOT_WORKSPACE_OWNER = 'USER_IS_NOT_WORKSPACE_OWNER',
}

export interface InviteUserToOrganizationAndCreateConversationResult {
  status: InviteUserToOrganizationAndCreateConversationResultStatus;
  userId: Id;
  user?: Partial<UserDbRow>;
  project?: ProjectDbRow;
}

export enum InviteGuestToOrganizationStatus {
  OK,
  ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  USER_ALREADY_IN_ORGANIZATION = 'USER_ALREADY_IN_ORGANIZATION',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  // TODO CR PROJECT_ALREADY_EXISTS
  PROJECT_ALREADY_EXISTS = 'PROJECT_ALREADY_EXISTS',
  USER_ALREADY_IN_PROJECT = 'USER_ALREADY_IN_PROJECT',
  INVITER_NOT_FOUND = 'INVITER_NOT_FOUND',
  INVITED_USER_NOT_FOUND = 'INVITED_USER_NOT_FOUND',
  UNSPECITIFED_PROJECTS = 'UNSPECITIFED_PROJECTS',
  USER_IS_NOT_WORKSPACE_OWNER = 'USER_IS_NOT_WORKSPACE_OWNER',
}

export interface InviteGuestToOrganizationResult {
  status: InviteGuestToOrganizationStatus;
  email: string;
  user?: Partial<UserDbRow>;
  projectsPerson?: AddProjectPersonResult[];
  project?: ProjectDbRow;
}

export enum ResendInvitationToOrganizationStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  INVITER_NOT_FOUND,
  INVITED_USER_NOT_FOUND,
  TOO_MANY_REQUESTS,
}
export interface ResendInvitationToOrganizationResult {
  status: ResendInvitationToOrganizationStatus;
}

export enum GenerateInvitationLinkStatus {
  OK,
  INVITED_USER_NOT_FOUND,
  USER_ALREADY_REGISTERED,
}

export interface GenerateInvitationLinkResult {
  status: GenerateInvitationLinkStatus;
  invitationLink?: string;
}

export type UserAddedToOrganizationEventData = {
  userId: Id;
  organizationId: Id;
  trx: Transaction;
};

export type UsersInOrganizationsMap = {
  [userId: string]: Id[];
};

export enum CreateInvitationDataResultStatus {
  OK,
  INVITER_NOT_FOUND,
  INVITED_USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
}

export interface CreateInvitationDataResult {
  status: CreateInvitationDataResultStatus;
}

/******************************************
 * Service return types
 ******************************************/
export enum CreateWorkspaceResultStatus {
  OK,
  // ORGANIZATION
  ORGANIZATION_ALREADY_EXISTS,
  USER_NOT_FOUND,
  // BOT
  BOT_NOT_CREATED,
  // PROJECT
  PROJECT_ALREADY_EXISTS,
  USER_ALREADY_IN_PROJECT,
  SPACE_NOT_CREATED,
}

export interface CreateWorkspaceResult {
  status: CreateWorkspaceResultStatus;
  organization?: OrganizationDbRow;
  userInOrganization?: UserInOrganizationDbRow;
  projectId?: Id;
  subscription?: SubscriptionInOrganizationDbRow;
}

export type UserPayload = {
  userId: Id;
  email: string;
  projectId: Id;
  role?: OrganizationRole;
};

export enum DeactivateUserFromWorkspaceStatus {
  OK,
  FORBIDDEN,
  USER_NOT_FOUND,
}

export interface DeactivateUserFromWorkspaceResult {
  status: DeactivateUserFromWorkspaceStatus;
}

export enum ReactivateUserFromWorkspaceStatus {
  OK,
  FORBIDDEN,
  USER_NOT_FOUND,
}

export interface ReactivateUserFromWorkspaceResult {
  status: ReactivateUserFromWorkspaceStatus;
}

export type UserInOrganizationJson = Partial<UserInOrganizationDbRow>;
export type UpdateUserRoleResult = {
  status: UpdateUserRoleStatus;
};

export enum UpdateUserRoleStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND = 'ORGANIZATION_NOT_FOUND',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',
}

export type UserInvitationJson = {
  inviterId: Id;
  invitedUserId: Id;
  organizationId: Id;
  createdAt?: Date;
  resentAt?: Date;
  resentCount?: number;
};

export enum PrepareAndSendInvitationMailSatus {
  OK,
  INVITED_USER_NOT_FOUND,
  INVITER_NOT_FOUND,
  USER_ALREADY_REGISTERED,
  ORGANIZATION_NOT_FOUND,
}

export type PrepareAndSendInvitationMailResult = {
  status: PrepareAndSendInvitationMailSatus;
};

export interface OrganizationProjectsQueryParams extends ResourceQueryParams {
  status: EntityStatus.ARCHIVED | EntityStatus.EXISTS | BaseQueryFieldValue.ALL;
  projectType: ProjectType | BaseQueryFieldValue.ALL | ProjectType[];
  isMember: boolean | BaseQueryFieldValue.ALL;
  isVisible: boolean | BaseQueryFieldValue.ALL;
  isPrivate: boolean | BaseQueryFieldValue.ALL;
}

export interface OrganizationProjectsResourceContext {
  organization: OrganizationDbRow;
  userId: Id;
  userIsOrganizationAdmin?: boolean;
  projectIds?: Id[];
}

export interface OrganizationProjectsResourceData {
  projects: ProjectDbRow[];
  projectPeople?: Array<UserInProjectDbRow & { email?: string }>;
  projectFollowerIds?: Dict<Id[]>;
  projectsHaveUnreadMessages?: ProjectsHaveUnreadMessages;
  customFields?: CustomFieldValuesMap;
}

export enum GetOrganizationUserProjectsWithMetadataStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  USER_NOT_FOUND,
}

export interface GetOrganizationUserProjectsWithMetadataResult {
  status: GetOrganizationUserProjectsWithMetadataStatus;
  data?: OrganizationProjectsResourceData;
}

export enum ClearInactiveConversationsStatus {
  OK,
}
export interface ClearInactiveConversationsResult {
  status: ClearInactiveConversationsStatus;
  hiddenConversationIds?: Id[];
  activeConversationIds?: Id[];
}

export enum OrganizationProjectsMetadataType {
  PEOPLE = 'projectPeople',
  FOLLOWERS = 'projectFollowerIds',
  UNREAD_MESSAGES = 'projectsHaveUnreadMessages',
  CUSTOM_FIELDS = 'customFields',
}

export enum OrganizationPeopleMetadataType {
  ROLE = 'organizationPeopleRole',
  STATUS = 'organizationPeopleStatus',
  ID = 'userInOrganizationIds',
  CUSTOM_FIELDS = 'userInOrganizationCustomFields',
}

export interface OrganizationPeopleResourceContext {
  userId: Id;
  organizationId: Id;
  filteredOrganizationPeople?: UserInOrganizationDbRow[];
}

export interface OrganizationPeopleResourceData {
  organizationPeople: PublicUserDbRow[];
  organizationPeopleRole?: OrganizationPeopleRoleMap;
  organizationPeopleStatus?: OrganizationPeopleStatusMap;
  userInOrganizationIds?: UserInOrganizationIdsMap;
  userInOrganizationCustomFields?: CustomFieldValuesMap;
}

export interface GetOrganizationPeopleWithMetadataResult {
  status: GetOrganizationPeopleResultStatus;
  data?: OrganizationPeopleResourceData;
}

export interface OrganizationPeopleResourceQueryParams extends ResourceQueryParams {}
