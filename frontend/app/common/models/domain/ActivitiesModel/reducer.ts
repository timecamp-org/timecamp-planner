import { fromJS } from 'immutable'
import { mergeObjectLists } from '../../../utils/immutableUtils'

import * as ActivitiesModelConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { Reducer } from 'redux'
import { ActivitiesState } from 'models/domain/ActivitiesModel/types'
import { PayloadAction } from 'common/types'

const initialState = fromJS({
  activitiesData: {},
  activitiesChangedProps: {},
  objectActivities: {},
  fatalError: null,
})

const reducer: Reducer<ActivitiesState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case ActivitiesModelConstants.onBatchActivtiesData: {
      const { activitiesData, objectActivities } = action.payload
      return state.set('activitiesData', state.get('activitiesData').merge(activitiesData))
        .set('objectActivities', mergeObjectLists(state.get('objectActivities'), objectActivities))
    }

    case ActivitiesModelConstants.onBatchActivitiesChangedProps: {
      const { activitiesChangedProps } = action.payload
      return state.set('activitiesChangedProps', state.get('activitiesChangedProps').mergeDeep(activitiesChangedProps))
    }

    case ActivitiesModelConstants.onCreateActivityData: {
      const { activityId, activity, objectActivities, activityChangedProps } = action.payload
      return state.setIn(['activitiesData', activityId], activity)
        .set('objectActivities', mergeObjectLists(state.get('objectActivities'), objectActivities))
        .setIn(['activitiesChangedProps', activityId], activityChangedProps)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess: {
      return initialState
    }
    default: {
      return state
    }
  }
}

export default reducer