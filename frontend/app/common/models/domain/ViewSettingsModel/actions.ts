import * as C from './constants'
import { action } from 'typesafe-actions'
import { Id } from 'common/utils/identifier'
import { PayloadAction } from 'common/types'
import {
  OnCreateViewSettingsPayload,
  OnDeleteViewSettingsPayload,
  OnDeleteViewSettingsSuccessPayload,
  OnFetchViewSettingsPayload,
  OnUpdateViewSettingsBodyPayload,
  OnUpdateViewSettingsPayload,
  OnCreateBaseViewSettingsPayload,
} from 'models/domain/ViewSettingsModel/payloads'
import {
  ViewContainerType,
  ViewSettingsBodyType,
  ViewSettingsInterface, ViewSettingsViewType,
} from 'models/domain/ViewSettingsModel/types'

export const onCreateViewSettings = (viewSettings: ViewSettingsInterface, viewSettingsBody: ViewSettingsBodyType, baseViewSettingsId?: Id): PayloadAction<OnCreateViewSettingsPayload> =>
  action(C.onCreateViewSettings, { viewSettings, viewSettingsBody, baseViewSettingsId })

export function onUpdateViewSettings(viewId: Id, settings: Partial<ViewSettingsInterface>): PayloadAction<OnUpdateViewSettingsPayload> {
  return action(C.onUpdateViewSettings, { viewId, settings })
}

export function onDeleteViewSettings(viewId: Id): PayloadAction<OnDeleteViewSettingsPayload> {
  return action(C.onDeleteViewSettings, { viewId })
}

export function onDeleteViewSettingsSuccess(viewId: Id, baseViewId?: Id): PayloadAction<OnDeleteViewSettingsSuccessPayload> {
  return action(C.onDeleteViewSettingsSuccess, { viewId, baseViewId })
}

export function onUpdateViewSettingsBody(viewId: Id, settings: Partial<ViewSettingsBodyType>): PayloadAction<OnUpdateViewSettingsBodyPayload> {
  return action(C.onUpdateViewSettingsBody, { viewId, settings })
}

export function onFetchViewSettings(viewType: ViewSettingsViewType, containerType: ViewContainerType, containerId: Id): PayloadAction<OnFetchViewSettingsPayload> {
  return action(C.onFetchViewSettings, { viewType, containerType, containerId })
}

export function onCreateBaseViewSettings(
  viewType: ViewSettingsViewType, 
  containerType: ViewContainerType, 
  containerId: Id,
  viewSettingsBody: ViewSettingsBodyType,
  ): PayloadAction<OnCreateBaseViewSettingsPayload> {
  return action(C.onCreateBaseViewSettings, { viewType, containerType, containerId, viewSettingsBody })
}
