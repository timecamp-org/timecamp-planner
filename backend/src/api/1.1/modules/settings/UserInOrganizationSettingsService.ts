import { UserInOrganizationSettingsType, UserInOrganizationSettingsFullDbRow, UserInOrganizationSettingsDbRow } from '../db/schema';
import {
  GetUserInOrganizationSettingsResult, SaveUserInOrganizatioSettingsResult, GetUserInOrganizationSettingsStatus, SaveUserInOrganizationSettingsStatus
} from './types'
import { injectable, inject } from 'inversify';
import { SettingsModule } from './SettingsModule';
import { DictProvider } from '../dict/DictProvider';
import { Id } from '../common/identifier';
import {  mergeWith, isArray, isPlainObject, isEmpty } from 'lodash'
import { UserInOrganizationSettingsProviderInterface } from './interfaces/UserInOrganizationSettingsProviderInterface';
import { UserInOrganizationSettingsServiceInterface } from './interfaces/UserInOrganizationSettingsServiceInterface';
import { AnyDict } from '../common/types';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';

@injectable()
export class UserInOrganizationSettingsService implements UserInOrganizationSettingsServiceInterface {
  constructor(
    @inject(SettingsModule.DictUserInOrganizationSettingsType)
    private settingsTypeDictProvider: DictProvider<UserInOrganizationSettingsType>,
    @inject(SettingsModule.UserInOrganizationSettingsProviderInterface)
    private userInOrganizationSettingsProvider: UserInOrganizationSettingsProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface
  ) { }

  async getSettings(
    userId: Id,
    organizationId: Id,
    settingsType: UserInOrganizationSettingsType,
    settingsId?: Id,
  ): Promise<GetUserInOrganizationSettingsResult> {
    let settings: UserInOrganizationSettingsFullDbRow = null

    if (settingsId) {
      settings = await this.userInOrganizationSettingsProvider.getSettngsById(settingsId)
    } else {
      settings = await this.userInOrganizationSettingsProvider.getSettngsByTypeAndContainer(settingsType, organizationId, userId)
    }

    if (!settings) {
      return {
        status: GetUserInOrganizationSettingsStatus.SETTINGS_NOT_FOUND
      }
    }

    return {
      status: GetUserInOrganizationSettingsStatus.OK,
      settings
    }
  }

  async saveSettings(
    userId: Id,
    organizationId: Id,
    settingsType: UserInOrganizationSettingsType,
    settingsJson: AnyDict,
    settingsId?: Id,
  ): Promise<SaveUserInOrganizatioSettingsResult> {
    let currentSettings: UserInOrganizationSettingsFullDbRow = null
    let typeId = null

    if (settingsId) {
      currentSettings = await this.userInOrganizationSettingsProvider.getSettngsById(settingsId)
      if (!currentSettings) {
        return {
          status: SaveUserInOrganizationSettingsStatus.SETTINGS_NOT_FOUND,
        }
      }
      typeId = currentSettings.typeId
    } else {
      const settingsTypeDbRow = await this.settingsTypeDictProvider.getItemByValue(settingsType)
      if (!settingsTypeDbRow) {
        return {
          status: SaveUserInOrganizationSettingsStatus.SETTINGS_TYPE_NOT_FOUND,
        }
      }

      currentSettings = await this.userInOrganizationSettingsProvider.getSettngsByTypeAndContainer(settingsType, organizationId, userId)
      typeId = settingsTypeDbRow.id
    }

    // need to merge it here, because knex doesn't give us easy way to update jsonb rows with partial data and
    // by default it will swap old value with new
    const mergedSettings = mergeWith(currentSettings?.value || {}, settingsJson, (currentValue, incomingValue) => {
      if (isArray(currentValue)) {
        return incomingValue
      }

      if (isPlainObject(currentValue) && isPlainObject(incomingValue) && isEmpty(incomingValue)) {
        return incomingValue
      }
    })

    const userInOrganizationId = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId)

    const payload: Partial<UserInOrganizationSettingsDbRow> = {
      userInOrganizationId: userInOrganizationId.id,
      value: mergedSettings,
      typeId,
    }

    let result: UserInOrganizationSettingsDbRow;

    if (currentSettings) {
      result = await this.userInOrganizationSettingsProvider.updateSettings(currentSettings.id, payload)
    } else {
      result = await this.userInOrganizationSettingsProvider.createSettings(payload)
    }
    return {
      status: SaveUserInOrganizationSettingsStatus.OK,
      settings: result,
    }
  } 

}
