import { fromJS } from 'immutable'
import * as EntityHistoryModelConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { Reducer } from 'redux';
import { EntityHistoryState } from './types';
import { PayloadAction } from '../../../types';

// export initial state for testing
export const initialState: EntityHistoryState = fromJS({
  entityHistory: {
  },
})

const entityHistoryReducer: Reducer<EntityHistoryState, PayloadAction>
  = (state: EntityHistoryState = initialState, action: PayloadAction): EntityHistoryState => {
    switch (action.type) {
      case EntityHistoryModelConstants.onSetEntityHistory: {
        const { entityType, entityId, history } = action.payload
        return state.setIn(['entityHistory', entityType, entityId], history)
      }

      case AppModelConstants.onCleanModels:
      case CurrentUserConstants.onSignOutSuccess:
        return initialState
      default:
        return state
    }
  }

export default entityHistoryReducer
