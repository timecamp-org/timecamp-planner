import { domain } from './constants';
import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';
import generateSelectorName from '../../../utils/generateSelectorName';
import { FiltersState, FilterRecordInterface, FilterByType, SortOrder } from './types';
import { ApplicationState } from 'common/types';
import { createSelector } from 'reselect';
import { Id } from 'common/utils/identifier';

export const selectFiltersDomain = (state: ApplicationState) => state.get(domain) as FiltersState;

const emptyMap = Map();

export const selectFiltersData = createSelector(
  selectFiltersDomain,
  (domain) => domain.get('filtersData') as Map<Id, FilterRecordInterface>,
);

// args: filterId
export const selectFilter = createCachedSelector(
  selectFiltersData,
  (_, args) => args.filterId,
  (filters, filterId) => filters.get(filterId) as FilterRecordInterface,
)((_, args) => generateSelectorName(args, ['filterId']));

// args: filterId
export const selectFilterBy = createCachedSelector(
  selectFilter,
  (filter) => (filter ? filter.filterByField : emptyMap) as FilterByType,
)((_, args) => generateSelectorName(args, ['filterId']));

// args: filterId
export const selectSortBy = createCachedSelector(
  selectFilter,
  (filter) => (filter ? filter.sortByField : emptyMap) as Map<string, SortOrder>,
)((_, args) => generateSelectorName(args, ['filterId']));

// args: filterId
export const selectGroupBy = createCachedSelector(selectFilter, (filter) => (filter ? filter.groupByField : null))(
  (_, args) => generateSelectorName(args, ['filterId']),
);

// args: filterId
export const selectFiltersCount = createCachedSelector(selectFilterBy, (filterBy) => {
  const filterByCount = filterBy
    ? filterBy.count((filterByFiledValue) => {
        if (List.isList(filterByFiledValue)) {
          //@ts-ignore
          return !filterByFiledValue.isEmpty();
        } else if (Map.isMap(filterByFiledValue)) {
          //@ts-ignore
          return !filterByFiledValue.isEmpty();
        } else {
          return true;
        }
      })
    : 0;
  return filterByCount;
})((_, args) => generateSelectorName(args, ['filterId']));

// args: filterId, property
export const selectFilterByProperty = createCachedSelector(
  selectFilterBy,
  (_, args) => args.property,
  (filterBy, property) => (filterBy ? filterBy.get(property) : undefined),
)((_, args) => generateSelectorName(args, ['filterId']));
