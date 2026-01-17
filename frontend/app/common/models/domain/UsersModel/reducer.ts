import { Reducer } from 'common/node_modules/typesafe-actions';
import { PayloadAction } from 'common/types';
import { removeIdFromList } from 'common/utils/immutableUtils';
import { fromJS, List } from 'immutable';
import isNil from 'lodash/isNil';
import { ActionResultPayload } from 'models/domain/ActionResultModel';
import {
  OnBatchOrganizationsDataPayload,
  OnDeleteUserInOrganizationDataPayload,
} from 'models/domain/OrganizationsModel/payloads';
import {
  OnAvatarUpdatePayload,
  OnBatchUserOnlineStatusPayload,
  OnBatchUsersDataPayload,
  OnCreateUserOrganizationsPayload,
  OnEmailUpdatePayload,
  OnFirstNameUpdatePayload,
  OnLastNameUpdatePayload,
  OnNicknameUpdatePayload,
  OnSetIsUserOnlinePayload,
  OnUpdateUserDataPayload,
  UserIdPayload,
  UserPayload,
} from 'models/domain/UsersModel/payloads';
import { UserInterface, UsersState } from 'models/domain/UsersModel/types';
import * as AppModelConstants from '../AppModel/constants';
import * as CurrentUserConstants from '../CurrentUserModel/constants';
import { EntityStatus } from '../EntityModel/types';
import * as OrganizationsModelConstants from '../OrganizationsModel/constants';
import * as UserAppsConstants from '../UserAppsModel/constants';
import * as UserConstants from './constants';
import { User } from './models';

const emptyList = List();

const initialState: UsersState = fromJS({
  currentUserId: null,
  isAuthenticating: true,
  usersData: {},
  userOnlineStatus: {},
  userOrganizationIds: {},
});

const usersReducer: Reducer<UsersState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case UserConstants.onCreateUser: {
      const { user }: UserPayload = action.payload;
      return state.setIn(['usersData', user.id], new User(user));
    }
    case UserAppsConstants.onCreateUserInApp: {
      const { usersData } = action.payload;
      return state.set('usersData', state.get('usersData').merge(usersData));
    }
    case UserConstants.onCreateUserOrganizations: {
      const { userId, userOrganizations }: OnCreateUserOrganizationsPayload = action.payload;
      return state.setIn(['userOrganizationIds', userId], userOrganizations);
    }
    case UserConstants.currentUserId: {
      const { userId }: UserIdPayload = action.payload;
      return state.set('currentUserId', userId);
    }
    case UserConstants.onUpdateUserSuccess: {
      const { actionResult }: ActionResultPayload<UserInterface> = action.payload;
      return state.setIn(['usersData', actionResult.data.user.id], actionResult.data.user);
    }

    case UserConstants.onDeleteUser: {
      const { userId }: UserIdPayload = action.payload;
      return state.deleteIn(['usersData', userId]);
    }

    case UserConstants.onBatchUsersData: {
      const { usersData }: OnBatchUsersDataPayload = action.payload;
      return state.set('usersData', state.get('usersData').merge(usersData));
    }

    case UserConstants.onBatchUserOnlineStatus: {
      const { userOnlineStatus }: OnBatchUserOnlineStatusPayload = action.payload;
      return state.set('userOnlineStatus', state.get('userOnlineStatus').merge(userOnlineStatus));
    }

    case UserConstants.onCreateUserData:
    case UserConstants.onUpdateUserData: {
      const { userData, isOnline }: OnUpdateUserDataPayload = action.payload;
      return state.setIn(['usersData', userData.id], userData).setIn(['userOnlineStatus', userData.id], isOnline);
    }

    case OrganizationsModelConstants.onBatchOrganizationsData: {
      const { organizations, userId }: OnBatchOrganizationsDataPayload = action.payload;
      return state.setIn(['userOrganizationIds', userId], organizations.keySeq().toList());
    }

    case OrganizationsModelConstants.onUpdateUserInOrganizationDataSuccess:
    case OrganizationsModelConstants.onCreateUserInOrganizationData: {
      const { userId, organizationId, userInOrganization, user } = action.payload;
      const status = userInOrganization.entityStatus;
      let currentState = state;
      currentState = currentState.updateIn(['userOrganizationIds', userId], (list) => {
        if (!list) {
          return List([organizationId]);
        }
        if (status !== EntityStatus.EXISTS) {
          return list.filter((orgId) => orgId !== organizationId);
        }
        if (!list.includes(organizationId)) {
          return list.push(organizationId);
        }
        return list;
      });
      if (user) {
        currentState = currentState.setIn(['usersData', userId], user);
        if (!isNil(user.isOnline)) {
          currentState = currentState.setIn(['userOnlineStatus', userId], user.isOnline);
        }
      }
      return currentState;
    }

    case OrganizationsModelConstants.onDeleteUserInOrganizationData: {
      const { userId, organizationId }: OnDeleteUserInOrganizationDataPayload = action.payload;
      return state.updateIn(['userOrganizationIds', userId], removeIdFromList(organizationId));
    }

    case UserConstants.onFirstNameUpdate: {
      const { firstName, userId }: OnFirstNameUpdatePayload = action.payload;
      return state.setIn(['usersData', userId, 'firstName'], firstName);
    }
    case UserConstants.onLastNameUpdate: {
      const { lastName, userId }: OnLastNameUpdatePayload = action.payload;
      return state.setIn(['usersData', userId, 'lastName'], lastName);
    }
    case UserConstants.onNicknameUpdate: {
      const { nickname, userId }: OnNicknameUpdatePayload = action.payload;
      return state.setIn(['usersData', userId, 'nickname'], nickname);
    }
    case UserConstants.onEmailUpdate: {
      const { email, userId }: OnEmailUpdatePayload = action.payload;
      return state.setIn(['usersData', userId, 'email'], email);
    }
    case UserConstants.onAvatarUpdate: {
      const { avatarUrl, userId }: OnAvatarUpdatePayload = action.payload;
      return state.setIn(['usersData', userId, 'avatarUrl'], avatarUrl);
    }
    case UserConstants.onSetIsUserOnline: {
      const { isOnline, userId }: OnSetIsUserOnlinePayload = action.payload;
      return state.setIn(['userOnlineStatus', userId], isOnline);
    }

    case OrganizationsModelConstants.onPurgeUsersInOrganizationData:
    case AppModelConstants.onCleanModels: {
      const currentUserId = state.get('currentUserId');
      const currentUserData = state.getIn(['usersData', currentUserId]);
      const currentUserOrganizations = state.getIn(['userOrganizationIds', currentUserId]);
      return initialState
        .set('currentUserId', currentUserId)
        .setIn(['usersData', currentUserId], currentUserData)
        .setIn(['userOrganizationIds', currentUserId], currentUserOrganizations)
        .setIn(['userOnlineStatus', currentUserId], true);
    }

    case CurrentUserConstants.onSignOutSuccess:
      return initialState;
    default:
      return state;
  }
};

export default usersReducer;
