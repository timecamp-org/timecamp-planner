import { Id } from "../../common/identifier";

import { ProjectInGroupDbRow } from "../../db/schema";
import { ProjectInGroupJson } from "../types";

export interface ProjectInGroupProviderInterface {

  insertProjectInGroup(projectInGroup: ProjectInGroupJson, trx?: Transaction): PromiseLike<ProjectInGroupDbRow>

  getProjectInGroup(projectId: Id, userInOrganizationId: Id, trx?: Transaction): PromiseLike<ProjectInGroupDbRow>

  getProjectInGroupByProjectIdAndGroupId(projectId: Id, groupId, trx?: Transaction): PromiseLike<ProjectInGroupDbRow>

  getOrderedProjectsInAGroup(groupId: Id, trx?: Transaction): PromiseLike<ProjectInGroupDbRow[]>

  getProjectsInGroupsForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): PromiseLike<ProjectInGroupDbRow[]>

  updateProjectInGroup(projectId: Id, currentGroupId: Id, projectInGroup: ProjectInGroupJson, trx?: Transaction)

  deleteProjectFromGroup(projectId: Id, groupId: Id, trx?: Transaction): PromiseLike<void>

  deleteProjectsFromGroupsByProjectId(projectId: Id, trx?: Transaction): Promise<void>

}
