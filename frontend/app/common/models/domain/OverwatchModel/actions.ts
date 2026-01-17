import * as C from './constants'
import { action } from 'typesafe-actions'
import { Id } from 'common/utils/identifier'
import { PayloadAction } from 'common/types'
import { List } from 'immutable'
import { OnCreateOverwatchViewPayload, OnUpdateOverwatchViewsPayload } from './payloads'

export const onCreateOverwatchView = (spaceIds: List<Id>): PayloadAction<OnCreateOverwatchViewPayload> =>
  action(C.onCreateOverwatchView, { spaceIds })

export function onUpdateOverwatchViews(selectedSpaceIds: List<Id>, overwatchViewId: Id): PayloadAction<OnUpdateOverwatchViewsPayload> {
  return action(C.onUpdateOverwatchViews, { selectedSpaceIds, overwatchViewId })
}

export function onClearOverwatchFilters() {
  return action(C.onClearOverwatchFilters)
}