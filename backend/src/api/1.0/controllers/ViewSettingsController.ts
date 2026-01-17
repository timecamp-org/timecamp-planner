import { LoggerInterface } from '../../../infrastructure/logger'
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

import { Request, Response } from 'express';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { SettingsModule } from '../modules/settings/SettingsModule';
import { ViewSettingsServiceInterface } from '../modules/settings/interfaces/ViewSettingsServiceInterface';
import {
  SaveViewSettingsStatus,
  RemoveViewSettingsStatus,
  GetViewSettingsStatus,
  CreateViewSettingsLinkStatus,
  RemoveViewSettingsLinkStatus,
  CreateViewSettingsWithLinksStatus
} from '../modules/settings/types';
import { ViewContainerType, ViewSettingsType } from '../modules/db/schema';

@injectable()
export class ViewSettingsController {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(SettingsModule.ViewSettingsServiceInterface)
    private viewSettingsService: ViewSettingsServiceInterface,
  ) {
  }

  public async getViewSettingsAction(req: Request, res: Response) {
    try {
      const { containerType, containerId, viewType, viewSettingsId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.viewSettingsService.getSettings(
        userId,
        containerId,
        containerType as ViewContainerType,
        viewType as ViewSettingsType,
        viewSettingsId
      );

      switch (result.status) {
        case GetViewSettingsStatus.OK:
          return res.send(result)
        case GetViewSettingsStatus.VIEW_TYPE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_TYPE_NOT_FOUND])
        case GetViewSettingsStatus.VIEW_SETTINGS_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_SETTINGS_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async saveViewSettingsAction(req: Request, res: Response) {
    try {
      const { containerId, containerType, viewType, viewSettingsId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.viewSettingsService.saveSettings(
        userId,
        containerId,
        containerType as ViewContainerType,
        viewType as ViewSettingsType,
        req.body,
        viewSettingsId,
      );

      switch (result.status) {
        case SaveViewSettingsStatus.OK:
          return res.send(result.viewSettings)
        case SaveViewSettingsStatus.VIEW_TYPE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_TYPE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async deleteViewSettingsAction(req: Request, res: Response) {
    try {
      const { containerId, containerType, viewType, viewSettingsId } = req.params
      const userId = req.heyspace.authResult.userId
      const result = await this.viewSettingsService.removeSettings(
        userId,
        containerId,
        containerType as ViewContainerType,
        viewType as ViewSettingsType,
        viewSettingsId
      );

      switch (result.status) {
        case RemoveViewSettingsStatus.OK:
          return res.send()
        case RemoveViewSettingsStatus.VIEW_TYPE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_TYPE_NOT_FOUND])
        case RemoveViewSettingsStatus.VIEW_SETTINGS_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_SETTINGS_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async createViewSettingsWithLinksAction(req: Request, res: Response) {
    try {
      const { baseViewSettings, linkedViewSettings } = req.body
      const userId = req.heyspace.authResult.userId
      const result = await this.viewSettingsService.createViewSettingsWithLinks(userId, baseViewSettings, linkedViewSettings);

      switch (result.status) {
        case CreateViewSettingsWithLinksStatus.OK:
          return res.send(result)
        case CreateViewSettingsWithLinksStatus.VIEW_SETTINGS_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.VIEW_SETTINGS_ALREADY_EXISTS])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async createViewSettingsLinkAction(req: Request, res: Response) {
    try {
      const { viewSettingsId } = req.params
      const { linkedViewSettingsId } = req.body
      const result = await this.viewSettingsService.createViewSettingsLink(viewSettingsId, linkedViewSettingsId);

      switch (result.status) {
        case CreateViewSettingsLinkStatus.OK:
          return res.send()
        case CreateViewSettingsLinkStatus.VIEW_SETTINGS_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_SETTINGS_NOT_FOUND])
        case CreateViewSettingsLinkStatus.LINKED_VIEW_SETTINGS_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.LINKED_VIEW_SETTINGS_ALREADY_EXISTS])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async removeViewSettingsLinkAction(req: Request, res: Response) {
    try {
      const { viewSettingsId, linkedViewSettingsId } = req.params
      const result = await this.viewSettingsService.removeViewSettingsLink(viewSettingsId, linkedViewSettingsId);

      switch (result.status) {
        case RemoveViewSettingsLinkStatus.OK:
          return res.send()
        case RemoveViewSettingsLinkStatus.VIEW_SETTINGS_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.VIEW_SETTINGS_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }


}
