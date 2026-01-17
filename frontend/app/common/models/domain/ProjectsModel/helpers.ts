import {
  ProjectType,
  ProjectInterface,
  ProjectPeopleRole,
  PrepareProjectPeopleResult,
  UserInProject,
  ProjectsData,
  ProjectRole,
} from './types';
import { List, Map } from 'immutable';
import { Id } from '../../../utils/identifier';
import { ObjectIdChatNotificationSettingsType, ChatNotificationSettingsType } from '../NotificationsModel/types';
import fuzzysearch from 'fuzzysearch';

const emptyList = List();
const emptyMap = Map();

export const managerRoles = [ProjectPeopleRole.OWNER, ProjectPeopleRole.MANAGER];

export function getProjectTypeByPeople(projectPeople: List<Id>, isConversation: boolean): ProjectType {
  if (isConversation) {
    if (projectPeople.size > 2) {
      return ProjectType.GROUP_CHAT;
    } else {
      return ProjectType.DIRECT_CHAT;
    }
  } else {
    return ProjectType.PROJECT;
  }
}

export function isProjectGroupOrDirectChat(project: ProjectInterface): boolean {
  return isProjectGroupChat(project) || isProjectDirectChat(project);
}

export function isProjectGroupOrDirectChatByType(projectType: ProjectType): boolean {
  return [ProjectType.GROUP_CHAT, ProjectType.DIRECT_CHAT].includes(projectType);
}

export function isProjectGroupChat(project: ProjectInterface): boolean {
  return project ? project.projectType === ProjectType.GROUP_CHAT : false;
}

export function isProjectDirectChat(project: ProjectInterface): boolean {
  return project ? project.projectType === ProjectType.DIRECT_CHAT : false;
}

export function prepareProjectPeople(
  projectPeople: Id[],
  currentUserId: Id,
  projectId: Id
): PrepareProjectPeopleResult {
  let projectPeopleRole = emptyMap as Map<Id, ProjectPeopleRole>;
  let projectPeopleIds = emptyList as List<Id>;
  const rawProjectPeople: UserInProject[] = [];

  if (projectPeople) {
    projectPeopleIds = List(projectPeople);
    projectPeopleRole = Map({ [currentUserId]: ProjectPeopleRole.MANAGER });
    projectPeople.forEach((userId) => {
      projectPeopleRole = projectPeopleRole.set(userId, ProjectPeopleRole.MEMBER);
      rawProjectPeople.push({
        userId,
        role: ProjectPeopleRole.MEMBER,
        projectId,
      });
    });
  } else {
    projectPeopleIds = List([currentUserId]);
    rawProjectPeople.push({
      userId: currentUserId,
      role: ProjectPeopleRole.MANAGER,
      projectId,
    });
    projectPeopleRole = Map({ [currentUserId]: ProjectPeopleRole.MANAGER });
  }

  return {
    projectPeopleIds,
    projectPeopleRole,
    rawProjectPeople,
  };
}

export function sortSpaces(
  spaceIds: List<Id>,
  projectsData: ProjectsData,
  chatNotificationSettingsTypeMap: ObjectIdChatNotificationSettingsType
): List<Id> {
  return spaceIds.sort((projectIdA, projectIdB) => {
    const isProjectAMuted = chatNotificationSettingsTypeMap.get(projectIdA) === ChatNotificationSettingsType.NOTHING;
    const isProjectBMuted = chatNotificationSettingsTypeMap.get(projectIdB) === ChatNotificationSettingsType.NOTHING;

    if (isProjectAMuted && !isProjectBMuted) {
      return 1;
    }

    if (!isProjectAMuted && isProjectBMuted) {
      return -1;
    }

    const projectNameA = (projectsData.getIn([projectIdA, 'name']) || '').toUpperCase();
    const projectNameB = (projectsData.getIn([projectIdB, 'name']) || '').toUpperCase();
    return projectNameA < projectNameB ? -1 : projectNameA > projectNameB ? 1 : 0;
  }) as List<Id>;
}

export function filterSpaces(projectsData, spaceIds: List<Id>, filter: string) {
  return spaceIds.filter((projectId) => {
    const projectNameUpperCase = (projectsData.getIn([projectId, 'name']) || '').toUpperCase();
    const filterUpperCase = filter.toUpperCase();

    if (!filter) {
      return true;
    }

    return fuzzysearch(filterUpperCase, projectNameUpperCase);
  });
}

export function sortProjectMembers(
  projectIds: List<Id>,
  projectPeopleRole: ProjectRole,
  usersName: Map<Id, string>
): List<Id> {
  return projectIds.sort((userIdA, userIdB) => {
    const roleA = projectPeopleRole.get(userIdA);
    const roleB = projectPeopleRole.get(userIdB);

    if (managerRoles.includes(roleA)) {
      return 1;
    }

    if (managerRoles.includes(roleB)) {
      return 1;
    }

    const userNameA = usersName.get(userIdA) || '';
    const userNameB = usersName.get(userIdB) || '';

    return userNameA.toLowerCase() < userNameB.toLowerCase() ? -1 : 1;
  }) as List<Id>;
}
