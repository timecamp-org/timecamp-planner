import { injectable } from 'inversify';
import { QueryModifier } from '../../../../../services/types';
import { Id } from '../../common/identifier';
import { ProjectDbRow } from '../../db/schema';
import { OrganizationProjectsProviderInterface } from '../interfaces/OrganizationProjectsProviderInterface';

import Table from '../../db/Table';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';

export const defaultProjectColumnNames: Array<keyof ProjectDbRow> = [
  'id',
  'organizationId',
  'status',
  'name',
  'description',
  'projectType',
  'creatorId',
  'isArchived',
  'isPrivate',
  'color',
  'iconType',
  'startDate',
  'dueDate',
  'autoJoin',
  'backgroundImageUrl',
];

@injectable()
export class OrganizationProjectsProvider
  extends AbstractPostgresProvider
  implements OrganizationProjectsProviderInterface
{
  async getOrganizationUserProjects(
    organizationId: Id,
    userId: Id,
    queryDecorators: QueryModifier[] = [],
    columnNames: string[] = defaultProjectColumnNames,
    trx?: Transaction
  ): Promise<ProjectDbRow[]> {
    columnNames = columnNames.map((name) => `${Table.PROJECT}.${name}`);
    if (!columnNames.includes(`${Table.PROJECT}.id`)) {
      columnNames.unshift(`${Table.PROJECT}.id`);
    }

    const connection = this.connection.getConnection<ProjectDbRow, ProjectDbRow[]>();
    let organizationProjectsQuery = this.connection
      .getQueryWithTransaction(trx)
      .from(Table.PROJECT)
      .select(columnNames)
      .leftJoin(Table.USER_IN_PROJECT, function () {
        this.on(`${Table.PROJECT}.id`, '=', `${Table.USER_IN_PROJECT}.projectId`).andOn(
          `${Table.USER_IN_PROJECT}.userId`,
          '=',
          connection.raw('?', userId)
        );
      })
      .where(`${Table.PROJECT}.organizationId`, organizationId);

    for (const decorateQuery of queryDecorators) {
      if (decorateQuery) {
        organizationProjectsQuery = decorateQuery(organizationProjectsQuery);
      }
    }

    return await organizationProjectsQuery;
  }
}
