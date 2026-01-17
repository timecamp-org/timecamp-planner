import { i18mark } from '../../../i18n'
import { EntityStatus } from '../EntityModel/types';
import { Id } from '../../../utils/identifier';
import { Map, List } from 'immutable';
import { ImmutableMap } from '../../../types';
import { UserEntityInterface } from '../UsersModel/types';
import { CustomFieldsMap } from '../ExtensionsModel/types';
import { TypedRecord } from 'typed-immutable-record';

export interface OrganizationInterface {
  id: Id,
  name: string,
  status: EntityStatus,
  logo: string,
  createdAt: number,
  modifiedAt: number,
}

export interface OrganizationRecordInterface extends TypedRecord<OrganizationRecordInterface>, OrganizationInterface { }

export interface UserInOrganizationInterface {
  id: Id,
  userId: Id,
  organizationId: Id,
  role: OrganizationPeopleRole,
  entityStatus?: EntityStatus,
  createdAt: Date,
  modifiedAt: Date,
}

export type UserInOrganization = {
  id: Id,
  status: EntityStatus,
  userId: Id,
  role: OrganizationPeopleRole,
  organizationId: Id,
}

export type UserToInvite = {
  userId: Id,
  email: string,
}

export enum OrganizationPeopleRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export const organizationRoleLabels = {
  [OrganizationPeopleRole.OWNER]: i18mark('Workspace owner'),
  [OrganizationPeopleRole.ADMIN]: i18mark('Admin'),
  [OrganizationPeopleRole.MEMBER]: i18mark('User'),
  [OrganizationPeopleRole.GUEST]: i18mark('Guest'),
}

export enum CreateWorkspaceStep {
  CREATE_WORKSPACE ='createWorkspace',
  WORKSPACE_INVITATIONS ='workspaceInvitations',
}

export type OrganizationsData = Map<Id, OrganizationInterface>

export interface OrganizationsState extends ImmutableMap<string, any> {
  currentOrganizationId: Id,
  organizationsData: Map<Id, OrganizationInterface>,
  organizationsPeople: Map<Id, List<Id>>,
  organizationsPeopleRole: Map<Id, Map<Id, OrganizationPeopleRole>>,
  organizationPeopleStatus: Map<Id, Map<Id, EntityStatus>>,
  userInOrganizationIds:  Map<Id, Map<Id, Id>>,
  userInvitationLinks: Map<Id, string>,
  openedReactivateUserModalId: Id,
}

export interface OrganizationPeopleRoleMap {
  [userId: string]: OrganizationPeopleRole,
}

export interface OrganizationPeopleStatusMap {
  [userId: string]: EntityStatus,
}

export interface UserInOrganizationIdsMap {
  [userId: string]: Id,
}

export interface OrganizationPeopleResourceData {
  organizationPeople: UserEntityInterface[],
  organizationPeopleRole?: OrganizationPeopleRoleMap,
  organizationPeopleStatus?: OrganizationPeopleStatusMap,
  userInOrganizationIds?: UserInOrganizationIdsMap,
  userInOrganizationCustomFields?: CustomFieldsMap,
}
