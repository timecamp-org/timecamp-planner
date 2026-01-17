import { Id } from 'common/utils/identifier';
import {
  OnUpdateGroupPayload,
  OnCreateProjectGroupPayload,
  OnCreateProjectGroupSuccessPayload,
  OnMoveProjectInStructurePayload,
  OnUpdateGrouplessProjectOrdersPayload,
  OnUpdateProjectOrdersInGroupPayload,
  OnMoveProjectGroupPayload,
  OnDeleteProjectGroupPayload,
  OnBatchProjectGroupsPayload,
  OnBatchProjectOrdersInGroupPayload,
  OnCreateProjectGroupDataPayload,
  OnUpdateProjectGroupDataPayload,
  OnDeleteProjectGroupDataPayload,
  OnCreatePersonalProjectOrderDataPayload,
  OnUpdatePersonalProjectOrderDataPayload,
  OnDeletePersonalProjectOrderDataPayload,
  OnCreateProjectInGroupDataPayload,
  OnUpdateProjectInGroupDataPayload,
  OnDeleteProjectInGroupDataPayload,
} from './payloads';
import { action } from 'typesafe-actions'
import * as C from './constants'
import { PayloadAction } from 'common/types';
import {
  UserProjectGroupRecordInterface,
  UserProjectGroupInterface,
  ProjectDroppableType, UserProjectOrderInterface, ProjectInGroupInterface
} from './types';
import { Map } from 'immutable'
import { UserProjectGroup } from './models';

export const onFetchPersonalProjectStructure = () => action(C.onFetchPersonalProjectStructure)

export const onUpdateProjectGroup = (groupId: Id, fields: Partial<UserProjectGroupInterface>): PayloadAction<OnUpdateGroupPayload> => (
  action(C.onUpdateProjectGroup, { groupId, fields })
)

export const onCreateProjectGroup = (name: string, id?: Id): PayloadAction<OnCreateProjectGroupPayload> => (
  action(C.onCreateProjectGroup, { name, id })
)

export const onCreateProjectGroupSuccess = (projectGroup: UserProjectGroupRecordInterface): PayloadAction<OnCreateProjectGroupSuccessPayload> => (
  action(C.onCreateProjectGroupSuccess, { projectGroup })
)

export const onDeleteProjectGroup = (groupId: Id): PayloadAction<OnDeleteProjectGroupPayload> => (
  action(C.onDeleteProjectGroup, { groupId })
)

export const onMoveProjectInStructure = (
  spaceId: Id,
  selectedPosition: number,
  sourceType: ProjectDroppableType,
  sourceId: Id,
  targetType: ProjectDroppableType,
  targetId: Id
): PayloadAction<OnMoveProjectInStructurePayload> => (
    action(C.onMoveProjectInStructure, {
      spaceId,
      selectedPosition,
      sourceType,
      sourceId,
      targetType,
      targetId,
    })
  )

export const onMoveProjectGroup = (
  groupId: Id,
  selectedPosition: number,
): PayloadAction<OnMoveProjectGroupPayload> => (
    action(C.onMoveProjectGroup, {
      groupId,
      selectedPosition,
    })
  )

export const onUpdateGrouplessProjectOrders = (projectOrders: Map<Id, number>): PayloadAction<OnUpdateGrouplessProjectOrdersPayload> => (
  action(C.onUpdateGrouplessProjectOrders, {
    projectOrders
  })
)

export const onUpdateProjectOrdersInGroup = (groupId: Id, projectOrders: Map<Id, number>): PayloadAction<OnUpdateProjectOrdersInGroupPayload> => (
  action(C.onUpdateProjectOrdersInGroup, {
    groupId,
    projectOrders
  })
)

export const onBatchProjectGroups = (projectGroups: Map<Id, UserProjectGroupRecordInterface>): PayloadAction<OnBatchProjectGroupsPayload> => (
  action(C.onBatchProjectGroups, {
    projectGroups
  })
)

export const onBatchProjectOrdersInGroup = (projectOrdersInGroup: Map<Id, Map<Id, number>>): PayloadAction<OnBatchProjectOrdersInGroupPayload> => (
  action(C.onBatchProjectOrdersInGroup, {
    projectOrdersInGroup
  })
)

export const onCreateProjectGroupData = (projectGroup: UserProjectGroupInterface): PayloadAction<OnCreateProjectGroupDataPayload> => (
  action(C.onCreateProjectGroupData, {
    projectGroup: UserProjectGroup(projectGroup)
  })
)

export const onUpdateProjectGroupData = (projectGroup: UserProjectGroupInterface): PayloadAction<OnUpdateProjectGroupDataPayload> => (
  action(C.onUpdateProjectGroupData, {
    projectGroup: UserProjectGroup(projectGroup)
  })
)

export const onDeleteProjectGroupData = (id: Id): PayloadAction<OnDeleteProjectGroupDataPayload> => (
  action(C.onDeleteProjectGroupData, {
    id
  })
)

export const onCreatePersonalProjectOrderData = (projectOrder: UserProjectOrderInterface): PayloadAction<OnCreatePersonalProjectOrderDataPayload> => (
  action(C.onCreatePersonalProjectOrderData, {
    projectOrder
  })
)

export const onUpdatePersonalProjectOrderData = (projectOrder: UserProjectOrderInterface): PayloadAction<OnUpdatePersonalProjectOrderDataPayload> => (
  action(C.onUpdatePersonalProjectOrderData, {
    projectOrder
  })
)

export const onDeletePersonalProjectOrderData = (projectId: Id): PayloadAction<OnDeletePersonalProjectOrderDataPayload> => (
  action(C.onDeletePersonalProjectOrderData, {
    projectId,
  })
)

export const onCreateProjectInGroupData = (projectInGroup: ProjectInGroupInterface): PayloadAction<OnCreateProjectInGroupDataPayload> => (
  action(C.onCreateProjectInGroupData, {
    projectInGroup,
  })
)

export const onUpdateProjectInGroupData = (projectInGroup: ProjectInGroupInterface): PayloadAction<OnUpdateProjectInGroupDataPayload> => (
  action(C.onUpdateProjectInGroupData, {
    projectInGroup,
  })
)

export const onDeleteProjectInGroupData = (projectId: Id, groupId: Id): PayloadAction<OnDeleteProjectInGroupDataPayload> => (
  action(C.onDeleteProjectInGroupData, {
    projectId,
    groupId,
  })
)