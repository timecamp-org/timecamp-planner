import { FiltersInterface, FilterRecordInterface } from './types'
import { makeTypedFactory } from 'typed-immutable-record';

const defaultFilter: FiltersInterface = {
  id: undefined,
  groupByField: null,
  sortByField: null,
  filterByField: null,
}


export const Filter = makeTypedFactory<FiltersInterface | FilterRecordInterface, FilterRecordInterface>(defaultFilter);
