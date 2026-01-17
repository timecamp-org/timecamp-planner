import { ProjectProviderInterface } from '../interfaces/ProjectProviderInterface';

import { inject, injectable } from 'inversify';
import { first } from 'lodash';
import { EntityStatus } from '../../common/enum';
import { Id } from '../../common/identifier';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { ProjectDbRow, ProjectType } from '../../db/schema';
import { defaultProjectColumnNames } from '../../organizations/dataProviders/OrganizationProjectsProvider';
import { ProjectJson, ProjectsHaveUnreadMessages } from '../types';

@injectable()
export class ProjectProvider implements ProjectProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getProject(
    id: Id,
    trx?: Transaction,
    columnNames: string[] = defaultProjectColumnNames
  ): Promise<ProjectDbRow> {
    let query = this.connection.getQueryWithTransaction(trx);

    columnNames = columnNames.map((name) => `${Table.PROJECT}.${name}`);
    if (!columnNames.includes(`${Table.PROJECT}.id`)) {
      columnNames.unshift(`${Table.PROJECT}.id`);
    }

    return await query.select(columnNames).first().from(Table.PROJECT).where('id', id);
  }

  async createProject(project: ProjectDbRow, trx?: Transaction): Promise<ProjectDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    return (await query.insert(project).into(Table.PROJECT).returning('*').then(first)) as ProjectDbRow;
  }

  async updateProject(id: Id, project: ProjectJson, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.from(Table.PROJECT).where('id', id).update(project);
  }

  async getFirstUserVisibleProjectId(userId: Id, organizationId: Id): Promise<Id> {
    return await this.connection
      .getQueryBuilder()
      .select(`${Table.PROJECT}.id`)
      .from(Table.PROJECT)
      .join(Table.USER_IN_PROJECT, `${Table.PROJECT}.id`, `${Table.USER_IN_PROJECT}.project_id`)
      .where({
        userId,
        projectType: ProjectType.PROJECT,
        status: EntityStatus.EXISTS,
        organizationId,
      })
      .orderBy('name')
      .first()
      .then((result: ProjectDbRow) => (result ? result.id : null));
  }

  async getProjectIdsInOrganizationWithUnreadMessages(organizationId: Id, userId: Id): Promise<Id[]> {
    const connection = this.connection.getConnection();
    let unreadProjectIdsRows = await connection
      .select(`${Table.MESSAGE}.container_id`)
      .from(Table.MESSAGE)
      .join(Table.PROJECT_MESSAGE_READ, function () {
        this.on(`${Table.PROJECT_MESSAGE_READ}.project_id`, '=', `${Table.MESSAGE}.container_id`)
          .andOn(`${Table.PROJECT_MESSAGE_READ}.user_id`, connection.raw('?', userId))
          .andOn(
            connection.raw(
              `(${Table.PROJECT_MESSAGE_READ}.timestamp < ${Table.MESSAGE}.created_at OR ${Table.PROJECT_MESSAGE_READ}.timestamp IS NULL)`
            )
          );
      })
      .join(Table.USER_IN_PROJECT, function () {
        this.on(`${Table.PROJECT_MESSAGE_READ}.project_id`, '=', `${Table.USER_IN_PROJECT}.projectId`).andOn(
          `${Table.USER_IN_PROJECT}.userId`,
          connection.raw('?', userId)
        );
      })
      .where('organization_id', organizationId);

    return unreadProjectIdsRows.map((row) => row.containerId);
  }

  async getHaveProjectsUnreadMessages(
    projectIds: Id[],
    userId: Id,
    trx?: Transaction
  ): Promise<ProjectsHaveUnreadMessages> {
    const projectsHaveUnreadMessages: ProjectsHaveUnreadMessages = {};

    const connection = trx || this.connection.getConnection();
    const unreadProjectIdsRows = await connection
      .select(`${Table.MESSAGE}.container_id`)
      .from(Table.MESSAGE)
      .join(Table.PROJECT_MESSAGE_READ, function () {
        this.on(`${Table.PROJECT_MESSAGE_READ}.project_id`, '=', `${Table.MESSAGE}.container_id`)
          .andOn(`${Table.PROJECT_MESSAGE_READ}.user_id`, connection.raw('?', userId))
          .andOn(
            connection.raw(
              `(${Table.PROJECT_MESSAGE_READ}.timestamp < ${Table.MESSAGE}.created_at OR ${Table.PROJECT_MESSAGE_READ}.timestamp IS NULL)`
            )
          );
      })
      .whereIn(`${Table.MESSAGE}.container_id`, projectIds);

    unreadProjectIdsRows.forEach(({ containerId }) => {
      projectsHaveUnreadMessages[containerId] = true;
    });

    return projectsHaveUnreadMessages;
  }

  async getAllUserVisibleProjectIds(userId: Id): Promise<Id[]> {
    const connection = this.connection.getConnection();
    const q = connection
      .select(`${Table.PROJECT}.id`)
      .from(Table.PROJECT)
      .leftJoin(Table.USER_IN_PROJECT, function () {
        this.on(`${Table.PROJECT}.id`, '=', `${Table.USER_IN_PROJECT}.projectId`).andOn(
          `${Table.USER_IN_PROJECT}.userId`,
          '=',
          connection.raw('?', userId)
        );
      })
      .whereNotNull(`${Table.USER_IN_PROJECT}.userId`)
      .andWhere(`${Table.PROJECT}.status`, EntityStatus.EXISTS)
      .pluck(`${Table.PROJECT}.id`);

    return await q;
  }

  async getProjectIdsForOrganizationId(organizationId: Id, isArchived: boolean = undefined) {
    const connection = this.connection.getConnection();
    const projectIds = await connection
      .select('id')
      .from(Table.PROJECT)
      .where({
        organizationId,
        ...(isArchived !== undefined && isArchived !== null
          ? {
              isArchived,
            }
          : {}),
      })
      .pluck('id');

    return projectIds;
  }
}
