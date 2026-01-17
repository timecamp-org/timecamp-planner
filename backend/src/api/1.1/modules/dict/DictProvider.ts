import { injectable, inject } from 'inversify';
import { Id } from '../common/identifier';
import Table from '../db/Table';
import { DictProviderInterface } from './interfaces/DictProviderInterface';
import { DictDbRow } from '../db/schema';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

@injectable()
export class DictProvider<T extends string> implements DictProviderInterface<T> {
  constructor(
    @inject(DbModule.ConnectionInterface)
    protected connection: ConnectionInterface,
    private table: Table
  ) {}

  async getItems(trx?: Transaction): Promise<Array<DictDbRow<T>>> {
    return await this.connection.getQueryWithTransaction(trx).select().from(this.table);
  }

  async getItemById(id: Id, trx?: Transaction): Promise<DictDbRow<T>> {
    return await this.connection.getQueryWithTransaction(trx).select().from(this.table).where({ id }).first();
  }

  async getItemByValue(value: T, trx?: Transaction): Promise<DictDbRow<T>> {
    return await this.connection.getQueryWithTransaction(trx).select().from(this.table).where({ value }).first();
  }

  async getItemIdsByValues(values: T[], trx?: Transaction): Promise<Id[]> {
    return await this.connection
      .getQueryWithTransaction(trx)
      .select('id')
      .from(this.table)
      .whereIn('value', values)
      .pluck('id');
  }
}
