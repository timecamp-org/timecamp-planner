import makeActionResult from '../../../../utils/makeActionResult'

import * as constants from 'models/component/FiltersModel/constants'
import * as actions from 'models/component/FiltersModel/actions'

describe('FiltersModelActions', () => {
  const filterId = 'filter::001'
  const filterKey = 'status'
  const filterValue = 'active'
  const groupId = 'dueDate'

  it('onInit', () => {
    expect(actions.onInit(filterId)).toEqual({
      type: constants.onInit,
      payload: {
        filterId
      }
    })
  })


  it('onSetFilterBy', () => {
    expect(actions.onSetFilterBy(filterId, filterKey, filterValue)).toEqual({
      type: constants.onSetFilterBy,
      payload: {
        filterId,
        filterKey,
        filterValue,
      }
    })
  })

  it('onSetFilterBySuccess', () => {
    const actionResult = makeActionResult({
      isOk: true,
      code: 'onSetFilterBySuccess',
    })
    expect(actions.onSetFilterBySuccess(actionResult)).toEqual({
      type: constants.onSetFilterBySuccess,
      payload: { actionResult },
    })
  })

  it('onSetGroupBy', () => {
    expect(actions.onSetGroupBy(filterId, groupId)).toEqual({
      type: constants.onSetGroupBy,
      payload: {
        filterId,
        groupId,
      }
    })
  })

  it('onSetGroupBySuccess', () => {
    const actionResult = makeActionResult({
      isOk: true,
      code: 'onSetGroupBySuccess',
    })
    expect(actions.onSetGroupBySuccess(actionResult)).toEqual({
      type: constants.onSetGroupBySuccess,
      payload: { actionResult },
    })
  })

  it('onClearFilters', () => {
    expect(actions.onClearFilters(filterId)).toEqual({
      type: constants.onClearFilters,
      payload: { filterId },
    })
  })

  it('onClearFiltersSuccess', () => {
    const actionResult = makeActionResult({
      isOk: true,
      code: 'onClearFiltersSuccess',
    })
    expect(actions.onClearFiltersSuccess(actionResult)).toEqual({
      type: constants.onClearFiltersSuccess,
      payload: { actionResult },
    })
  })
})
