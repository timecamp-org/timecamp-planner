import { LOCATION_CHANGE } from 'connected-react-router/immutable'
import { fromJS, List } from 'immutable'
import get from 'lodash/get'
import * as Constants from './constants'
import { updateListWithNewItem } from 'common/utils/immutableUtils'
import { NavigationStackItemInterface, RouterState } from './types'
import { PayloadAction } from 'common/types'
import { Reducer } from 'typesafe-actions'
import * as AppModelConstants from '../AppModel/constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'

const emptyList = List()

const initialState: RouterState = fromJS({
  currentPathname: null,
  previousPathname: null,
  appHistoryStack: {},
  activeRouteId: null,
})

const reducer: Reducer<RouterState, PayloadAction> = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const pathname = get(action, 'payload.location.pathname')
      return state.set('previousPathname', state.get('currentPathname'))
        .set('currentPathname', pathname)
    }
    case Constants.onPushRouteToHistoryStack: {
      const { organizationId, route } = action.payload

      let currentState = state

      const activeRouteId = state.get('activeRouteId')
      const currentStack = state.getIn(['appHistoryStack', organizationId], emptyList) as List<NavigationStackItemInterface>

      const activeRouteIndex = currentStack.findIndex(route => activeRouteId === route.id)

      if (activeRouteIndex > -1) {
        currentState = currentState
          .setIn(['appHistoryStack', organizationId], currentStack.slice(0, activeRouteIndex + 1))
          .set('activeRouteId', route.id)
      }

      return currentState.updateIn(['appHistoryStack', organizationId], updateListWithNewItem<NavigationStackItemInterface>(route))
    }
    case Constants.onSetActiveRouteId: {
      const { id } = action.payload
      return state.set('activeRouteId', id)
    }
    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      const appHistoryStack = state.get('appHistoryStack')
      return initialState.set('appHistoryStack', appHistoryStack)
    default:
      return state
  }
}

export default reducer
