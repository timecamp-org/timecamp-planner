import { fromJS } from 'immutable'
import { Reducer } from 'redux'
import * as C from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'

import { ChatWithMeState } from './types';
import { PayloadAction } from '../../../types';

const initialState: ChatWithMeState = fromJS({
  userId: null,
  organizationId: null,
  organizationName: null,
  token: null,
})

const reducer: Reducer<ChatWithMeState, PayloadAction> = (state: ChatWithMeState = initialState, action: PayloadAction): ChatWithMeState => {
  switch (action.type) {
    case C.onFetchInvitationDataSuccess: {
      const { userId, organizationId, organizationName } = action.payload
      return state.set('userId', userId)
        .set('organizationId', organizationId)
        .set('organizationName', organizationName)
    }

    case C.onFetchInvitationTokenSuccess:
    case C.onSetInvitationToken:
      return state.set('token', action.payload.token)

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default: {
      return state
    }
  }
}

export default reducer
