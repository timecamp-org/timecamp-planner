import { fromJS } from 'immutable'
import { Reducer } from 'redux'
import * as C from './constants'
import * as AppModelConstants from '../AppModel/constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'

import { TaskRecurrenceState, TaskRecurrenceDependencyInterface } from './types';
import { PayloadAction } from '../../../types';

const initialState: TaskRecurrenceState = fromJS({
  recurrenceSettingsData: {},
  recurrenceIdByTaskId: {},
})

const reducer: Reducer<TaskRecurrenceState, PayloadAction> = (state: TaskRecurrenceState = initialState, action: PayloadAction): TaskRecurrenceState => {
  switch (action.type) {
    case C.onUpdateTaskRecurrenceSettingsData:
    case C.onSetTaskRecurrenceSuccess: {
      const payload = action.payload
      return state
        .setIn(['recurrenceSettingsData', payload.id], payload)
        .setIn(['recurrenceIdByTaskId', payload.taskId], payload.id)
    }
    case C.onDeleteTaskRecurrenceSettingsData: {
      const { id, taskId } = action.payload
      return state
        .deleteIn(['recurrenceSettingsData', id])
        .deleteIn(['recurrenceIdByTaskId', taskId])
    }
    case C.onDeleteTaskRecurrenceSettingsSuccess: {
      const { recurrenceId } = action.payload
      return state.deleteIn(['recurrenceSettingsData', recurrenceId])
    }
    case C.onUpdateTaskRecurrenceDependencyData: {
      const { taskId, targetTaskId, recurrencySettingsId } = action.payload as TaskRecurrenceDependencyInterface
      return state.setIn(['recurrenceIdByTaskId', taskId], recurrencySettingsId)
                  .setIn(['recurrenceIdByTaskId', targetTaskId], recurrencySettingsId)
    }
    case C.onDeleteTaskRecurrenceDependencyData: {
      const { taskId, targetTaskId } = action.payload as TaskRecurrenceDependencyInterface
      return state.deleteIn(['recurrenceIdByTaskId', taskId])
                  .deleteIn(['recurrenceIdByTaskId', targetTaskId])
    }
    case C.onBatchRecurrenceDedependency: {
      return state.set('recurrenceIdByTaskId', state.get('recurrenceIdByTaskId').mergeDeep(action.payload))
    }
    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default: {
      return state
    }
  }
}

export default reducer
