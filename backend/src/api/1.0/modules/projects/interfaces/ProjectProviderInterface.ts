
import {
  ProjectDbRow,
} from "../../db/schema";
import { Id } from "../../common/identifier";
import { ProjectJson, ProjectsHaveUnreadMessages } from '../types'

export interface ProjectProviderInterface {

  getProject(id: Id, trx?: Transaction, columnNames?: string[]): Promise<ProjectDbRow>

  createProject(project: ProjectDbRow, trx?: Transaction): Promise<ProjectDbRow>

  updateProject(id: Id, project: ProjectJson, trx?: Transaction): Promise<number>;

  getFirstUserVisibleProjectId(userId: Id, organizationId: Id): PromiseLike<Id>;

  getProjectIdsInOrganizationWithUnreadMessages(organizationId: Id, userId: Id): Promise<Id[]>

  getHaveProjectsUnreadMessages(projectIds: Id[], userId: Id, trx?: Transaction): PromiseLike<ProjectsHaveUnreadMessages>

  getAllUserVisibleProjectIds(userId: Id): PromiseLike<Id[]>
}
