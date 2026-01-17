import { injectable } from 'inversify';
import { first } from 'lodash';

import { Id } from '../../common/identifier';
import { Dict } from '../../common/types';
import { UserInGroupDbRow } from '../../db/schema';
import Table from '../../db/Table';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import { UserInGroupProviderInterface } from '../interfaces/UserInGroupProviderInterface';

@injectable()
export class UserInGroupProvider
  extends AbstractPostgresProvider
  implements UserInGroupProviderInterface
{
  async addUserToGroup(
    groupId: Id,
    userInOrganizationId: Id,
    trx?: Transaction
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query
      .insert({ groupId, userInOrganizationId })
      .into(Table.USER_IN_GROUP)
      .returning('*');
  }

  async updateUserInGroup(
    groupId: Id,
    userInOrganizationId: Id,
    trx?: Transaction
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query
      .update({ groupId })
      .where({ userInOrganizationId })
      .table(Table.USER_IN_GROUP);
  }

  async removeUserFromGroup(
    groupId: Id,
    userInOrganizationId: Id,
    trx?: Transaction
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    await query
      .from(Table.USER_IN_GROUP)
      .where({ groupId, userInOrganizationId })
      .del();
  }

  async getUserInGroup(
    userInOrganizationId: Id,
    trx?: Transaction
  ): Promise<UserInGroupDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const result = await query
      .select('*')
      .where({ userInOrganizationId })
      .from(Table.USER_IN_GROUP);

    return first(result);
  }

  async getGroupUserIds(groupId: Id): Promise<Id[]> {
    const result = await this.connection
      .getQueryBuilder()
      .select(`${Table.USER_IN_ORGANIZATION}.user_id`)
      .from(Table.USER_IN_GROUP)
      .join(Table.GROUP, 'group_id', 'id')
      .join(
        Table.USER_IN_ORGANIZATION,
        `${Table.GROUP}.organization_id`,
        `${Table.USER_IN_ORGANIZATION}.organization_id`
      )
      .where({ groupId });

    return result.map((user) => user.userId);
  }

  async getGroupsPeople(organizationId: Id): Promise<Dict<Id>> {
    const result: UserInGroupDbRow[] = await this.connection
      .getQueryBuilder()
      .select(
        `${Table.USER_IN_GROUP}.group_id`,
        `${Table.USER_IN_ORGANIZATION}.user_id`
      )
      .from(Table.USER_IN_ORGANIZATION)
      .join(
        Table.USER_IN_GROUP,
        `${Table.USER_IN_ORGANIZATION}.id`,
        `${Table.USER_IN_GROUP}.user_in_organization_id`
      )
      .where({
        [`${Table.USER_IN_ORGANIZATION}.organization_id`]: organizationId,
      });

    return result.reduce((acc, { groupId, userId }) => {
      acc[userId] = groupId;
      return acc;
    }, {});
  }
}
