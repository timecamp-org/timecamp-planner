import { OrganizationProviderInterface } from '../interfaces/OrganizationProviderInterface';

import { Id } from '../../common/identifier';
import Table from '../../db/Table';
import { OrganizationDbRow } from '../../db/schema';
import { injectable, inject } from 'inversify';
import { EntityStatus } from '../../common/enum';
import { QueryModifier } from '../../../../../services/types';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';

@injectable()
export class OrganizationProvider implements OrganizationProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getOrganization(organizationId: Id, trx?: Transaction): Promise<OrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .first()
      .from(Table.ORGANIZATION)
      .where('id', organizationId)
  }

  async getOrganizationsForUser(userId: Id, trx?: Transaction, decorateQuery?: QueryModifier): Promise<OrganizationDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    const organizationsQuery = query
      .select(`${Table.ORGANIZATION}.*`)
      .from(Table.ORGANIZATION)
      .join(Table.USER_IN_ORGANIZATION, `${Table.ORGANIZATION}.id`, `${Table.USER_IN_ORGANIZATION}.organization_id`)
      .where(`${Table.USER_IN_ORGANIZATION}.user_id`, userId)
      .andWhere(`${Table.USER_IN_ORGANIZATION}.entityStatus`, EntityStatus.EXISTS)

    if (decorateQuery) {
      decorateQuery(organizationsQuery)
    }

    return await organizationsQuery
  }

  async getOrganizationsByIds(organizationIds: Id[]): Promise<OrganizationDbRow[]> {
    return await this.connection.getConnection()
      .select()
      .from(Table.ORGANIZATION)
      .whereIn('id', organizationIds)
  }
}
