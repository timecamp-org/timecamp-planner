import { UserStatusProviderInterface } from "./interfaces/UserStatusProviderInterface";
import { UserStatusJson } from "./types";
import { Id } from "../common/identifier";

import { injectable, inject } from "inversify";
import Table from "../db/Table";
import { first } from 'lodash'
import { UserStatusDbRow } from "../db/schema";
import { DbModule } from "../db/DbModule";
import { ConnectionInterface } from "../db/ConnectionInterface";

@injectable()
export class UserStatusProvider implements UserStatusProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {}

  async getOrganizationUserStatuses(organizationId: Id, trx?: Transaction): Promise<UserStatusDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.USER_STATUS)
      .select()
      .where({ organizationId })
  }

  async getUserStatus(userId: Id, organizationId: Id, trx?: Transaction): Promise<UserStatusDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.USER_STATUS)
      .select()
      .where({ userId, organizationId })
      .first()
  }

  async setUserStatus(userStatusJson: UserStatusJson, trx?: Transaction): Promise<UserStatusDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .from(Table.USER_STATUS)
      .insert(userStatusJson)
      .returning('*')
    return first(result)
  }

  async updateUserStatus(userStatusJson: UserStatusJson, trx?: Transaction): Promise<UserStatusDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .from(Table.USER_STATUS)
      .update(userStatusJson)
      .where({
        organizationId: userStatusJson.organizationId,
        userId: userStatusJson.userId,
      })
      .returning('*')
    return first(result)
  }

  async deleteUserStatus(userId: Id, organizationId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.USER_STATUS)
      .del()
      .where({ userId, organizationId })
  }

  async getStatusIdsWithResetUntil(resetAt: Date): Promise<Id[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.USER_STATUS)
      .select('id')
      .whereNotNull('resetAt')
      .andWhere('reset_at', '<', resetAt)
      .pluck('id')
  }

  async deleteUserStatuses(ids: Id[]): Promise<void> {
    await this.connection.getQueryBuilder()
      .from(Table.USER_STATUS)
      .del()
      .whereIn('id', ids)
  }
}
