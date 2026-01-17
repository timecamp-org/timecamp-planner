import { createSelector } from 'reselect';
import createCachedSelector from 're-reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import { domain, adminRoles } from '../constants';
import { List, Map } from 'immutable';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { OrganizationPeopleRole, OrganizationsData, OrganizationsState } from '../types';
import { getInitials } from '../../../../utils/getInitials';
import { Id } from '../../../../utils/identifier';
import { EntityStatus } from '../../EntityModel/types';
import { ApplicationState } from 'common/types';
import { selectProjectsDataDomain } from 'models/domain/ProjectsModel/selectors/domain';

const emptyList = List();
const emptyMap = Map();

export const organizationsDomain = (state: ApplicationState): OrganizationsState => state.get(domain);

export const selectAllOrganizationsData = createSelector<ApplicationState, OrganizationsState, OrganizationsData>(
  organizationsDomain,
  (domain) => domain.get('organizationsData')
);

export const selectOrganizationsPeople = createSelector(
  organizationsDomain,
  (domain) => domain.get('organizationsPeople') as Map<Id, List<Id>>
);

export const selectCurrentOrganizationId = createSelector<ApplicationState, OrganizationsState, Id>(
  organizationsDomain,
  (domain) => domain.get('currentOrganizationId') as Id
);

export const selectOrganizationsPeopleRoleDomain = createSelector<
  ApplicationState,
  OrganizationsState,
  Map<Id, Map<Id, OrganizationPeopleRole>>
>(organizationsDomain, (domain) => domain.get('organizationsPeopleRole') as Map<Id, Map<Id, OrganizationPeopleRole>>);

export const selectOrganizationsPeopleStatusDomain = createImmutableEqualSelector<
  ApplicationState,
  OrganizationsState,
  Map<Id, Map<Id, EntityStatus>>
>(organizationsDomain, (domain) => domain.get('organizationPeopleStatus') as Map<Id, Map<Id, EntityStatus>>);

export const selectOpenedReactivateUserModalId = createSelector(
  organizationsDomain,
  (domain) => domain.get('openedReactivateUserModalId') as Id
);

export const selectUserInvitationLinks = createSelector(
  organizationsDomain,
  (domain) => domain.get('userInvitationLinks') as Map<Id, string>
);

export const selectUserInOrganizationIdsDomain = createSelector(
  organizationsDomain,
  (domain) => domain.get('userInOrganizationIds') as Map<Id, List<Id>>
);

// userId
export const selectCurrentUserInOrganizationIdByUserId = createCachedSelector(
  selectUserInOrganizationIdsDomain,
  selectCurrentOrganizationId,
  (_, args) => args.userId,
  (userInOrganizationIdsDomain, currentOrganizationId, userId) =>
    userInOrganizationIdsDomain.getIn([currentOrganizationId, userId])
)((_, args) => generateSelectorName(args, ['userId']));

/**
 * @returns {Map}
 */
export const selectUsersStatusInCurrentOrganization = createSelector<
  ApplicationState,
  Id,
  Map<Id, Map<Id, EntityStatus>>,
  Map<Id, EntityStatus>
>(
  selectCurrentOrganizationId,
  selectOrganizationsPeopleStatusDomain,
  (organizationId, domain) => domain.get(organizationId) || (emptyMap as Map<Id, EntityStatus>)
);

/**
 * args: userId
 * @returns {string}
 */
export const selectUserStatusInCurrentOrganization = createCachedSelector(
  selectUsersStatusInCurrentOrganization,
  (_, args) => args.userId,
  (peopleStatus, userId) => (peopleStatus ? peopleStatus.get(userId) : null)
)((_, args) => generateSelectorName(args, ['userId']));

/**
 * args: userId
 * @returns {string}
 * User is active when:
 * - status entity is present and it equals EXISTS
 * - status entity is not preset/not yet fetched (otherwise user would be shown as deactivated in not visited conversations)
 */
export const selectIsUserActiveInCurrentOrganization = createCachedSelector(
  selectUserStatusInCurrentOrganization,
  (status) => !status || status === EntityStatus.EXISTS
)((_, args) => generateSelectorName(args, ['userId']));

/**
 * @returns {List<string>}
 */
export const selectDeactivatedUserIds = createSelector(selectUsersStatusInCurrentOrganization, (peopleStatus) => {
  if (peopleStatus) {
    return peopleStatus
      .filter((status) => status === EntityStatus.DELETED)
      .keySeq()
      .toList();
  }

  return emptyList;
});

// args: organizationId
// return: Immutable.map
export const selectOrganization = createCachedSelector(
  selectAllOrganizationsData,
  (_, args) => args.organizationId,
  (organizationsData, organizationId) => organizationsData.get(organizationId)
)((_, args) => generateSelectorName(args, ['organizationId']));

// args organizationId
export const selectOrganizationLogo = createCachedSelector(selectOrganization, (organization) =>
  organization ? organization.logo : ''
)((_, args) => generateSelectorName(args, ['organizationId']));

/**
 * @returns {Map}
 */
export const selectCurrentOrganizationActivePeopleRole = createSelector<
  ApplicationState,
  Id,
  Map<Id, Map<Id, OrganizationPeopleRole>>,
  Map<Id, OrganizationPeopleRole>
>(
  selectCurrentOrganizationId,
  selectOrganizationsPeopleRoleDomain,
  (organizationId, peopleRoleDomain) =>
    peopleRoleDomain.get(organizationId) || (emptyMap as Map<Id, OrganizationPeopleRole>)
);

/**
 * @returns {string}
 */
export const selectCurrentOrganizationOwnerId = createSelector(
  selectCurrentOrganizationActivePeopleRole,
  (organizationPeople) =>
    organizationPeople
      ? organizationPeople
          .filter((role) => role === OrganizationPeopleRole.OWNER)
          .keySeq()
          .first()
      : null
);

// args: organizationId
// return: string
export const selectOrganizationName = createCachedSelector(selectOrganization, (organization) =>
  organization ? organization.name : ''
)((_, args) => generateSelectorName(args, ['organizationId']));

// args organizationId
export const selectOrganizationInitials = createCachedSelector(selectOrganizationName, (name) => {
  const [part1, part2] = name.split(' ');
  return getInitials(part1, part2);
})((_, args) => generateSelectorName(args, ['organizationId']));

// return: Immutable.map
export const selectCurrentOrganization = createSelector(
  selectAllOrganizationsData,
  selectCurrentOrganizationId,
  (organizationsData, currentOrganizationId) => organizationsData.get(currentOrganizationId)
);

export const selectCurrentOrganizationName = createSelector(selectCurrentOrganization, (organization) =>
  organization ? organization.name : ''
);

export const selectCurrentOrganizationStatus = createSelector(selectCurrentOrganization, (organization) =>
  organization ? organization.status : ''
);

export const selectCurrentOrganizationCreatedAt = createSelector(selectCurrentOrganization, (organization) =>
  organization ? organization.createdAt : null
);

export const selectCurrentOrganizationModifiedAt = createSelector(selectCurrentOrganization, (organization) =>
  organization ? organization.modifiedAt : null
);

export const selectCurrentOrganizationInitials = createSelector(selectCurrentOrganizationName, (name) => {
  const [part1, part2] = name.split(' ');
  return getInitials(part1, part2);
});

export const selectCurrentOrganizationLogo = createSelector(selectCurrentOrganization, (organization) =>
  organization ? organization.logo : ''
);

export const selectAllOrganizationNames = createSelector(selectAllOrganizationsData, (organizationsData) =>
  organizationsData.map((organization) => organization.name)
);

// arg: userId
export const selectUserOrganizationRole = createCachedSelector(
  selectOrganizationsPeopleRoleDomain,
  selectCurrentOrganizationId,
  (_, args) => args.userId,
  (organizationsPeopleRole, organizationId, userId) => organizationsPeopleRole.getIn([organizationId, userId])
)((_, args) => generateSelectorName(args, ['userId']));

// arg: userId
export const selectIsUserOrganizationOwner = createCachedSelector(
  selectUserOrganizationRole,
  (organizationRole) => organizationRole === OrganizationPeopleRole.OWNER
)((_, args) => generateSelectorName(args, ['userId']));

// arg: userId
export const selectIsUserOrganizationAdmin = createCachedSelector(selectUserOrganizationRole, (organizationRole) =>
  adminRoles.includes(organizationRole)
)((_, args) => generateSelectorName(args, ['userId']));

// arg: userId
export const selectIsUserOrganizationGuest = createCachedSelector(
  selectUserOrganizationRole,
  (organizationRole) => organizationRole === OrganizationPeopleRole.GUEST
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserInvitationLink = createCachedSelector(
  selectUserInvitationLinks,
  (_, args) => args.userId,
  (userInvitationLinks, userId) => userInvitationLinks.get(userId)
)((_, args) => generateSelectorName(args, ['userId']));
