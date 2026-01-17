import { OrganizationPeopleRole } from '../../OrganizationsModel/types'
import { ProjectPeopleRole } from '../../ProjectsModel/types'
import { TaskPeopleRole } from '../../TasksModel/types';

export const Roles = {
  organization: [
    OrganizationPeopleRole.OWNER,
    OrganizationPeopleRole.MEMBER,
  ],
  project: [
    ProjectPeopleRole.OWNER,
    ProjectPeopleRole.MANAGER,
    ProjectPeopleRole.MEMBER,
  ],
  task: [
    TaskPeopleRole.OWNER,
    TaskPeopleRole.COLLABORATOR,
    TaskPeopleRole.ASSIGNEE,
  ],
}

export enum PermissionGrant {
  VIEW = 'view',
  EDIT = 'edit',
  ARCHIVE = 'archive',
  DELETE = 'delete',
}
