import { DictDbRow } from '../../db/schema';
import Table from '../../db/Table';

export interface DictServiceInterface {
  getDict(name: keyof Table, trx?: Transaction): Promise<DictDbRow<any>[]>;
}
