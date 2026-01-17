import { Id } from 'common/utils/identifier';
import { 
  UserProjectGroupRecordInterface, 
  UserProjectGroupInterface, 
  ProjectDroppableType, 
  UserProjectOrderInterface,
  ProjectInGroupInterface
} from './types';
import { Map } from 'immutable'

export interface OnUpdateGroupPayload {
  groupId: Id,
  fields: Partial<UserProjectGroupInterface>
}

export interface OnCreateProjectGroupPayload {
  id?: Id,
  name: string,
}

export interface OnDeleteProjectGroupPayload {
  groupId: Id,
}

export interface OnCreateProjectGroupSuccessPayload {
  projectGroup: UserProjectGroupRecordInterface,
}

export interface OnMoveProjectInStructurePayload {
  spaceId: Id,
  selectedPosition: number,
  sourceType: ProjectDroppableType,
  sourceId: Id,
  targetType: ProjectDroppableType,
  targetId: Id
}

export interface OnMoveProjectGroupPayload {
  groupId: Id,
  selectedPosition: number,
}

export interface OnUpdateGrouplessProjectOrdersPayload {
  projectOrders: Map<Id, number>
}

export interface OnUpdateProjectOrdersInGroupPayload {
  groupId: Id,
  projectOrders: Map<Id, number>
}

export interface OnBatchProjectGroupsPayload {
  projectGroups: Map<Id, UserProjectGroupRecordInterface>
}

export interface OnBatchProjectOrdersInGroupPayload {
  projectOrdersInGroup: Map<Id, Map<Id, number>>
}

export interface OnCreateProjectGroupDataPayload {
  projectGroup: UserProjectGroupRecordInterface,
}

export interface OnUpdateProjectGroupDataPayload {
  projectGroup: UserProjectGroupRecordInterface,
}

export interface OnDeleteProjectGroupDataPayload {
  id: Id,
}

export interface OnCreatePersonalProjectOrderDataPayload {
  projectOrder: UserProjectOrderInterface,
}

export interface OnUpdatePersonalProjectOrderDataPayload {
  projectOrder: UserProjectOrderInterface,
}
export interface OnDeletePersonalProjectOrderDataPayload {
  projectId: Id,
}

export interface OnCreateProjectInGroupDataPayload {
  projectInGroup: ProjectInGroupInterface,
}

export interface OnUpdateProjectInGroupDataPayload {
  projectInGroup: ProjectInGroupInterface,
}

export interface OnDeleteProjectInGroupDataPayload {
  projectId: Id,
  groupId: Id,
}

