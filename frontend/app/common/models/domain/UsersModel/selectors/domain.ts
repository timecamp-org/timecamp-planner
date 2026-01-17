import { ApplicationState } from 'common/types';
import { Id } from 'common/utils/identifier';
import { List, Map } from 'immutable';
import { selectDeactivatedUserIds } from 'models/domain/OrganizationsModel/selectors/domain';
import { User } from 'models/domain/UsersModel/models';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';
import fixGravatarAvatarUrl from '../../../../utils/fixGravatarAvatarUrl';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { getInitials } from '../../../../utils/getInitials';
import { EntityStatus } from '../../EntityModel/types';
import { domain } from '../constants';
import { DateFormat, TimeFormat } from '../constants/timeSettings';
import {
  Locale,
  RegistrationStatus,
  UserOrganizationIdsInterface,
  UsersDataInterface,
  UsersOnlineStatusInterface,
  UsersState,
} from '../types';
import { getUserNickname } from '../utils';

const emptyMap = Map();
const emptyList = List();

export const selectUsersDomain = (state: ApplicationState): UsersState => state.get(domain);

export const selectUsersData = createImmutableEqualSelector<ApplicationState, UsersState, UsersDataInterface>(
  selectUsersDomain,
  (domain: UsersState): UsersDataInterface => domain.get('usersData')
);

export const selectUsersOrganizations = createSelector<ApplicationState, UsersState, UserOrganizationIdsInterface>(
  selectUsersDomain,
  (domain: UsersState): UserOrganizationIdsInterface => domain.get('userOrganizationIds')
);

export const selectCurrentUserId = createSelector<ApplicationState, UsersState, Id>(
  selectUsersDomain,
  (domain: UsersState): Id => domain.get('currentUserId')
);

export const selectUsersOnlineStatus = createSelector<ApplicationState, UsersState, UsersOnlineStatusInterface>(
  selectUsersDomain,
  (domain: UsersState): UsersOnlineStatusInterface => domain.get('userOnlineStatus')
);

export const selectUsersFirstName = createImmutableEqualSelector<ApplicationState, UsersDataInterface, Map<Id, string>>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<Id, string> =>
    usersData.map((userData) => userData.get('firstName')) as Map<Id, string>
);

export const selectUsersLastName = createImmutableEqualSelector<ApplicationState, UsersDataInterface, Map<Id, string>>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<Id, string> =>
    usersData.map((userData) => userData.get('lastName')) as Map<Id, string>
);

export const selectUsersEmail = createImmutableEqualSelector<ApplicationState, UsersDataInterface, Map<Id, string>>(
  selectUsersData,
  (usersData: UsersDataInterface) => usersData.map((userData) => userData.get('email')) as Map<Id, string>
);

export const selectCurrentUser = createSelector<ApplicationState, UsersDataInterface, Id, User>(
  selectUsersData,
  selectCurrentUserId,
  (allUsers: Map<string, User>, currentUserId: Id) => allUsers.get(currentUserId) as User | undefined
);

export const selectCurrentUserFirstName = createSelector<ApplicationState, User, string>(
  selectCurrentUser,
  (currentUser: User): string => (currentUser ? currentUser.firstName || '' : '')
);

export const selectCurrentUserLastName = createSelector<ApplicationState, User, string>(
  selectCurrentUser,
  (currentUser: User): string => (currentUser ? currentUser.lastName || '' : '')
);

export const selectCurrentUserFullName = createSelector<ApplicationState, User, string>(
  selectCurrentUser,
  (currentUser: User): string => (currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}` : '')
);

export const selectCurrentUserNickname = createSelector<ApplicationState, User, string>(
  selectCurrentUser,
  (currentUser: User): string => (currentUser ? currentUser.nickname || currentUser.email.split('@')[0] || '' : '')
);

export const selectCurrentUserEmail = createSelector(selectCurrentUser, (currentUser: User): string =>
  currentUser ? currentUser.email || '' : ''
);

export const selectCurrentUserAvatarUrl = createSelector(selectCurrentUser, (currentUser: User): string =>
  currentUser ? currentUser.avatarUrl || '' : ''
);

export const selectCurrentUserCreatedAt = createSelector(
  selectCurrentUser,
  (currentUser: User): number => currentUser?.createdAt
);

export const selectCurrentUserOrganizationIds = createSelector<
  ApplicationState,
  Id,
  UserOrganizationIdsInterface,
  List<Id>
>(
  selectCurrentUserId,
  selectUsersOrganizations,
  (currentUserId: Id, userOrganizationIds: UserOrganizationIdsInterface): List<Id> =>
    userOrganizationIds.get(currentUserId) || (emptyList as List<Id>)
);

export const selectUser = createCachedSelector<ApplicationState, { userId: Id }, UsersDataInterface, Id, User>(
  selectUsersData,
  (_, args): Id => args.userId,
  (usersData: UsersDataInterface, userId: Id): User => usersData.get(userId)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserFirstName = createCachedSelector<ApplicationState, { userId: Id }, User, string>(
  selectUser,
  (user: User): string => (user ? user.firstName || '' : '')
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserLastName = createCachedSelector<ApplicationState, { userId: Id }, User, string>(
  selectUser,
  (user: User): string => (user ? user.lastName || '' : '')
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserFullName = createCachedSelector<ApplicationState, { userId: Id }, User, string>(
  selectUser,
  (user: User): string => (user ? `${user.firstName || ''} ${user.lastName || ''}` : '').trim()
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserNickname = createCachedSelector<ApplicationState, { userId: Id }, User, Id>(
  selectUser,
  (user: User): Id => getUserNickname(user)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserFullNameOrNickname = createCachedSelector<
  ApplicationState,
  { userId: Id },
  string,
  string,
  string
>(selectUserFullName, selectUserNickname, (fullName: string, nickname: string): string =>
  fullName.length > 0 ? fullName : nickname
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserEmail = createCachedSelector<ApplicationState, { userId: Id }, User, string>(
  selectUser,
  (user: User): string => (user ? user.email.toLowerCase() : '')
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserAvatarUrl = createCachedSelector<ApplicationState, { userId: Id }, User, string>(
  selectUser,
  (user: User): string => {
    if (!user || !user.avatarUrl) {
      return '';
    }

    return fixGravatarAvatarUrl(user.avatarUrl);
  }
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserTimeFormat = createCachedSelector<ApplicationState, { userId: Id }, User, string>(
  selectUser,
  (user: User): string => (user ? user.timeFormat : TimeFormat.HoursMinutes)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserIsExist = createCachedSelector<ApplicationState, { userId: Id }, User, boolean>(
  selectUser,
  (user: User): boolean => (user ? true : false)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserIsBot = createCachedSelector<ApplicationState, { userId: Id }, User, boolean>(
  selectUser,
  (user: User): boolean => (user ? user.get('isBot') : false)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserRegistrationStatus = createCachedSelector<
  ApplicationState,
  { userId: Id },
  User,
  RegistrationStatus
>(
  selectUser,
  (user: User): RegistrationStatus => (user ? user.get('registrationStatus') : null)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUsersRegistrationStatus = createSelector<
  ApplicationState,
  UsersDataInterface,
  Map<Id, RegistrationStatus>
>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<Id, RegistrationStatus> =>
    usersData.map((user) => user.get('registrationStatus')) as Map<Id, RegistrationStatus>
);

export const selectIsUserRegistered = createCachedSelector<
  ApplicationState,
  { userId: Id },
  RegistrationStatus,
  boolean
>(
  selectUserRegistrationStatus,
  (registrationStatus: RegistrationStatus): boolean => registrationStatus === RegistrationStatus.REGISTERED
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserAccountStatus = createCachedSelector<ApplicationState, { userId: Id }, User, EntityStatus>(
  selectUser,
  (user: User): EntityStatus => (user ? user.get('status') : null)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectIsUserAccountDeleted = createCachedSelector<ApplicationState, { userId: Id }, EntityStatus, boolean>(
  selectUserAccountStatus,
  (status: EntityStatus): boolean => status === EntityStatus.DELETED
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUserInitials = createCachedSelector<
  ApplicationState,
  { userId: Id },
  string,
  string,
  string,
  string
>(
  selectUserFirstName,
  selectUserLastName,
  selectUserEmail,
  (firstName: string, lastName: string, email: string): string => getInitials(firstName, lastName, email)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectCurrentUserLocale = createSelector(
  selectCurrentUser,
  (currentUser: User): Locale => (currentUser && currentUser.locale ? currentUser.locale : 'en')
);

export const selectUsersNicknames = createSelector<ApplicationState, UsersDataInterface, Map<Id, string>>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<Id, string> => usersData.map(getUserNickname) as Map<Id, string>
);

export const selectUserIsOnline = createCachedSelector<
  ApplicationState,
  { userId: Id },
  UsersOnlineStatusInterface,
  Id,
  boolean
>(
  selectUsersOnlineStatus,
  (_, args): Id => args.userId,
  (userOnlineStatus: UsersOnlineStatusInterface, userId: Id): boolean => userOnlineStatus.get(userId)
)((_, args) => generateSelectorName(args, ['userId']));

export const selectUsersName = createImmutableEqualSelector<ApplicationState, UsersDataInterface, Map<Id, string>>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<Id, string> => {
    let result = emptyMap as Map<Id, string>;

    if (usersData) {
      usersData.forEach((user, userId) => {
        const firstName = user.get('firstName');
        const lastName = user.get('lastName');
        const email = user.get('email');
        result = result.set(userId, firstName && lastName ? `${firstName} ${lastName}` : `${email}`);
      });
    }

    return result;
  }
);

export const selectUsersSearchName = createImmutableEqualSelector<
  ApplicationState,
  UsersDataInterface,
  Map<Id, string>
>(selectUsersData, (usersData: UsersDataInterface): Map<Id, string> => {
  let result = emptyMap as Map<Id, string>;

  if (usersData) {
    usersData.forEach((user, userId) => {
      const firstName = `${user.get('firstName')} ` || '';
      const lastName = `${user.get('lastName')} ` || '';
      const email = user.get('email') || '';
      result = result.set(userId, `${firstName}${lastName}${email}`);
    });
  }
  return result;
});

export const selectUsersAvatarUrl = createImmutableEqualSelector<ApplicationState, UsersDataInterface, Map<Id, string>>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<Id, string> =>
    usersData.map((userData) => userData.get('avatarUrl')) as Map<Id, string>
);

export const selectUserByEmail = createCachedSelector<
  ApplicationState,
  { email: string },
  UsersDataInterface,
  string,
  User
>(
  selectUsersData,
  (_, args) => args.email,
  (usersData: UsersDataInterface, email: string): User =>
    usersData
      .valueSeq()
      .filter((user) => user.email === email.toLowerCase())
      .first()
)((_, args) => generateSelectorName(args, ['email']));

export const selectCurrentUserDateFormat = createSelector<ApplicationState, User, string>(
  selectCurrentUser,
  (currentUser: User): string =>
    currentUser && currentUser.dateFormat ? currentUser.dateFormat : DateFormat.DayMonthYear
);

export const selectCurrentUserFirstDayOfWeek = createSelector<ApplicationState, User, number>(
  selectCurrentUser,
  (currentUser: User): number =>
    currentUser && typeof currentUser.firstDayOfWeek !== 'undefined' ? currentUser.firstDayOfWeek : 1
);

export const selectUserIdsByEmails = createSelector<ApplicationState, UsersDataInterface, Map<string, Id>>(
  selectUsersData,
  (usersData: UsersDataInterface): Map<string, Id> => {
    let result = emptyMap as Map<string, Id>;

    if (usersData) {
      usersData.forEach((user, userId) => {
        result = result.set(user.email, userId);
      });
    }

    return result;
  }
);

export const selectActiveUsersSortedByFullName = createSelector(
  selectUsersData,
  selectDeactivatedUserIds,
  (users, deactivatedUsers) =>
    users
      .toArray()
      .filter(({ id, isBot }) => !deactivatedUsers.includes(id) && !isBot)
      .sort((a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`))
);
