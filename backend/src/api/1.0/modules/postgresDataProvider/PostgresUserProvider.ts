import { AbstractPostgresProvider } from './AbstractPostgresProvider';
import { UserProviderInterface } from '../users/UserProviderInterface';
import { QueryModifier } from '../../../../services/types';
import { PublicUserDbRow, UserDbRow } from '../db/schema';
import Table from '../db/Table';
import { Id } from '../common/identifier';

import { EntityStatus } from '../common/enum';

const defaultColumnNames = [
  `${Table.USER}.id`,
  `${Table.USER}.first_name`,
  `${Table.USER}.last_name`,
  `${Table.USER}.nickname`,
  `${Table.USER}.email`,
  `${Table.USER}.created_at`,
  `${Table.USER}.modified_at`,
  `${Table.USER}.status`,
  `${Table.USER}.avatar_url`,
  `${Table.USER}.is_bot`,
  `${Table.USER}.registration_status`,
  `${Table.USER}.locale`,
  `${Table.USER_ONLINE}.is_online`,
];

export class PostgresUserProvider
  extends AbstractPostgresProvider
  implements UserProviderInterface
{
  async getUsersForQuery(
    decorate: QueryModifier,
    trx?: Transaction,
    columnNames: string[] = defaultColumnNames
  ): Promise<PublicUserDbRow[]> {
    if (!columnNames.includes(`${Table.USER}.id`)) {
      columnNames.unshift(`${Table.USER}.id`);
    }

    const query = this.connection
      .getQueryWithTransaction(trx)
      .select(columnNames)
      .from(Table.USER)
      .leftOuterJoin(
        Table.USER_ONLINE,
        `${Table.USER}.id`,
        `${Table.USER_ONLINE}.user_id`
      );
    decorate(query);
    return await query;
  }

  async filterOutBots(userIds: Id[], trx?: Transaction): Promise<Id[]> {
    const query = this.connection
      .getQueryWithTransaction(trx)
      .select('id')
      .from(Table.USER)
      .whereIn('id', userIds)
      .andWhere({ isBot: false })
      .pluck('id');
    return await query;
  }

  async getUserById(id: Id, trx?: Transaction): Promise<UserDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query
      .select()
      .from(Table.USER)
      .leftOuterJoin(Table.USER_ONLINE, 'id', 'userId')
      .where('id', id)
      .andWhere('status', EntityStatus.EXISTS)
      .first();
  }

  async getUserByEmail(email: string, trx?: Transaction): Promise<UserDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const user: UserDbRow = await query
      .select('*')
      .from(Table.USER)
      .where({
        email,
        status: EntityStatus.EXISTS,
      })
      .first();
    return user;
  }

  async getUsersEmails(userIds: Id[]): Promise<Record<Id, string>> {
    const query = this.connection.getQueryBuilder();
    const result: { id: Id; email: string }[] = await query
      .select('id', 'email')
      .from(Table.USER)
      .whereIn('id', userIds);
    return result.reduce((acc, { id, email }) => {
      acc[id] = email;
      return acc;
    }, {});
  }
}
