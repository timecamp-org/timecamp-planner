import * as constants from './constants'

export function onOpenAddUsersToProjectModal(projectId, userIds) {
  return {
    type: constants.onOpenAddUsersToProjectModal,
    projectId,
    userIds,
  }
}

export function onCloseAddUsersToProjectModal() {
  return {
    type: constants.onCloseAddUsersToProjectModal,
  }
}
