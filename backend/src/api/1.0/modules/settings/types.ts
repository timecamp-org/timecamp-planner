import { ViewSettingsDbRow, ViewSettingsFullDbRow, ViewContainerType, ViewSettingsType } from '../db/schema';
import { Id } from '../common/identifier';
import { AnyDict } from '../common/types';

export enum GetViewSettingsStatus {
  OK,
  VIEW_TYPE_NOT_FOUND,
  VIEW_SETTINGS_NOT_FOUND,
}

export interface GetViewSettingsResult {
  status: GetViewSettingsStatus,
  baseViewSettings?: ViewSettingsFullDbRow,
  linkedViewSettings?: ViewSettingsFullDbRow[]
}

export enum SaveViewSettingsStatus {
  OK,
  VIEW_TYPE_NOT_FOUND,
  VIEW_SETTINGS_NOT_FOUND,
}

export interface SaveViewSettingsResult {
  status: SaveViewSettingsStatus,
  viewSettings?: ViewSettingsDbRow,
}

export enum RemoveViewSettingsStatus {
  OK,
  VIEW_TYPE_NOT_FOUND,
  VIEW_SETTINGS_NOT_FOUND,
}

export interface RemoveViewSettingsResult {
  status: RemoveViewSettingsStatus,
}

export enum CreateViewSettingsLinkStatus {
  OK,
  VIEW_SETTINGS_NOT_FOUND,
  LINKED_VIEW_SETTINGS_ALREADY_EXISTS,
}

export interface CreateViewSettingsLinkResult {
  status: CreateViewSettingsLinkStatus,
}

export enum RemoveViewSettingsLinkStatus {
  OK,
  VIEW_SETTINGS_NOT_FOUND,
}

export interface RemoveViewSettingsLinkResult {
  status: RemoveViewSettingsLinkStatus,
}
export enum CreateViewSettingsWithLinksStatus {
  OK,
  VIEW_SETTINGS_ALREADY_EXISTS
}

export interface CreateViewSettingsWithLinksResult {
  status: CreateViewSettingsWithLinksStatus,
  baseViewSettings?: ViewSettingsFullDbRow,
  linkedViewSettings?: ViewSettingsFullDbRow[]
}

export interface ViewSettingsJson {
  id?: Id,
  containerType: ViewContainerType,
  containerId: Id,
  viewType: ViewSettingsType,
  settings: AnyDict,
}

export interface BaseViewSettings {
  viewType: ViewSettingsType,
  containerId: Id,
  containerType: ViewContainerType,
}

export interface SaveViewSettingsJson {
  settings: BaseViewSettings,
  settingsBody: AnyDict,
}