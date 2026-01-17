import { createSelector } from 'reselect'
import { Map, List } from 'immutable'
import fuzzysearch from 'fuzzysearch'

import { selectProjectTaskIds, selectProjectIdsByTaskIdsDomain, selectTasksDataDomain } from '../../../domain/TasksModel/selectors/domain'

import * as ProjectsModelSelectors from '../../../domain/ProjectsModel/selectors'
import { selectProjectsPeople } from '../../../domain/ProjectsModel/selectors/domain'
import { selectAllUserIds } from '../../../domain/UsersModel/selectors'
import { selectCurrentUserId, selectUsersData } from '../../../domain/UsersModel/selectors/domain'
import { TaskStatus } from '../../../domain/TasksModel/types'
import { EntityStatus } from '../../../domain/EntityModel/types'

const emptyList = new List()
const emptyMap = new Map()

// args: searchString, projectId
export const searchTasks = () => createSelector(
  (_, args) => args.searchString,
  (_, args) => args.projectId,
  (_, args) => args.searchInArchivedProject,
  (_, args) => args.searchInCompletedTasks,
  (_, args) => args.searchInMyTasks,
  selectTasksDataDomain,
  selectProjectTaskIds,
  selectProjectIdsByTaskIdsDomain,
  selectProjectsPeople,
  ProjectsModelSelectors.selectProjectsData,
  selectCurrentUserId,
  (
    searchString = '',
    projectId,
    searchInArchivedProject,
    searchInCompletedTasks,
    searchInMyTasks,
    taskData,
    projectTasks,
    projectIdsByTaskIds,
    projectsPeople,
    projectsData,
    currentUserId
  ) => {
    let taskIds
    if (searchInMyTasks) {
      taskIds = searchTasksInAllTasks(searchString, taskData)
    } else if (projectId) {
      taskIds = searchTasksInProject(searchString, projectTasks, taskData, projectIdsByTaskIds)
    } else {
      taskIds = searchTasksInRoot(searchString, taskData, projectIdsByTaskIds, currentUserId)
    }
    let filteredTasks = taskIds.filter(taskId => {
      let isTaskInPermittedProject = true
      const taskProjectId = projectIdsByTaskIds.get(taskId)
      if (taskProjectId) {
        const projectPeople = projectsPeople.get(taskProjectId)
        const project = projectsData.get(taskProjectId)
        isTaskInPermittedProject = projectPeople ? projectPeople.includes(currentUserId) && (searchInArchivedProject || project.status === EntityStatus.EXISTS) : false
      }
      return isTaskInPermittedProject || searchInMyTasks
    })

    if (!searchInCompletedTasks) {
      filteredTasks = filteredTasks.filter(taskId => taskData.get(taskId).status !== TaskStatus.COMPLETED)
    }
    return filteredTasks
  },
)

function searchTasksInAllTasks(searchString, tasks) {
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchString.toLowerCase()))
  return filteredTasks.keySeq().toList()
}

function searchTasksInProject(searchString, projectTasks, tasks, projectIdsByTaskIds) {
  let filteredProjectTasks = emptyMap
  const filteredTasks = tasks.filter(task =>
    projectTasks.contains(task.id) &&
    task.name.toLowerCase().includes(searchString.toLowerCase()))

  filteredTasks.forEach(task => {
    const projectId = projectIdsByTaskIds.get(task.id) || 'defaultProject'
    if (!filteredProjectTasks.has(projectId)) {
      filteredProjectTasks = filteredProjectTasks.set(projectId, getInitialSearchResult())
    }
    const newTasks = filteredProjectTasks.getIn([projectId, 'taskIds']).push(task.id)
    filteredProjectTasks = filteredProjectTasks.setIn([projectId, 'taskIds'], newTasks)
  })
  return getTaskIdsList(filteredProjectTasks)
}

function searchTasksInRoot(searchString, tasks, projectIdsByTaskIds, currentUserId) {
  let filteredRootTasks = emptyMap
  tasks.forEach(task => {
    const projectId = projectIdsByTaskIds.get(task.id) || 'defaultProject'
    if (task.assigneeId === currentUserId && task.name.toLowerCase().includes(searchString.toLowerCase())) {
      if (!filteredRootTasks.has(projectId)) {
        filteredRootTasks = filteredRootTasks.set(projectId, getInitialSearchResult())
      }
      const newTasks = filteredRootTasks.getIn([projectId, 'taskIds']).push(task.id)
      filteredRootTasks = filteredRootTasks.setIn([projectId, 'taskIds'], newTasks)
    }
  })
  return getTaskIdsList(filteredRootTasks)
}

function getTaskIdsList(filteredProjectTasks) {
  return filteredProjectTasks.reduce((acc, projectTaskIds) => acc.concat(projectTaskIds.get('taskIds')), new List())
}

function getInitialSearchResult() {
  return new Map({
    isEntireProjectShown: false,
    taskIds: emptyList,
  })
}

// args: searchString, projectId
export const searchProjects = () => createSelector(
  ProjectsModelSelectors.selectProjectsData,
  selectCurrentUserId,
  selectProjectsPeople,
  (_, args) => args.searchString,
  (_, args) => args.projectId,
  (projectsData, currentUserId, projectsPeople, searchString = '', projectId) => {
    const filteredProjectsData = projectsData.filter(project => {
      const projectPeople = projectsPeople.get(project.id)
      return projectPeople ? (projectPeople.includes(currentUserId) && project.status === EntityStatus.EXISTS) : false
    })
    const searchResults = filteredProjectsData.filter(project => fuzzysearch(searchString.trim().toLowerCase(), project.name.trim().toLowerCase()))
    return searchResults.keySeq().toList()
  },
)

// args: searchString
// return: List of users Ids matching searchString
export const searchUsers = createSelector(
  selectAllUserIds,
  selectUsersData,
  (_, args) => args.searchString,
  (allUserIds, allUsersData, searchString = '') => allUserIds
    .reduce((matchingUserIds, userId) => {
      const userData = allUsersData.get(userId)
      return userData && checkIfUserMatchTestString(userData, searchString)
        ? matchingUserIds.push(userId)
        : matchingUserIds
    }, emptyList),
)


function checkIfUserMatchTestString(user, testString) {
  if (testString) {
    const firstName = user.firstName ? user.firstName.toLowerCase() : ''
    const lastName = user.lastName ? user.lastName.toLowerCase() : ''
    const email = user.email ? user.email.toLowerCase() : ''
    const lowerCaseTestString = testString.toLowerCase()

    return fuzzysearch(lowerCaseTestString, `${firstName} ${lastName}`) || fuzzysearch(lowerCaseTestString, email)
  } else {
    return false
  }
}
