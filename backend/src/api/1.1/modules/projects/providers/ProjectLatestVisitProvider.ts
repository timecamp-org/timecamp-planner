import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";
import { ProjectLatestVisitProviderInterface } from "../interfaces/ProjectLatestVisitProviderInterface";
import { Id } from "../../common/identifier";

import { ProjectLatestVisitDbRow } from "../../db/schema";
import Table from "../../db/Table";

export class ProjectLatestVisitProvider
  extends AbstractPostgresProvider
  implements ProjectLatestVisitProviderInterface {

  async insertOrUpdateProjectLatestVisit(userId: Id, organizationId: Id, projectId: Id, userInProjectId: Id, trx: Transaction): Promise<void> {
    const connection = trx || this.connection.getConnection()

    const queryParams = {
      table: Table.PROJECT_LATEST_VISIT,

      userId: connection.raw('?', userId),
      organizationId: connection.raw('?', organizationId),
      projectId: connection.raw('?', projectId),
      userInProjectId: connection.raw('?', userInProjectId),
    }

    const query = 'INSERT INTO :table: '
      + '(user_id, organization_id, project_id, user_in_project_id) '
      + 'VALUES (:userId:, :organizationId:, :projectId:, :userInProjectId:) '
      + 'ON CONFLICT (user_id, organization_id) DO UPDATE SET '
      + 'project_id = :projectId:, user_in_project_id = :userInProjectId:'

    await connection.raw(query, queryParams)
  }

  async getProjectLatestVisit(userId: Id, organizationId: Id): Promise<ProjectLatestVisitDbRow> {
    const query = this.connection.getConnection()

    return await query
      .select()
      .from(Table.PROJECT_LATEST_VISIT)
      .where({
        userId, organizationId,
      })
      .first()
  }
}
