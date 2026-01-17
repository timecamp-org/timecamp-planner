import { fromJS } from 'immutable'
import * as Constants from './constants'
import { Reducer } from 'react'
import { JobStatusState } from './types'
import { PayloadAction } from 'common/types'

export const initialState: JobStatusState = fromJS({
  jobStatusData: {},
})

const reducer: Reducer<JobStatusState, PayloadAction> = (state: JobStatusState = initialState, action: PayloadAction): JobStatusState => {
  switch (action.type) {
    case Constants.onUpdateJobStatusDataSuccess: {
      const { jobStatus } = action.payload
      return state
        .setIn(['jobStatusData', jobStatus.id], jobStatus)
    }
    case Constants.onFetchJobStatusesSuccess: {
      const { jobStatusData } = action.payload
      return state.set('jobStatusData', state.get('jobStatusData').merge(jobStatusData))
    }
    default:
      return state
  }
}

export default reducer
