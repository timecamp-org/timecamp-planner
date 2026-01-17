import { Map, List } from 'immutable'

import { OrganizationPeopleRole } from '../OrganizationsModel/types'
import { Id } from '../../../utils/identifier';
import { ProjectsData, ProjectsPeopleRole, ProjectInterface, ProjectRole, ProjectType } from '../ProjectsModel/types';
import { ItemOrderByContainerId } from '../../../types';
import { PermissionGrant } from './constants';

const emptyList = List<Id>()
const emptyMap = Map()

/**
 * @param {string} userId
 * @param {string} organizationRole
 * @param {object} projectData
 * @param {object} projectPeopleRole
 * @param {string} action
 */
export const checkIfUserHasAccessToProject = (
  userId: Id,
  organizationRole: OrganizationPeopleRole,
  projectData: ProjectInterface,
  projectPeopleRole: ProjectRole,
  permissionGrant: PermissionGrant,
) => {
  let result = false
  if (projectData.projectType === ProjectType.PROJECT && (projectData.isPrivate || organizationRole === OrganizationPeopleRole.GUEST)) {
    const userRole = projectPeopleRole.get(userId)
    if (userRole) {
      // TODO: handle user role and action
      result = true
    }
  } else {
    result = true
  }

  return result
}

/**
 * @param {string} userId
 * @param {string} organizationRole
 * @param {object} projectData
 * @param {object} projectPeopleRole
 * @param {object} taskData
 * @param {object} taskPeopleRole
 * @param {string} action
 */
export const checkIfUserHasAccessToTask = (
  userId: Id,
  organizationRole: OrganizationPeopleRole,
  projectData: ProjectInterface,
  projectPeopleRole: ProjectRole,
  taskData,
  taskPeopleRole,
  action,
) => {
  let result = false
  const hasAccessToProject = checkIfUserHasAccessToProject(userId, organizationRole, projectData, projectPeopleRole, action)

  if (hasAccessToProject) {
    // TODO: handle user role and action
    result = true
  }

  return result
}

export const filterImmutableObjectByKeys = <T>(data: Map<string, T>, keys: string[] | List<string>) => 
  data.filter((value, key) => keys.indexOf(key) !== -1) as Map<string, T>


export const filterImmutableObjectByValues = (data: Map<string, any>, keys: string[] | List<string>) => 
  data.filter((value) => keys.indexOf(value) !== -1) as Map<string, any> 


/** PROJECTS */
export function getCurrentUserAccessibleProjects(userId: Id, projectsData: ProjectsData, projectsPeopleRole: ProjectsPeopleRole) {
  let result = emptyMap

  projectsData.forEach((projectData, projectId) => {
    const projectPeopleRole = projectsPeopleRole.get(projectId)

    if (projectData && projectPeopleRole) {
      const hasAccess = checkIfUserHasAccessToProject(
        userId,
        OrganizationPeopleRole.MEMBER,
        projectData,
        projectPeopleRole,
        PermissionGrant.VIEW,
      )

      if (hasAccess) {
        result = result.set(projectId, projectData)
      }
    }
  })

  return result
}

export function getCurrentUserAccessibleProjectIds(userId: Id, projectsData: ProjectsData, projectsPeopleRole: ProjectsPeopleRole, organizationRole: OrganizationPeopleRole) {
  let result = emptyList

  projectsData.forEach((projectData, projectId) => {
    const projectPeopleRole = projectsPeopleRole.get(projectId) || emptyMap as ProjectRole

    if (projectData && projectPeopleRole) {
      const hasAccess = checkIfUserHasAccessToProject(
        userId,
        organizationRole,
        projectData,
        projectPeopleRole,
        PermissionGrant.VIEW,
      )

      if (hasAccess) {
        result = result.push(projectId)
      }
    }
  })
  return result
}

/** LISTS */
export function getCurrentUserAccessibleTaskLists(accessibleProjectIds: List<Id>, listIdsOrderByProjectIds: ItemOrderByContainerId) {
  let result = emptyMap

  listIdsOrderByProjectIds.forEach((listIds, projectId) => {
    if (accessibleProjectIds.indexOf(projectId) !== -1) {
      result = result.set(projectId, listIds)
    }
  })

  return result
}

export function getCurrentUserAccessibleTaskListIds(accessibleProjectIds: List<Id>, listIdsOrderByProjectIds: ItemOrderByContainerId) {
  let result = emptyList

  listIdsOrderByProjectIds.forEach((listsOrder, projectId) => {
    if (accessibleProjectIds.indexOf(projectId) !== -1) {
      const listIds = listsOrder.keySeq().toList()
      result = result.concat(listIds) as List<string>
    }
  })

  return result
}

/** TASKS */
export function getCurrentUserAccessibleTasks(accessibleListIds: List<Id>, tasksOrderByListId: ItemOrderByContainerId) {
  let result = emptyMap

  tasksOrderByListId.forEach((taskIds, listId) => {
    if (accessibleListIds.indexOf(listId) !== -1) {
      result = result.set(listId, taskIds)
    }
  })

  return result
}

export function getCurrentUserAccessibleTaskIds(accessibleListIds: List<Id>, tasksOrderByListId: ItemOrderByContainerId) {
  let result = emptyList

  tasksOrderByListId.forEach((tasksOrder, listId) => {
    if (accessibleListIds.indexOf(listId) !== -1) {
      const taskIds = Object.keys(tasksOrder.toJS())
      result = result.concat(taskIds) as List<string>
    }
  })

  return result
}
