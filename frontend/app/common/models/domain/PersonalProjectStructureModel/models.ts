import {
  UserProjectGroupInterface,
  UserProjectGroupRecordInterface,
  UserProjectOrderInterface,
  UserProjectOrderRecordInterface,
  ProjectInGroupRecordInterface,
  ProjectInGroupInterface,
} from './types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultUserProjectGroup: UserProjectGroupInterface = {
  id: undefined,
  isExpanded: false,
  name: undefined,
  order: undefined,
  userInOrganizationId: undefined,
  wasJustCreated: undefined,
}

export const UserProjectGroup = makeTypedFactory<
  UserProjectGroupInterface | UserProjectGroupRecordInterface,
  UserProjectGroupRecordInterface
>
  (defaultUserProjectGroup);

const defaultUserProjectOrder: UserProjectOrderInterface = {
  id: undefined,
  order: undefined,
  projectId: undefined,
  userInOrganizationId: undefined,
}

export const UserProjectOrder = makeTypedFactory<
  UserProjectOrderInterface | UserProjectOrderRecordInterface,
  UserProjectOrderRecordInterface
>
  (defaultUserProjectOrder);


const defaultProjectInGroup: ProjectInGroupInterface = {
  groupId: undefined,
  order: undefined,
  projectId: undefined,
}

export const ProjectInGroup = makeTypedFactory<
  ProjectInGroupInterface | ProjectInGroupRecordInterface,
  ProjectInGroupRecordInterface
>
  (defaultProjectInGroup);