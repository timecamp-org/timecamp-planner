import { fromJS } from 'immutable'

import * as constants from './constants'

const initialState = fromJS({
  currentScene: null,
  currentProjectId: null,
  currentConversationId: null,
  isDrawerNavigationOpened: false,
  isCardMoreOptionsActionSheetOpened: false,
  isNavigationStateLoaded: false,
})

function NavigationModelReducer(state = initialState, action) {
  switch (action.type) {
    case constants.onChangeCurrentScene: {
      return state
        .set('currentScene', action.scene)
    }
    case constants.onChangeCurrentProjectId: {
      return state
        .set('currentProjectId', action.projectId)
    }
    case constants.onChangeCurrentConversationId: {
      return state
        .set('currentConversationId', action.conversationId)
    }
    case constants.onSetIsDrawerNavigationOpened: {
      return state
        .set('isDrawerNavigationOpened', action.isOpened)
    }
    case constants.onSetIsCardMoreOptionsActionSheetOpened: {
      return state
        .set('isCardMoreOptionsActionSheetOpened', action.isOpened)
    }
    case constants.onSetIsNavigationStateLoaded: {
      return state
        .set('isNavigationStateLoaded', action.isLoaded)
    }
    default:
      return state
  }
}

export default NavigationModelReducer
