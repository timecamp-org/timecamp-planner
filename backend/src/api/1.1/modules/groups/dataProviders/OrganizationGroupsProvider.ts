import { injectable } from 'inversify';
import { generateId, Id } from '../../common/identifier';
import { GroupDbRow } from '../../db/schema';
import Table from '../../db/Table';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import { OrganizationGroupsProviderInterface } from '../interfaces/OrganizationGroupsProviderInterface';
import { first } from 'lodash';

@injectable()
export class OrganizationGroupsProvider
  extends AbstractPostgresProvider
  implements OrganizationGroupsProviderInterface
{
  async createGroup(
    organizationId: Id,
    name: string,
    slug: string,
    trx?: Transaction
  ): Promise<GroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const result = await query
      .insert({ id: generateId(), name, slug, organizationId })
      .into(Table.GROUP)
      .returning('*');

    return first(result);
  }

  async updateGroup(
    id: Id,
    name: string,
    slug: string,
    trx?: Transaction
  ): Promise<GroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const result = await query
      .update({ name, slug })
      .from(Table.GROUP)
      .where({ id })
      .returning('*');

    return first(result);
  }

  async deleteGroup(id: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query.from(Table.GROUP).where({ id }).del();
  }

  async getGroups(organizationId: Id): Promise<GroupDbRow[]> {
    return await this.connection
      .getQueryBuilder()
      .select('*')
      .from(Table.GROUP)
      .where({ organizationId });
  }

  async getGroup(groupId: Id, trx?: Transaction): Promise<GroupDbRow> {
    const result = await this.connection
      .getQueryWithTransaction(trx)
      .select('*')
      .from(Table.GROUP)
      .where({ id: groupId });

    return first(result);
  }
}
