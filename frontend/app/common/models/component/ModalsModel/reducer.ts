import { fromJS } from 'immutable'
import { Reducer } from 'redux'
import * as C from './constants'
import { ModalsState } from './types';
import { PayloadAction } from 'common/types'

const initialState: ModalsState = fromJS({
  modalsData: {},
  didUserCloseModalUltimately: {}
})

const modalReducer: Reducer<ModalsState, PayloadAction> = (state: ModalsState = initialState, action: PayloadAction): ModalsState => {
  switch (action.type) {
    case C.onOpenModal: {
      const { modalType, data } = action.payload
      return state.setIn(['modalsData', modalType], data)
    }

    case C.onCloseModal: {
      const { modalType } = action.payload
      return state.deleteIn(['modalsData', modalType])
    }

    case C.onSetDidUserCloseModalUltimately: {
      const { modalType, didUserClose } = action.payload
      return state.setIn(['didUserCloseModalUltimately', modalType], didUserClose)
    }

    default: {
      return state
    }
  }
}

export default modalReducer
