
import * as constants from './constants'

export function onChangeCurrentScene(scene) {
  return {
    type: constants.onChangeCurrentScene,
    scene,
  }
}

export function onChangeCurrentProjectId(projectId) {
  return {
    type: constants.onChangeCurrentProjectId,
    projectId,
  }
}

export function onChangeCurrentConversationId(conversationId) {
  return {
    type: constants.onChangeCurrentConversationId,
    conversationId,
  }
}

export function onSetIsDrawerNavigationOpened(isOpened) {
  return {
    type: constants.onSetIsDrawerNavigationOpened,
    isOpened,
  }
}

export function onSetIsCardMoreOptionsActionSheetOpened(isOpened) {
  return {
    type: constants.onSetIsCardMoreOptionsActionSheetOpened,
    isOpened,
  }
}

export function onSetIsNavigationStateLoaded(isLoaded) {
  return {
    type: constants.onSetIsNavigationStateLoaded,
    isLoaded,
  }
}
