import * as SearchConstants from './constants';

export function searchTasks(searchString, projectId, searchInArchivedProject, searchInCompletedTasks, searchInMyTasks) {
  return {
    type: SearchConstants.searchTasks,
    searchString,
    projectId,
    searchInArchivedProject,
    searchInCompletedTasks,
    searchInMyTasks,
  };
}

export function searchTasksSuccess(actionResult) {
  return {
    type: SearchConstants.searchTasksSuccess,
    actionResult,
  };
}

export function searchTasksFailure(actionResult) {
  return {
    type: SearchConstants.searchTasksFailure,
    actionResult,
  };
}

export function searchTasksClear() {
  return {
    type: SearchConstants.searchTasksClear,
  };
}

export function searchTasksShowEntireProject(projectId, isShown) {
  return {
    type: SearchConstants.searchTasksShowEntireProject,
    projectId,
    isShown,
  };
}

export function searchProjects(searchString, projectId) {
  return {
    type: SearchConstants.searchProjects,
    searchString,
    projectId,
  };
}

export function searchFiles(searchString) {
  return {
    type: SearchConstants.searchFiles,
    searchString,
  };
}

export function searchProjectsSuccess(actionResult) {
  return {
    type: SearchConstants.searchProjectsSuccess,
    actionResult,
  };
}

export function searchProjectsFailure(actionResult) {
  return {
    type: SearchConstants.searchProjects,
    actionResult,
  };
}

export function searchProjectsClear() {
  return {
    type: SearchConstants.searchProjectsClear,
  };
}

export function searchProjectsAndTasks(searchString, projectId) {
  return {
    type: SearchConstants.searchProjectsAndTasks,
    searchString,
    projectId,
  };
}

export function searchUsers(searchString) {
  return {
    type: SearchConstants.searchUsers,
    searchString,
  };
}

export function searchUsersSuccess(actionResult) {
  return {
    type: SearchConstants.searchUsersSuccess,
    actionResult,
  };
}

export function searchUsersFailure(actionResult) {
  return {
    type: SearchConstants.searchUsersFailure,
    actionResult,
  };
}

export function searchUsersClear() {
  return {
    type: SearchConstants.searchUsersClear,
  };
}
