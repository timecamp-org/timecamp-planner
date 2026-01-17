import { fromJS, List, Map } from 'immutable'
import * as Constants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { Reducer } from 'redux';
import { PayloadAction } from '../../../types';
import { UserAppsState, AppUserRole } from './types';
import { Id } from 'common/utils/identifier';
import { pushUniqToList, filterList } from 'common/utils/immutableUtils';

const emptyMap = Map()

// export initial state for testing
export const initialState: UserAppsState = fromJS({
  oAuthClientIdByAppId: {},
  appUserIds: {},
  appUsersRole: {},
})

const appsReducer: Reducer<UserAppsState, PayloadAction> = (state: UserAppsState = initialState, action: PayloadAction): UserAppsState => {
  switch (action.type) {
    case Constants.onCreateUserAppSuccess: {
      const { appId, oAuthClient, currentUserId } = action.payload
      return state
        .setIn(['oAuthClientIdByAppId', appId], oAuthClient.id)
        .setIn(['appUserIds', appId], List([currentUserId]))
        .setIn(['appUsersRole', appId, currentUserId], AppUserRole.OWNER)
    }
    case Constants.onCreateUserAppData: {
      const { app, oAuthClient } = action.payload
      return state
        .setIn(['oAuthClientIdByAppId', app.id], oAuthClient.id)
    }
    case Constants.onDeleteUserAppData: {
      const { appId } = action.payload
      return state
        .deleteIn(['oAuthClientIdByAppId', appId])
    }
    case Constants.onUpdateUserAppSuccess: {
      const { appId, oAuthClient } = action.payload
      return state
        .setIn(['oAuthClientIdByAppId', appId], oAuthClient.id)
    }
    case Constants.onCreateUserInApp: {
      const { appId, app, appUserIds, appUsersRole} = action.payload
      return state
        .setIn(['oAuthClientIdByAppId', appId], app.oauthClientId)
        .setIn(['appUserIds', appId], appUserIds)
        .setIn(['appUsersRole', appId], state.getIn(['appUsersRole', appId], emptyMap).merge(appUsersRole))
    }
    case Constants.onDeleteUserInApp: {
      const { appId, userId } = action.payload
      return state
        .updateIn(['appUserIds', appId], list => filterList<Id>(list, userId))
        .deleteIn(['appUsersRole', appId, userId])
    }
    case Constants.onDeleteUserAppSuccess: {
      const { appId } = action.payload
      return state.deleteIn(['oAuthClientIdByAppId', appId])
    }
    case Constants.onBatchOAuthClientIdByAppId: {
      const { oAuthClientIdByAppId } = action.payload
      return state.set('oAuthClientIdByAppId', state.get('oAuthClientIdByAppId').merge(oAuthClientIdByAppId))
    }
    case Constants.onBatchAppUserIds: {
      const { appUserIds } = action.payload
      return state.set('appUserIds', state.get('appUserIds').merge(appUserIds))
    }
    case Constants.onBatchAppUsersRole: {
      const { appUsersRole } = action.payload
      return state.set('appUsersRole', state.get('appUsersRole').merge(appUsersRole))
    }
    case Constants.onInviteCollaboratorSuccess:
    case Constants.onAddCollaborator: {
      const { appId, userId, role } = action.payload
      return state
        .updateIn(['appUserIds', appId], list => pushUniqToList<Id>(list, userId))
        .setIn(['appUsersRole', appId, userId], role)
    }
    case Constants.onRemoveCollaborator: {
      const { appId, userId } = action.payload
      return state
        .updateIn(['appUserIds', appId], list => filterList<Id>(list, userId))
        .deleteIn(['appUsersRole', appId, userId])
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default:
      return state
  }
}

export default appsReducer
