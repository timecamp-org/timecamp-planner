import { inject, injectable } from 'inversify';

import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import { DictDbRow } from '../db/schema';
import Table from '../db/Table';
import { DictProvider } from './DictProvider';
import { DictServiceInterface } from './interfaces/DictServiceInterface';

@injectable()
export class DictService implements DictServiceInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    protected connection: ConnectionInterface
  ) {}

  async getDict(name: keyof Table, trx?: Transaction): Promise<DictDbRow<any>[]> {
    const dictProvider = new DictProvider(this.connection, Table[name]);

    const result = await dictProvider.getItems();

    return result;
  }
}
