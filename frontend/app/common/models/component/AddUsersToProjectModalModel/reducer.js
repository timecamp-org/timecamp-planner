import { fromJS } from 'immutable'
import * as constants from './constants'
import * as CurrentUserConstants from '../../domain/CurrentUserModel/constants'
import * as AppModelConstants from '../../domain/AppModel/constants'

const initialState = fromJS({
  projectId: null,
  userIds: null,
})

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case constants.onOpenAddUsersToProjectModal: {
      const { projectId, userIds } = action
      return state
        .set('projectId', projectId)
        .set('userIds', userIds)
    }

    case constants.onCloseAddUsersToProjectModal: {
      return state
        .set('projectId', null)
        .set('userIds', null)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState

    default:
      return state
  }
}

export default searchReducer
