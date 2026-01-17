import { fromJS, List } from 'immutable'
import * as constants from './constants'
import * as CurrentUserConstants from '../../domain/CurrentUserModel/constants'
import * as AppModelConstants from '../../domain/AppModel/constants'

const emptyList = new List()

const initialState = fromJS({
  spaceName: '',
  spacePurpose: '',
  spaceMembers: emptyList,
  spaceColor: '',
  isPrivate: false,
  isCurrentUserFollowing: true,
})

function createSpaceReducer(state = initialState, action) {
  switch (action.type) {
    case constants.onChangeSpaceName: {
      return state
        .set('spaceName', action.spaceName)
    }

    case constants.onChangeSpacePurpose: {
      return state
        .set('spacePurpose', action.spacePurpose)
    }

    case constants.onChangeSpaceColor: {
      return state
        .set('spaceColor', action.spaceColor)
    }

    case constants.onChangeSpaceIsPrivate: {
      return state
        .set('isPrivate', action.isPrivate)
    }

    case constants.onChangeIsCurrentUserFollowingSpace: {
      return state
        .set('isCurrentUserFollowing', action.isFollowing)
    }

    case constants.onAddSpaceMember: {
      return state
        .set('spaceMembers', state.get('spaceMembers').push(action.userId))
    }

    case constants.onRemoveSpaceMember: {
      return state
        .set('spaceMembers', state.get('spaceMembers').filterNot(memberId => memberId === action.userId))
    }

    case constants.onResetCreateSpaceData:
    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState

    default:
      return state
  }
}

export default createSpaceReducer
