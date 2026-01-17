import { Id } from 'common/utils/identifier';
import { Map } from 'immutable';
import { createSelector } from 'reselect';
import { domain } from '../constants';
import { GroupsState, OrganizationGroupsData } from '../types';

/**
 * Direct selector to the projectsTree state domain
 */
export const selectGroupsDomain = (state) => state.get(domain) as GroupsState;

/**
 * Other specific selectors
 */

export const selectGroupsData = createSelector(
  selectGroupsDomain,
  (domain) => domain.get('groupsData') as OrganizationGroupsData
);

export const selectGroupIdByUserIdMap = createSelector(
  selectGroupsDomain,
  (domain) => domain.get('groupIdByUserId') as Map<Id, Id>
);
