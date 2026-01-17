import { fromJS } from 'immutable'
import { Reducer } from 'redux'
import { GuestsState } from './types'
import { PayloadAction } from 'common/types'
import * as Constants from './constants'
import {
  OnBatchGuestInProjectPayload,
  OnCreateGuestInProjectPayload,
  OnDeleteGuestInProjectPayload
} from 'models/domain/GuestsModel/payloads'

const initialState: GuestsState = fromJS({
  guestInProjectData: {},
})

const guestsReducer: Reducer<GuestsState, PayloadAction> = (state: GuestsState = initialState, action: PayloadAction): GuestsState => {
  switch (action.type) {

    case Constants.onBatchGuestInProject: {
      const { guestsInProject }: OnBatchGuestInProjectPayload = action.payload
      return state.set('guestInProjectData', state.get('guestInProjectData').merge(guestsInProject))
    }

    case Constants.onCreateGuestInProject: {
      const { guestInProject, guestInProjectId }: OnCreateGuestInProjectPayload = action.payload
      return state.setIn(['guestInProjectData', guestInProjectId], guestInProject)
    }

    case Constants.onDeleteGuestInProject: {
      const { guestInProjectId }: OnDeleteGuestInProjectPayload = action.payload
      return state.deleteIn(['guestInProjectData', guestInProjectId])
    }

    default: {
      return state
    }
  }
}

export default guestsReducer
