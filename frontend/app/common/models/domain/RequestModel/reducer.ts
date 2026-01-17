import { fromJS } from 'immutable'
import * as RequestStatusConstants from './constants'
import { RequestStatus, RequestsState } from './types'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { Reducer } from 'react';
import { PayloadAction } from '../../../types';
import { timestampNow } from '../../../utils/epoch'

// export initial state for testing
export const initialState: RequestsState = fromJS({
  status: {},
  data: {},
  error: {},
  count: {},
  dirty: [],
  timestamp: {},
  containerAccessLossTimestamp: {},
})

const reducer: Reducer<RequestsState, PayloadAction> = (state: RequestsState = initialState, action: PayloadAction): RequestsState => {
  switch (action.type) {
    case RequestStatusConstants.onSetRequestStatus: {
      const { id, status, error, data } = action.payload
      let result = error ? state.setIn(['error', id], error) : state
      result = status === RequestStatus.LOADING ?
        result.setIn(['count', id], result.getIn(['count', id], 0) + 1)
          .update('dirty', (dirtyRequests) => dirtyRequests.filter(requestId => requestId !== id))
        : result
      return result
        .setIn(['status', id], status)
        .setIn(['data', id], data)
        .setIn(['timestamp', id], timestampNow())
    }

    case RequestStatusConstants.onSetDirtyRequests: {
      return state.set('dirty', state.get('status').keySeq().toList())
    }

    case RequestStatusConstants.onSetIsRequestDirty: {
      return state.update('dirty', list => list.push(action.payload.requestId))
    }

    case RequestStatusConstants.onSetContainerAccessLossTimestamp: {
      const { containerId, timestamp, containerType } = action.payload
      return state.setIn(['containerAccessLossTimestamp', containerType, containerId], timestamp)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
    case RequestStatusConstants.onClearState:
      return initialState
    default:
      return state
  }
}

export default reducer