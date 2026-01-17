import { Id } from 'common/utils/identifier'
import { NavigationStackItemInterface } from './types'

export type OnPushRouteToHistoryStackPayload = {
  organizationId: Id,
  route: NavigationStackItemInterface,
}

export type onSetActiveRouteIdPayload = {
  id: Id,
}
