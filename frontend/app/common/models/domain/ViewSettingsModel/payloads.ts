import { Id } from 'common/utils/identifier'
import {
  ViewContainerType,
  ViewSettingsBodyType,
  ViewSettingsInterface,
  ViewSettingsViewType
} from 'models/domain/ViewSettingsModel/types'

export interface OnCreateViewSettingsPayload {
  viewSettings: ViewSettingsInterface,
  viewSettingsBody: ViewSettingsBodyType,
  baseViewSettingsId?: Id,
}

export interface OnUpdateViewSettingsPayload {
  viewId: Id,
  settings: Partial<ViewSettingsInterface>,
}

export interface OnDeleteViewSettingsPayload {
  viewId: Id,
}

export interface OnDeleteViewSettingsSuccessPayload {
  viewId: Id,
  baseViewId?: Id,
}

export interface OnUpdateViewSettingsBodyPayload {
  viewId: Id,
  settings: Partial<ViewSettingsBodyType>,
}

export interface OnFetchViewSettingsPayload {
  viewType: ViewSettingsViewType,
  containerType: ViewContainerType,
  containerId: Id,
}

export interface OnCreateBaseViewSettingsPayload {
  viewType: ViewSettingsViewType,
  containerType: ViewContainerType,
  containerId: Id,
  viewSettingsBody: ViewSettingsBodyType,
}
