import { fromJS } from 'immutable'
import * as Constants from './constants'
import { Reducer } from 'react'
import { LinkPreviewState } from './types'
import { PayloadAction } from 'common/types'

export const initialState: LinkPreviewState = fromJS({
  linkPreviewData: {},
})

const reducer: Reducer<LinkPreviewState, PayloadAction> = (state: LinkPreviewState = initialState, action: PayloadAction): LinkPreviewState => {
  switch (action.type) {
    case Constants.onFetchLinkMetadataSuccess: {
      const { targetUrl, data } = action.payload
      return state
        .setIn(['linkPreviewData', targetUrl], data)
    }
    default:
      return state
  }
}

export default reducer
