import { createSelector } from 'reselect'
import { domain } from './constants'
import { selectDeactivatedUserIds } from 'models/domain/OrganizationsModel/selectors/domain'
import { selectCurrentOrganizationActivePeopleWithoutBot } from 'models/domain/OrganizationsModel/selectors'

export const selectCreateSpaceDomain = (state) => state.get(domain)

export const selectSpaceName = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('spaceName'),
)

export const selectSpacePurpose = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('spacePurpose'),
)

export const selectSpaceColor = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('spaceColor'),
)

export const selectSpaceIsPrivate = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('isPrivate'),
)

export const selectIsCurrentUserFollowingSpace = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('isCurrentUserFollowing'),
)

export const selectSpaceMembers = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('spaceMembers'),
)

export const selectSpaceMembersCount = createSelector(
  selectCreateSpaceDomain,
  (createSpaceDomain) => createSpaceDomain.get('spaceMembers').size,
)

export const selectInvitableOrganizationMembers = createSelector(
  selectCurrentOrganizationActivePeopleWithoutBot,
  selectDeactivatedUserIds,
  selectSpaceMembers,
  (userIds, deactivatedUserIds, memberIds) => userIds.filterNot(userId => memberIds.includes(userId) || deactivatedUserIds.includes(userId)),
)
