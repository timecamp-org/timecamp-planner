import { Id } from 'common/utils/identifier'
import { FilterRecordInterface, SortOrder } from './types';
import { Map } from 'immutable';

export interface OnInitPayload {
  filterId: Id,
}

export interface OnClearFiltersPayload {
  filterId: Id,
}

export interface OnSetFilterByPayload {
  filterId: Id,
  filterKey: string,
  filterValue: string | number | boolean,
}

export interface OnSetGroupByPayload {
  filterId: Id,
  groupId: Id,
}

export interface OnSetSortByPayload {
  filterId: Id,
  sortKey: string,
  sortOrder: SortOrder,
}

export interface OnBatchFiltersPayload {
  filtersData: Map<Id, FilterRecordInterface>
}