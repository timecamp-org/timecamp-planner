import {
  SaveViewSettingsResult,
  RemoveViewSettingsResult,
  GetViewSettingsResult,
  CreateViewSettingsLinkResult,
  RemoveViewSettingsLinkResult,
  CreateViewSettingsWithLinksResult,
  ViewSettingsJson
} from '../types';
import { ViewContainerType, ViewSettingsType } from '../../db/schema';
import { Id } from '../../common/identifier';
import { AnyDict } from '../../common/types';


export interface ViewSettingsServiceInterface {
  getSettings(
    userId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    viewType: ViewSettingsType,
    viewSettingsId?: Id,
  ): Promise<GetViewSettingsResult>;

  saveSettings(
    userId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    viewType: ViewSettingsType,
    settings: AnyDict,
    viewSettingsId?: Id,
  ): Promise<SaveViewSettingsResult>;

  createViewSettingsWithLinks(
    userId: Id,
    baseViewSettingsPayload: ViewSettingsJson,
    linkedViewSettingsPayloads: ViewSettingsJson[],
    trx?: Transaction
  ): Promise<CreateViewSettingsWithLinksResult>;

  removeSettings(
    userId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    viewType: ViewSettingsType,
    viewSettingsId?: Id,
  ): Promise<RemoveViewSettingsResult>;

  createViewSettingsLink(
    baseViewSettingsId: Id,
    linkedViewSettingsId: Id,
  ): Promise<CreateViewSettingsLinkResult>;

  removeViewSettingsLink(
    baseViewSettingsId: Id,
    linkedViewSettingsId: Id,
  ): Promise<RemoveViewSettingsLinkResult>;
}
