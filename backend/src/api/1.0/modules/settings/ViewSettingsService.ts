import { ViewSettingsServiceInterface } from './interfaces/ViewSettingsServiceInterface';
import { ViewSettingsType, ViewSettingsDbRow, ViewContainerType, ViewSettingsFullDbRow } from '../db/schema';
import {
  SaveViewSettingsResult,
  SaveViewSettingsStatus,
  RemoveViewSettingsResult,
  RemoveViewSettingsStatus,
  GetViewSettingsResult,
  GetViewSettingsStatus,
  CreateViewSettingsLinkResult,
  CreateViewSettingsLinkStatus,
  RemoveViewSettingsLinkResult,
  RemoveViewSettingsLinkStatus,
  CreateViewSettingsWithLinksResult,
  CreateViewSettingsWithLinksStatus,
  ViewSettingsJson, SaveViewSettingsJson, BaseViewSettings
} from './types'
import { injectable, inject } from 'inversify';
import { UniqueKey } from '../db/Table'
import { SettingsModule } from './SettingsModule';
import { ViewSettingsProviderInterface } from './interfaces/ViewSettingsProviderInterface';
import { DictProvider } from '../dict/DictProvider';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { LinkedViewSettingsProviderInterface } from './interfaces/LinkedViewSettingsProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

import ErrorDefinitions, { Type } from '../common/ErrorDefinitions';
import { CommonModule } from '../common/CommonModule';
import { violatesUniqueKey } from '../../../../utils';
import { isNil, mergeWith, isArray, isPlainObject, isEmpty } from 'lodash'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';

@injectable()
export class ViewSettingsService implements ViewSettingsServiceInterface {
  constructor(
    @inject(SettingsModule.DictViewType)
    private viewTypeDictProvider: DictProvider<ViewSettingsType>,
    @inject(SettingsModule.ViewSettingsProviderInterface)
    private viewSettingsProvider: ViewSettingsProviderInterface,
    @inject(SettingsModule.LinkedViewSettingsProviderInterface)
    private linkedViewSettingsProvider: LinkedViewSettingsProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
  ) { }

  async getSettings(
    userId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    viewType: ViewSettingsType,
    viewSettingsId?: Id,
  ): Promise<GetViewSettingsResult> {
    let baseViewSettings = null

    if (viewSettingsId) {
      baseViewSettings = await this.viewSettingsProvider.getSettngsById(viewSettingsId)
    } else {
      const viewTypeDbRow = await this.viewTypeDictProvider.getItemByValue(viewType)
      if (!viewTypeDbRow) {
        return {
          status: GetViewSettingsStatus.VIEW_TYPE_NOT_FOUND,
        }
      }
      baseViewSettings = await this.viewSettingsProvider.getSettngsByTypeAndContainer(viewTypeDbRow.id, containerId, containerType, userId)
    }

    if (!baseViewSettings) {
      return {
        status: GetViewSettingsStatus.VIEW_SETTINGS_NOT_FOUND
      }
    }

    const linkedViewSettingsIds = await this.linkedViewSettingsProvider.getLinkedViewSettingsIdsByBaseId(baseViewSettings.id)

    const linkedViewSettings = await this.viewSettingsProvider.getSettngsByIds(linkedViewSettingsIds)

    return {
      status: GetViewSettingsStatus.OK,
      baseViewSettings,
      linkedViewSettings,
    }
  }

  async createViewSettingsWithLinks(
    userId: string,
    baseViewSettingsPayload: ViewSettingsJson,
    linkedViewSettingsPayloads: ViewSettingsJson[]
  ): Promise<CreateViewSettingsWithLinksResult> {
    try {
      return await this.connection.getConnection().transaction(async trx => {

        const baseViewSettings = await this.createBaseSettings(trx, userId, baseViewSettingsPayload)

        if (isNil(linkedViewSettingsPayloads) || linkedViewSettingsPayloads.length === 0) {
          return {
            status: CreateViewSettingsWithLinksStatus.OK,
            baseViewSettings,
          }
        }

        const linkedViewSettings = await this.createLinkedSettings(trx, userId, linkedViewSettingsPayloads)

        await this.bindBaseSettingsWithLinks(trx, baseViewSettings, linkedViewSettings)

        return {
          status: CreateViewSettingsWithLinksStatus.OK,
          baseViewSettings,
          linkedViewSettings,
        }
      })
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.VIEW_SETTINGS_UNIQ)) {
        return { status: CreateViewSettingsWithLinksStatus.VIEW_SETTINGS_ALREADY_EXISTS }
      }
      throw error;
    }
  }

  private async createBaseSettings(trx: Transaction, userId: Id, payload: ViewSettingsJson): Promise<ViewSettingsFullDbRow> {
    const baseViewSettingsData = await this.buildViewSettings(userId, payload, trx)

    return await this.viewSettingsProvider.createSettings(baseViewSettingsData, trx) as ViewSettingsFullDbRow
  }

  private async createLinkedSettings(trx: Transaction, userId: Id, payloads: ViewSettingsJson[]): Promise<ViewSettingsFullDbRow[]> {
    const linkedPayloadPromises = payloads.map((viewSettings) => {
      return this.buildViewSettings(userId, viewSettings, trx)
    })

    const linkedPayloads = await Promise.all(linkedPayloadPromises)

    const linkedPromises = linkedPayloads.map((viewSettings) => {
      return this.viewSettingsProvider.createSettings(viewSettings, trx)
    })

    return await Promise.all(linkedPromises)
  }

  private async bindBaseSettingsWithLinks(
    trx: Transaction,
    baseViewSettings: ViewSettingsDbRow,
    linkedViewSettings: ViewSettingsDbRow[]
  ): Promise<void> {
    const settingsLinksPromises = linkedViewSettings.map((linkedViewSetting) => {
      return this.createViewSettingsLink(baseViewSettings.id, linkedViewSetting.id, trx)
    })

    await Promise.all(settingsLinksPromises)
  }

  async saveSettings(
    userId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    viewType: ViewSettingsType,
    settingsJson: SaveViewSettingsJson,
    viewSettingsId?: Id,
  ): Promise<SaveViewSettingsResult> {
    let currentSettings = null
    let viewTypeId = null

    if (viewSettingsId) {
      currentSettings = await this.viewSettingsProvider.getSettngsById(viewSettingsId)
      if (!currentSettings) {
        return {
          status: SaveViewSettingsStatus.VIEW_SETTINGS_NOT_FOUND,
        }
      }
      viewTypeId = currentSettings.viewTypeId
    } else {
      const viewTypeDbRow = await this.viewTypeDictProvider.getItemByValue(viewType)
      if (!viewTypeDbRow) {
        return {
          status: SaveViewSettingsStatus.VIEW_TYPE_NOT_FOUND,
        }
      }

      currentSettings = await this.viewSettingsProvider.getSettngsByTypeAndContainer(viewTypeDbRow.id, containerId, containerType, userId)
      viewTypeId = viewTypeDbRow.id
    }

    const {
      settingsBody = {},
      settings = {} as BaseViewSettings,
    } = settingsJson
    // need to merge it here, because knex doesn't give us easy way to update jsonb rows with partial data and
    // by default it will swap old value with new
    const mergedSettings = mergeWith(currentSettings.settings, settingsBody, (currentValue, incomingValue) => {
      if (isArray(currentValue)) {
        return incomingValue
      }

      if (isPlainObject(currentValue) && isPlainObject(incomingValue) && isEmpty(incomingValue)) {
        return incomingValue
      }
    })

    if (settings.viewType) {
      const viewTypeDbRow = await this.viewTypeDictProvider.getItemByValue(settings.viewType)
      if (!viewTypeDbRow) {
        return {
          status: SaveViewSettingsStatus.VIEW_TYPE_NOT_FOUND,
        }
      }
      viewTypeId = viewTypeDbRow.id
    }

    const payload: Partial<ViewSettingsDbRow> = {
      userId,
      settings: mergedSettings,
      viewTypeId,
      containerId: settings.containerId || containerId || currentSettings.containerId,
      containerType: settings.containerType || containerType || currentSettings.containerType,
    }

    let result: ViewSettingsDbRow;

    if (currentSettings) {
      payload.updatedAt = this.timeService.getCurrentTime()
      result = await this.viewSettingsProvider.updateSettings(currentSettings.id, payload)
    } else {
      result = await this.viewSettingsProvider.createSettings(payload)
    }
    return {
      status: SaveViewSettingsStatus.OK,
      viewSettings: result,
    }
  }

  private async buildViewSettings(userId: Id, viewSettingsJson: ViewSettingsJson, trx?: Transaction): Promise<ViewSettingsDbRow> {
    const viewTypeDbRow = await this.viewTypeDictProvider.getItemByValue(viewSettingsJson.viewType, trx)
    if (!viewTypeDbRow) {
      throw ErrorDefinitions[Type.VIEW_TYPE_NOT_FOUND]
    }
    const viewSettings: ViewSettingsDbRow = {
      id: viewSettingsJson.id || this.idGenerator.generateId(),
      containerId: viewSettingsJson.containerId,
      containerType: viewSettingsJson.containerType,
      settings: viewSettingsJson.settings,
      userId,
      viewTypeId: viewTypeDbRow.id,
    }

    return viewSettings
  }

  async removeSettings(
    userId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    viewType: ViewSettingsType,
    viewSettingsId?: Id,
  ): Promise<RemoveViewSettingsResult> {
    if (viewSettingsId) {
      await this.viewSettingsProvider.deleteSettings(viewSettingsId)
      return {
        status: RemoveViewSettingsStatus.OK,
      }
    }
    const viewTypeDbRow = await this.viewTypeDictProvider.getItemByValue(viewType)
    if (!viewTypeDbRow) {
      return {
        status: RemoveViewSettingsStatus.VIEW_TYPE_NOT_FOUND,
      }
    }
    const settings = await this.viewSettingsProvider.getSettngsByTypeAndContainer(viewTypeDbRow.id, containerId, containerType, userId)
    if (!settings) {
      return {
        status: RemoveViewSettingsStatus.VIEW_SETTINGS_NOT_FOUND,
      }
    }
    await this.viewSettingsProvider.deleteSettings(settings.id)
    return {
      status: RemoveViewSettingsStatus.OK,
    }
  }

  async createViewSettingsLink(baseViewSettingsId: Id, linkedViewSettingsId: Id, trx?: Transaction): Promise<CreateViewSettingsLinkResult> {
    try {
      const settings = await this.viewSettingsProvider.getSettngsById(baseViewSettingsId, trx)
      if (!settings) {
        return {
          status: CreateViewSettingsLinkStatus.VIEW_SETTINGS_NOT_FOUND,
        }
      }

      await this.linkedViewSettingsProvider.createViewSettingsLink(baseViewSettingsId, linkedViewSettingsId, trx)
      return {
        status: CreateViewSettingsLinkStatus.OK,
      }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.LINKED_VIEW_SETTINGS_UNIQ)) {
        return { status: CreateViewSettingsLinkStatus.LINKED_VIEW_SETTINGS_ALREADY_EXISTS }
      }
      throw error;
    }
  }

  async removeViewSettingsLink(baseViewSettingsId: Id, linkedViewSettingsId: Id): Promise<RemoveViewSettingsLinkResult> {
    const settings = await this.viewSettingsProvider.getSettngsById(baseViewSettingsId)
    if (!settings) {
      return {
        status: RemoveViewSettingsLinkStatus.VIEW_SETTINGS_NOT_FOUND,
      }
    }

    await this.linkedViewSettingsProvider.removeViewSettingsLink(baseViewSettingsId, linkedViewSettingsId)
    return {
      status: RemoveViewSettingsLinkStatus.OK,
    }
  }


}
