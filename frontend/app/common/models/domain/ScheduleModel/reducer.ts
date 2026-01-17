import { PayloadAction } from 'common/types';
import { Reducer } from 'redux';
import { onFetchScheduleDataSuccess } from './constants';
import { ScheduleState, TaskScheduleInterface } from './types';

const initialState: ScheduleState = {
  scheduleData: [] as TaskScheduleInterface[],
};

const reducer: Reducer<ScheduleState, PayloadAction> = (
  state: ScheduleState = initialState,
  { type, payload }: PayloadAction
): ScheduleState => {
  switch (type) {
    case onFetchScheduleDataSuccess:
      return { ...state, scheduleData: payload };

    default: {
      return state;
    }
  }
};

export default reducer;
