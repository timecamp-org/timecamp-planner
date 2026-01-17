import { fromJS } from 'immutable'
import * as C from './constants'
import { Reducer } from 'redux'
import * as AppModelConstants from '../AppModel/constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'

import { UserStatusState } from './types';
import { PayloadAction } from '../../../types';


const initialState: UserStatusState = fromJS({
  userStatusData: {},
})

const userStateReducer: Reducer<UserStatusState, PayloadAction> = (state: UserStatusState = initialState, action: PayloadAction): UserStatusState => {
  switch (action.type) {
    case C.onBatchUserStatusData: {
      const userStatusData = action.payload
      return state
        .set('userStatusData', userStatusData)
    }
    case C.onCreateUserStatusData:
    case C.onUpdateUserStatusData:
    case C.onSetUserStatusSuccess: {
      const userStatus = action.payload
      return state
        .setIn(['userStatusData', userStatus.id], userStatus)
    }
    case C.onDeleteUserStatusData: {
      const { id } = action.payload
      return state
        .deleteIn(['userStatusData', id])
    }
      
    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default: {
      return state
    }
  }
}

export default userStateReducer
