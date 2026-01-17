import { Id } from "../../common/identifier";

import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";
import { ProjectInGroupProviderInterface } from "../interfaces/ProjectInGroupProviderInterface";
import Table from "../../db/Table";
import { ProjectInGroupDbRow } from "../../db/schema";
import { first } from "lodash";
import { injectable } from "inversify";
import { ProjectInGroupJson } from "../types";

@injectable()
export class ProjectInGroupProvider
  extends AbstractPostgresProvider
  implements ProjectInGroupProviderInterface {

  async insertProjectInGroup(projectInGroup: ProjectInGroupJson, trx?: Transaction): Promise<ProjectInGroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    const result = await query
      .table(Table.PROJECT_IN_GROUP)
      .insert(projectInGroup)
      .returning('*')

    return first(result)
  }

  async getProjectInGroup(projectId: Id, userInOrganizationId: Id, trx?: Transaction): Promise<ProjectInGroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(`${Table.PROJECT_IN_GROUP}.*`)
      .from(Table.PROJECT_IN_GROUP)
      .join(Table.USER_PROJECT_GROUP,
        `${Table.USER_PROJECT_GROUP}.id`, `${Table.PROJECT_IN_GROUP}.group_id`
      )
      .where({
        projectId, userInOrganizationId,
      })
      .first()
  }

  async getProjectInGroupByProjectIdAndGroupId(projectId: Id, groupId, trx?: Transaction): Promise<ProjectInGroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(`${Table.PROJECT_IN_GROUP}.*`)
      .from(Table.PROJECT_IN_GROUP)
      .where({
        projectId, groupId,
      })
      .first()
  }

  async getOrderedProjectsInAGroup(groupId: Id, trx?: Transaction): Promise<ProjectInGroupDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.PROJECT_IN_GROUP)
      .where({ groupId })
      .orderBy('order')
  }

  async getProjectsInGroupsForUserInOrganization(userInOrganizationId: Id, trx?: Transaction): Promise<ProjectInGroupDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(`${Table.PROJECT_IN_GROUP}.*`)
      .from(Table.PROJECT_IN_GROUP)
      .join(Table.USER_PROJECT_GROUP,
        `${Table.USER_PROJECT_GROUP}.id`, `${Table.PROJECT_IN_GROUP}.group_id`
      )
      .where({userInOrganizationId})
  }

  async updateProjectInGroup(projectId: Id, currentGroupId: Id, projectInGroup: ProjectInGroupJson, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.PROJECT_IN_GROUP)
      .where({ projectId, groupId: currentGroupId })
      .update(projectInGroup)
  }

  async deleteProjectFromGroup(projectId: Id, groupId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.PROJECT_IN_GROUP)
      .where({ projectId, groupId })
      .delete()
  }

  async deleteProjectsFromGroupsByProjectId(projectId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .table(Table.PROJECT_IN_GROUP)
      .where({ projectId })
      .delete()
  }

}
