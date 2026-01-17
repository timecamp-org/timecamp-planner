import { Id } from '../../common/identifier';
import { DictDbRow } from '../../db/schema';


export interface DictProviderInterface<T> {
  getItemById(id: Id, trx?: Transaction): PromiseLike<DictDbRow<T>>;
  getItemByValue(type: T, trx?: Transaction): PromiseLike<DictDbRow<T>>;
  getItemIdsByValues(values: T[], trx?: Transaction): PromiseLike<Id[]>;
}
