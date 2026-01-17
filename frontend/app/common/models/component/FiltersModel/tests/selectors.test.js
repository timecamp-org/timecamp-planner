import * as selectors from 'models/component/FiltersModel/selectors'
import { Filter } from 'models/component/FiltersModel/models'
import { Map } from 'immutable'
import stateMock from 'stateMock'

describe('FiltersModelSelectors', () => {
  const filterId = 'filter::test'
  const filter = new Filter({
    filterByField: new Map({
      status: 'active',
    }),
    groupByField: 'dueDate',
  })

  it('selectFilter', () => {
    const selector = selectors.selectFilter
    expect(selector(stateMock, { filterId })).toEqual(filter)
  })

  it('selectFilterBy', () => {
    const selector = selectors.selectFilterBy
    expect(selector(stateMock, { filterId })).toEqual(filter.get('filterByField'))
  })

  it('selectSortBy', () => {
    const selector = selectors.selectSortBy
    expect(selector(stateMock, { filterId })).toEqual(filter.get('sortByField'))
  })

  it('selectGroupBy', () => {
    const selector = selectors.selectGroupBy
    expect(selector(stateMock, { filterId })).toEqual(filter.get('groupByField'))
  })

  it('selectFiltersCount', () => {
    const selector = selectors.selectFiltersCount
    expect(selector(stateMock, { filterId })).toEqual(1)
  })

  it('selectFilterByProperty', () => {
    const selector = selectors.selectFilterByProperty
    expect(selector(stateMock, { filterId, property: 'status' })).toEqual('active')
  })
})
