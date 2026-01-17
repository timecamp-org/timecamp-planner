import { LoggerInterface } from '../../../infrastructure/logger'
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

import { Request, Response } from 'express';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { SettingsModule } from '../modules/settings/SettingsModule';
import {
  GetUserInOrganizationSettingsStatus,
  SaveUserInOrganizationSettingsStatus
} from '../modules/settings/types';
import { UserInOrganizationSettingsType } from '../modules/db/schema';
import { UserInOrganizationSettingsServiceInterface } from '../modules/settings/interfaces/UserInOrganizationSettingsServiceInterface';

@injectable()
export class SettingsController {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(SettingsModule.UserInOrganizationSettingsServiceInterface)
    private userInOrganizationSettingsService: UserInOrganizationSettingsServiceInterface,
  ) {
  }

  public async getUserInOrganizationSettings(req: Request, res: Response) {
    try {
      const { organizationId, settingsType, settingsId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.userInOrganizationSettingsService.getSettings(
        userId,
        organizationId,
        settingsType as UserInOrganizationSettingsType,
        settingsId
      );

      switch (result.status) {
        case GetUserInOrganizationSettingsStatus.OK:
          return res.send(result)
        case GetUserInOrganizationSettingsStatus.SETTINGS_TYPE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.SETTINGS_TYPE_NOT_FOUND])
        case GetUserInOrganizationSettingsStatus.SETTINGS_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.SETTINGS_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async saveUserInOrganizationSettingsAction(req: Request, res: Response) {
    try {
      const { organizationId, settingsType, settingsId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.userInOrganizationSettingsService.saveSettings(
        userId,
        organizationId,
        settingsType as UserInOrganizationSettingsType,
        req.body,
        settingsId,
      );

      switch (result.status) {
        case SaveUserInOrganizationSettingsStatus.OK:
          return res.send(result.settings)
        case SaveUserInOrganizationSettingsStatus.SETTINGS_TYPE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.SETTINGS_TYPE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

}
