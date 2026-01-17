import { PayloadAction } from 'common/types';
import { Reducer } from 'redux';
import {
  onAddTaskTime,
  onCheckTimerStatusSuccess,
  onFetchHasTimecampIntegrationSuccess,
  onFetchTaskTimeEntriesSuccess,
  onSaveTokenSuccess,
  onSetTimerSuccess,
} from './constants';
import { TIMECAMP_STATE_KEYS, TaskTimerInterface, TimecampTimerState } from './types';

const initialState: TimecampTimerState = {
  elapsedTimeByTaskId: {},
  hasIntegrationByOrganizationId: {},
  currentTimer: null,
};

const reducer: Reducer<TimecampTimerState, PayloadAction> = (
  state: TimecampTimerState = initialState,
  { type, payload }: PayloadAction
): TimecampTimerState => {
  switch (type) {
    case onFetchHasTimecampIntegrationSuccess:
    case onSaveTokenSuccess:
      return {
        ...state,
        [TIMECAMP_STATE_KEYS.HAS_INTEGRATION_BY_ORGANIZATION_ID]: {
          ...state.hasIntegrationByOrganizationId,
          ...payload,
        },
      };
    case onSetTimerSuccess:
    case onCheckTimerStatusSuccess:
      return { ...state, currentTimer: payload as TaskTimerInterface };
    case onFetchTaskTimeEntriesSuccess:
      const entries = state[TIMECAMP_STATE_KEYS.ELAPSED_TIME_BY_TASK_ID];

      return {
        ...state,
        elapsedTimeByTaskId: { ...entries, ...payload },
      };
    case onAddTaskTime:
      const timeByTask = state[TIMECAMP_STATE_KEYS.ELAPSED_TIME_BY_TASK_ID];
      const [taskId] = Object.keys(payload);
      const [time] = Object.values(payload);
      timeByTask[taskId] = Number(timeByTask[taskId]) + Number(time);

      return {
        ...state,
        elapsedTimeByTaskId: { ...timeByTask },
      };
    default: {
      return state;
    }
  }
};

export default reducer;
