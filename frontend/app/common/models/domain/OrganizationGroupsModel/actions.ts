import * as C from './constants';
import { action } from 'typesafe-actions';

import {
  OrganizationGroupInterface,
  OrganizationGroupRecordInterface,
} from './types';
import { getMapOfRecords } from 'common/utils/immutableUtils';
import { OrganizationGroup } from './models';
import { ActionResultInterface } from '../ActionResultModel';
import { Id } from 'common/utils/identifier';
import { Map } from 'immutable';

export const onInit = () => action(C.onInit);

export const onSetGroupsData = (
  groups: Partial<OrganizationGroupInterface[]>
) => {
  const groupsData = getMapOfRecords<
    OrganizationGroupInterface,
    OrganizationGroupRecordInterface
  >(groups, OrganizationGroup);
  return action(C.onSetGroupsData, groupsData);
};

export const onSetGroupsPeople = (groupsPeople: Map<Id, Id>) => {
  return action(C.onSetGroupsPeople, groupsPeople);
};

export const onSetGroupData = (group: OrganizationGroupInterface) => {
  return action(C.onSetGroupData, OrganizationGroup(group));
};

export const onCreateGroup = (group: Partial<OrganizationGroupInterface>) =>
  action(C.onCreateGroup, { group });

export const onCreateGroupSuccess = (actionResult: ActionResultInterface) =>
  action(C.onCreateGroupSuccess, actionResult);

export const onUpdateGroup = (group: Partial<OrganizationGroupInterface>) =>
  action(C.onUpdateGroup, { group });

export const onUpdateGroupSuccess = (actionResult: ActionResultInterface) =>
  action(C.onUpdateGroupSuccess, actionResult);

export const onDeleteGroup = (groupId: Id) =>
  action(C.onDeleteGroup, { groupId });

export const onDeleteGroupSuccess = (groupId: Id) =>
  action(C.onDeleteGroupSuccess, { groupId });

export const onAddUserToGroup = (userId: Id, groupId: Id) =>
  action(C.onAddUserToGroup, { userId, groupId });

export const onAddUserToGroupSuccess = (userId: Id, groupId: Id) =>
  action(C.onAddUserToGroupSuccess, { userId, groupId });

export const onRemoveUserFromGroup = (userId: Id, groupId: Id) =>
  action(C.onRemoveUserFromGroup, { userId, groupId });

export const onRemoveUserFromGroupSuccess = (userId: Id, groupId: Id) =>
  action(C.onRemoveUserFromGroupSuccess, { userId, groupId });
