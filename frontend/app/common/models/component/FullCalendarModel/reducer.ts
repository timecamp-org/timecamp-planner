import { fromJS } from 'immutable'
import * as constants from './constants'
import { PayloadAction } from '../../../types';
import { Reducer } from 'redux';
import { FullCalendarState } from './types';

const initialState: FullCalendarState = fromJS({
  dateRanges: {

  },
  currentViews: {

  },
  currentDates: {

  },
  offsets: {

  },
})

const fullCalendarReducer: Reducer<FullCalendarState, PayloadAction> = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case constants.onSetDateRange: {
      const { objectId, dateRange } = action.payload
      return state.setIn(['dateRanges', objectId], dateRange)
    }
    case constants.onUnsetDateRange: {
      const { objectId } = action.payload
      return state.deleteIn(['dateRanges', objectId])
    }
    case constants.onSetCurrentView: {
      const { objectId, currentView } = action.payload
      return state.setIn(['currentViews', objectId], currentView)
    }
    case constants.onSetCurrentDate: {
      const { objectId, currentDate, offset } = action.payload
      return state.setIn(['currentDates', objectId], currentDate)
        .setIn(['offsets', objectId], offset)
    }

    default:
      return state
  }
}

export default fullCalendarReducer
