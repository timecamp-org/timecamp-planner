import { fromJS } from 'immutable'
import * as Constants from './constants'
import * as UserAppsConstants from '../UserAppsModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'


const initialState = fromJS({
  clientsData: {},
  isOAuth1Authorized: {},
})

function oauthReducer(state = initialState, action) {
  switch (action.type) {
    case Constants.onLoadOAuthClientDataSuccess: {
      const { client } = action
      return state
        .setIn(['clientsData', client.id], client)
    }
    case UserAppsConstants.onCreateUserAppSuccess:
    case UserAppsConstants.onCreateUserAppData:
    case UserAppsConstants.onCreateUserInApp:
    case UserAppsConstants.onUpdateUserAppSuccess: {
      const { oAuthClient } = action.payload
      return state
        .setIn(['clientsData', oAuthClient.id], oAuthClient)
    }
    case UserAppsConstants.onDeleteUserAppSuccess: {
      const { oAuthClientId } = action.payload
      return state
        .deleteIn(['clientsData', oAuthClientId])
    }
    case UserAppsConstants.onRegenerateClientSecretSuccess: {
      const { oAuthClientId, oAuthClientSecret } = action.payload
      return state
        .setIn(['clientsData', oAuthClientId, 'clientSecret'], oAuthClientSecret)
    }
    case Constants.onBatchClientsData: {
      const { clientsData } = action
      return state
        .set('clientsData', state.get('clientsData').merge(clientsData))
    }
    case Constants.onSetOAuth1AuthorizedApplications: {
      let newState = state
      action.applicationNames.forEach(name => {
        newState = newState.setIn(['isOAuth1Authorized', name], true)
      })
      return newState
    }
    case Constants.onSetIsOAuth1Authorized: {
      return state
        .setIn(['isOAuth1Authorized', action.applicationName], action.isAuthorized)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState

    default:
      return state
  }
}

export default oauthReducer
