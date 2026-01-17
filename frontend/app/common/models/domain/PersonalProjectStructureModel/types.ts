import { Id } from 'common/utils/identifier';
import { ImmutableMap, Dict } from 'common/types';
import { TypedRecord } from 'typed-immutable-record';

export interface UserProjectOrderInterface {
  id: Id,
  userInOrganizationId: Id,
  projectId: Id,
  order: number,
}

export interface UserProjectOrderRecordInterface extends TypedRecord<UserProjectOrderRecordInterface>, UserProjectOrderInterface { }

export interface UserProjectGroupInterface {
  id: Id,
  userInOrganizationId: Id,
  name: string
  order: number,
  isExpanded: boolean,
  wasJustCreated?: boolean,
}

export interface UserProjectGroupRecordInterface extends TypedRecord<UserProjectGroupRecordInterface>, UserProjectGroupInterface { }

export interface ProjectInGroupInterface {
  projectId: Id,
  groupId: Id,
  order: number,
}

export interface ProjectInGroupRecordInterface extends TypedRecord<ProjectInGroupRecordInterface>, ProjectInGroupInterface { }

export interface PersonalProjectStructureState extends ImmutableMap<string, any> {
  groupsData
}

export enum ProjectDroppableType {
  GROUP = 'group',
  LOOSE = 'loose'
}

export type ProjectOrderDescriptorInterface = {
  containerType: ProjectDroppableType,
  containerId: Id,
  order: number,
}

export type ProjectStructureInterface = {
  projectGroups: Dict<UserProjectGroupInterface>,
  projectOrder: Dict<ProjectOrderDescriptorInterface>,
}