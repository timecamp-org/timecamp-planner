import { fromJS } from 'immutable'

import * as C from './constants'
import { Reducer } from 'react'
import { PayloadAction } from 'common/types'
import { FiltersState } from './types'
import { OnBatchFiltersPayload } from './payloads'

const initialState = fromJS({
  filtersData: {},
})

const filtersReducer: Reducer<FiltersState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case C.onSetFilterBySuccess:
    case C.onSetGroupBySuccess:
    case C.onSetSortBySuccess:
    case C.onClearFiltersSuccess: {
      const { filterId, filter } = action.payload.actionResult.data
      return state.setIn(['filtersData', filterId], filter)
    }
    case C.onBatchFilters: {
      const { filtersData }: OnBatchFiltersPayload = action.payload
      return state
        .set('filtersData', state.get('filtersData').merge(filtersData))
    }
    default:
      return state
  }
}

export default filtersReducer
