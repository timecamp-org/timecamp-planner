import { PayloadAction } from 'common/types';
import { fromJS } from 'immutable';
import { Reducer } from 'redux';
import {
  onCreateTaskTimeEstimateSuccess,
  onFetchTaskTimeEstimateSuccess,
  onUpdateTaskTimeEstimateSuccess,
  onDeleteTaskTimeEstimateSuccess,
} from './constants/index';
import { TASK_ESTIMATES_STATE_KEYS, TaskTimeEstimateState } from './types';
import { onFetchProjectViewDataSuccess } from '../RequestModel/constants';

const initialState: TaskTimeEstimateState = fromJS({ estimatesByTaskId: {} });

const reducer: Reducer<TaskTimeEstimateState, PayloadAction> = (
  state: TaskTimeEstimateState = initialState,
  { type, payload }: PayloadAction
): TaskTimeEstimateState => {
  switch (type) {
    case onFetchTaskTimeEstimateSuccess:
    case onUpdateTaskTimeEstimateSuccess:
    case onCreateTaskTimeEstimateSuccess:
      return state.setIn(['estimatesByTaskId', payload.taskId], payload);
    case onDeleteTaskTimeEstimateSuccess:
      return state.deleteIn(['estimatesByTaskId', payload.taskId]);
    case onFetchProjectViewDataSuccess:
      return state.set(
        TASK_ESTIMATES_STATE_KEYS.ESTIMATES_BY_TASK_ID,
        state.get(TASK_ESTIMATES_STATE_KEYS.ESTIMATES_BY_TASK_ID).merge(payload.data.taskTimeEstimatesByTaskId)
      );

    default: {
      return state;
    }
  }
};

export default reducer;
