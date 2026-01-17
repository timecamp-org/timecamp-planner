import { ApplicationState } from 'common/types';
import generateSelectorName from 'common/utils/generateSelectorName';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { OrganizationGroupInterface, OrganizationGroupRecordInterface } from '../types';
import { selectGroupIdByUserIdMap, selectGroupsData } from './domain';

export const selectOrganizationGroups = (state: ApplicationState) => {
  return selectGroupsData(state).valueSeq().toArray() as OrganizationGroupInterface[];
};

// args: groupId
export const selectGroupById = createCachedSelector(
  selectGroupsData,
  (_, args) => args.groupId,
  (groupsData, groupId) => groupsData.get(groupId)
)((_, args) => generateSelectorName(args, ['groupId']));

// args: userId
export const selectGroupByUserId = createCachedSelector(
  selectGroupsData,
  selectGroupIdByUserIdMap,
  (_, args) => args.userId,
  (groupsData, groupIdByUserIdMap, userId) =>
    groupsData.get(groupIdByUserIdMap.get(userId)) as OrganizationGroupRecordInterface
)((_, args) => generateSelectorName(args, ['userId']));

// args: userId
export const selectUserGroupName = createCachedSelector(
  selectGroupByUserId,
  (group) => group?.name
)((_, args) => generateSelectorName(args, ['userId']));
