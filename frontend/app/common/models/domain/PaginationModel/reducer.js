import { fromJS } from 'immutable'

import * as PaginationConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { timestampNow } from '../../../utils/epoch'

const initialState = fromJS({
  page: {},
  pageTimestamp: {},
})

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PaginationConstants.onSetPageLastNext: {
      const { pageId, lastPageNext } = action
      return state
        .setIn(['page', pageId], lastPageNext)
        .setIn(['pageTimestamp', pageId], timestampNow())
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
    case PaginationConstants.onClearState:
      return initialState
    default:
      return state
  }
}
