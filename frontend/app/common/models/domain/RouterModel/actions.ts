import { NavigationStackItemInterface } from "./types";
import { Id } from "common/utils/identifier";
import { PayloadAction } from 'common/types'
import { action } from 'typesafe-actions'
import * as Constants from './constants'
import { OnPushRouteToHistoryStackPayload, onSetActiveRouteIdPayload } from './payloads'

export function onPushRouteToHistoryStack(
  organizationId: Id,
  route: NavigationStackItemInterface,
): PayloadAction<OnPushRouteToHistoryStackPayload> {
  return action(Constants.onPushRouteToHistoryStack, { organizationId, route })
}

export function onSetActiveRouteId(
  id: Id,
): PayloadAction<onSetActiveRouteIdPayload> {
  return action(Constants.onSetActiveRouteId, { id })
}
