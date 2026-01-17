import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import {
  selectCurrentUserId,
  selectUsersData,
  selectUsersEmail,
  selectUsersName,
} from '../../UsersModel/selectors/domain';
import { OrganizationPeopleRole } from '../types';

import { ApplicationState } from 'common/types';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { Id } from '../../../../utils/identifier';
import { selectIsCurrentSubscriptionFree } from '../../SubscriptionModel/selectors';
import { sortUserIdsByNames } from '../../UsersModel/utils';
import { adminRoles } from '../constants';
import {
  selectCurrentOrganizationActivePeopleRole,
  selectCurrentOrganizationId,
  selectCurrentOrganizationOwnerId,
  selectDeactivatedUserIds,
  selectOrganizationsPeople,
  selectOrganizationsPeopleRoleDomain,
  selectOrganizationsPeopleStatusDomain,
  selectUserInOrganizationIdsDomain,
  selectUserOrganizationRole,
  selectUsersStatusInCurrentOrganization,
} from './domain';

const emptyList = List();
const emptyMap = Map();

const availableRolesMap = Map({
  [OrganizationPeopleRole.ADMIN]: List([OrganizationPeopleRole.MEMBER, OrganizationPeopleRole.GUEST]),
  [OrganizationPeopleRole.MEMBER]: emptyList,
  [OrganizationPeopleRole.OWNER]: List([
    OrganizationPeopleRole.ADMIN,
    OrganizationPeopleRole.MEMBER,
    OrganizationPeopleRole.GUEST,
  ]),
  [OrganizationPeopleRole.GUEST]: emptyList,
});

/**
 * @returns {string}
 */
export const selectCurrentUserStatusInCurrentOrganization = createSelector(
  selectCurrentUserId,
  selectUsersStatusInCurrentOrganization,
  (userId, peopleStatus) => (peopleStatus ? peopleStatus.get(userId) : null),
);

/**
 * @returns {Map}
 */
export const selectCurrentUserStatusByOrganizationId = createImmutableEqualSelector(
  selectCurrentUserId,
  selectOrganizationsPeopleStatusDomain,
  (userId, organizationsPeopleStatus) => {
    let result = emptyMap;

    organizationsPeopleStatus.forEach((peopleStatus, organizationId) => {
      const userStatus = peopleStatus.get(userId);

      if (userStatus) {
        result = result.set(organizationId, userStatus);
      }
    });

    return result;
  },
);

// args: organizationId
// return: Immutable.list
export const selectCurrentOrganizationUserIds = createSelector(
  selectOrganizationsPeople,
  selectCurrentOrganizationId,
  (organizationsPeople, organizationId) => organizationsPeople.get(organizationId) || (emptyList as List<Id>),
);

// args: organizationId
// return: Immutable.list
export const selectCurrentOrganizationActivePeople = createSelector(
  selectOrganizationsPeople,
  selectCurrentOrganizationId,
  selectDeactivatedUserIds,
  (organizationsPeople, organizationId, deactivatedUserIds) => {
    const result = organizationsPeople.get(organizationId) || (emptyList as List<Id>);
    return result.filter((userId) => deactivatedUserIds.indexOf(userId) === -1) as List<Id>;
  },
);

/**
 * @return {string}
 */
export const selectOrganizationOwnerEmail = createSelector(
  selectCurrentOrganizationOwnerId,
  selectUsersEmail,
  (ownerId, usersEmail) => usersEmail.get(ownerId),
);

export const selectCurrentOrganizationActivePeopleWithoutBot = createSelector(
  selectCurrentOrganizationActivePeople,
  selectUsersData,
  (currentOrganizationPeopleIds, usersData) =>
    currentOrganizationPeopleIds.filter((id) => usersData.get(id) && !usersData.get(id).isBot) as List<Id>,
);

/**
 * @returns {List<string>}
 */
export const selectCurrentOrganizationActiveGuestUserIds = createSelector(
  selectCurrentOrganizationActivePeopleWithoutBot,
  selectCurrentOrganizationActivePeopleRole,
  (userIds, organizationPeopleRole) =>
    userIds.filter((userId) => {
      const userRole = organizationPeopleRole.get(userId);
      return userRole === OrganizationPeopleRole.GUEST;
    }) as List<Id>,
);
/**
 * @returns {List<string>}
 */
export const selectCurrentOrganizationActiveGuestUserIdsSorted = createSelector(
  selectCurrentOrganizationActiveGuestUserIds,
  selectUsersName,
  (userIds, usersName) => sortUserIdsByNames(userIds, usersName),
);

/**
 * @returns {List<string>}
 */
export const selectCurrentOrganizationAllGuestUserIds = createSelector(
  selectCurrentOrganizationUserIds,
  selectCurrentOrganizationActivePeopleRole,
  (userIds, organizationPeopleRole) =>
    userIds.filter((userId) => {
      const userRole = organizationPeopleRole.get(userId);
      return userRole === OrganizationPeopleRole.GUEST;
    }),
);

/**
 * @returns {List<string>}
 */
export const selectCurrentOrganizationMemberUserIds = createSelector(
  selectCurrentOrganizationActivePeopleWithoutBot,
  selectCurrentOrganizationActivePeopleRole,
  (userIds, organizationPeopleRole) =>
    userIds.filter((userId) => {
      const userRole = organizationPeopleRole.get(userId);
      return userRole !== OrganizationPeopleRole.GUEST;
    }),
);

/**
 * @returns {List<string>}
 */
export const selectCurrentOrganizationMemberUserIdsSortedAlphabetically = createSelector(
  selectCurrentOrganizationMemberUserIds,
  selectUsersName,
  (userIds, usersName) =>
    userIds.sort((userIdA, userIdB) => {
      const userNameA = usersName.get(userIdA);
      const userNameB = usersName.get(userIdB);
      return userNameA.toLowerCase() < userNameB.toLowerCase() ? -1 : 1;
    }),
);
/**
 * @returns {List<string>}
 */
export const selectCurrentOrganizationMemberUserIdsSortedByRole = createSelector(
  selectCurrentOrganizationMemberUserIds,
  selectCurrentOrganizationActivePeopleRole,
  selectUsersName,
  selectCurrentUserId,
  (userIds, organizationPeopleRole, usersName, currentUserId) =>
    userIds.sort((userIdA, userIdB) => {
      if (userIdA === currentUserId && userIdB !== currentUserId) {
        return -1;
      }
      if (userIdA !== currentUserId && userIdB === currentUserId) {
        return 1;
      }

      const userARole = organizationPeopleRole.get(userIdA);
      const userBRole = organizationPeopleRole.get(userIdB);

      if (userARole === OrganizationPeopleRole.OWNER && userBRole !== OrganizationPeopleRole.OWNER) {
        return -1;
      }
      if (userARole !== OrganizationPeopleRole.OWNER && userBRole === OrganizationPeopleRole.OWNER) {
        return 1;
      }

      if (userARole === OrganizationPeopleRole.ADMIN && userBRole !== OrganizationPeopleRole.ADMIN) {
        return -1;
      }
      if (userARole !== OrganizationPeopleRole.ADMIN && userBRole === OrganizationPeopleRole.ADMIN) {
        return 1;
      }

      const userNameA = usersName.get(userIdA);
      const userNameB = usersName.get(userIdB);
      return userNameA.toLowerCase() < userNameB.toLowerCase() ? -1 : 1;
    }),
);

export const selectCurrentOrganizationActivePeopleWithoutBotCount = createSelector(
  selectCurrentOrganizationActivePeopleWithoutBot,
  (userIds) => userIds.size,
);

export const selectCurrentOrganizationActivePeopleEmails = createSelector(
  selectCurrentOrganizationUserIds,
  selectUsersData,
  (currentOrganizationPeopleIds, usersData) =>
    currentOrganizationPeopleIds.filter((id) => Boolean(usersData.get(id))).map((id) => usersData.get(id).email),
);

export const selectCurrentUserCurrentOrganizationRole = createSelector(
  selectOrganizationsPeopleRoleDomain,
  selectCurrentOrganizationId,
  selectCurrentUserId,
  (organizationsPeopleRole, organizationId, userId) => organizationsPeopleRole.getIn([organizationId, userId]),
);

//args: organizationId
export const selectCurrentUserOrganizationRole = createCachedSelector(
  selectOrganizationsPeopleRoleDomain,
  selectCurrentUserId,
  (_, args) => args.organizationId,
  (organizationsPeopleRole, userId, organizationId) => organizationsPeopleRole.getIn([organizationId, userId]),
)((_, args) => generateSelectorName(args, ['organizationId']));

export const selectIsCurrentUserCurrentOrganizationOwner = createSelector(
  selectCurrentUserCurrentOrganizationRole,
  (organizationRole) => organizationRole === OrganizationPeopleRole.OWNER,
);

//args: organizationId
export const selectIsCurrentUserOrganizationOwner = createCachedSelector(
  selectCurrentUserOrganizationRole,
  (organizationRole) => organizationRole === OrganizationPeopleRole.OWNER,
)((_, args) => generateSelectorName(args, ['organizationId']));

export const selectIsCurrentUserOrganizationAdmin = createSelector(
  selectCurrentUserCurrentOrganizationRole,
  (organizationRole) => adminRoles.includes(organizationRole),
);

export const selectIsCurrentUserOrganizationGuest = createSelector<ApplicationState, OrganizationPeopleRole, boolean>(
  selectCurrentUserCurrentOrganizationRole,
  (organizationRole) => organizationRole === OrganizationPeopleRole.GUEST,
);

export const selectCurrentUserInOrganizationId = createSelector(
  selectUserInOrganizationIdsDomain,
  selectCurrentUserId,
  selectCurrentOrganizationId,
  (userInOrganizationIdsDomain, currentUserId, currentOrganizationId) =>
    userInOrganizationIdsDomain.getIn([currentOrganizationId, currentUserId]),
);

// arg: userId
export const selectAvailableUserRoles = createCachedSelector(
  selectUserOrganizationRole,
  selectCurrentUserCurrentOrganizationRole,
  selectIsCurrentSubscriptionFree,
  (organizationRole, currentUserOrganizationRole, isCurrentSubscriptionFree) => {
    if (organizationRole === OrganizationPeopleRole.OWNER) {
      return emptyList;
    } else {
      let roles = availableRolesMap
        .get(currentUserOrganizationRole, emptyList)
        .filter((role) => role !== organizationRole);

      return roles;
    }
  },
)((_, args) => generateSelectorName(args, ['userId']));

export const selectCurrentUserOrganizationRoles = createSelector(
  selectCurrentUserId,
  selectOrganizationsPeopleRoleDomain,
  (currentUserId, organizationRoles) => {
    let userOrganizationRoles = Map<Id, OrganizationPeopleRole>();
    organizationRoles.map((userInOrganizationRoles, organizationId) => {
      const userRole = userInOrganizationRoles.get(currentUserId);
      userOrganizationRoles = userOrganizationRoles.set(organizationId, userRole);
    });
    return userOrganizationRoles;
  },
);
