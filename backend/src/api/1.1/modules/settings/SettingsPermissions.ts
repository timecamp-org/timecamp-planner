import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason, CheckPermissionStatus } from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { SettingsModule } from './SettingsModule';
import { ViewSettingsProviderInterface } from './interfaces/ViewSettingsProviderInterface';
import { ViewSettingsType, ViewContainerType, UserInOrganizationSettingsFullDbRow } from '../db/schema';
import { createPermissionResult } from '../permissions/helpers';
import { DictProvider } from '../dict/DictProvider';
import { Id } from '../common/identifier';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { OrganizationServiceInterface } from '../organizations/interfaces/OrganizationServiceInterface';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { UserInOrganizationSettingsProviderInterface } from './interfaces/UserInOrganizationSettingsProviderInterface';

@injectable()
export class SettingsPermissions implements EntityPermissionInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(SettingsModule.ViewSettingsProviderInterface)
    private viewSettingsProvider: ViewSettingsProviderInterface,
    @inject(SettingsModule.DictViewType)
    private viewTypeDict: DictProvider<ViewSettingsType>,
    @inject(OrganizationsModule.OrganizationServiceInterface)
    private organizationService: OrganizationServiceInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(SettingsModule.UserInOrganizationSettingsProviderInterface)
    private userInOrganizationSettingsProvider: UserInOrganizationSettingsProviderInterface,
  ) { }

  public registerChainableRules() {
    this.logger.debug('Registering settings permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.CAN_CREATE_VIEW_SETTINGS,
        this.canCreateViewSettings.bind(this)
      ),
      new PermissionRule(
        PermissionType.CAN_UPDATE_VIEW_SETTINGS,
        this.canUpdateViewSettings.bind(this)
      ),
      new PermissionRule(
        PermissionType.CAN_UPDATE_VIEW_SETTINGS_LINK,
        this.canUpdateViewSettingsLink.bind(this)
      ),
      new PermissionRule(
        PermissionType.CAN_UPDATE_USER_IN_ORGANIZATION_SETTINGS,
        this.canUpdateUserInOrganizationSettings.bind(this)
      ),
      new PermissionRule(
        PermissionType.CAN_GET_USER_IN_ORGANIZATION_SETTINGS,
        this.canGetUserInOrganizationSettings.bind(this)
      ),
    ])
  }

  async canUpdateViewSettings(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, containerId, containerType, viewType, viewSettingsId } = context
    return await this.checkAccessToViewSettings(currentUserId, viewType, containerType as ViewContainerType, containerId, viewSettingsId)
  }

  async canCreateViewSettings(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, baseViewSettings } = context
    const { viewType, containerId, containerType } = baseViewSettings
    return await this.checkAccessToViewSettings(currentUserId, viewType, containerType, containerId)
  }

  private async checkAccessToViewSettings(
    currentUserId: Id,
    viewType: ViewSettingsType,
    containerType: ViewContainerType,
    containerId: Id,
    viewSettingsId?: Id,
  ): Promise<CheckPermissionResult> {
    let settings = null
    if (viewSettingsId) {
      settings = await this.viewSettingsProvider.getSettngsById(viewSettingsId)
      if (!settings) {
        return {
          status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
        }
      }
    } else {
      const viewTypeDbRow = await this.viewTypeDict.getItemByValue(viewType)
      if (!viewTypeDbRow) {
        return {
          status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
        }
      }
      settings = await this.viewSettingsProvider.getSettngsByTypeAndContainer(viewTypeDbRow.id, containerId, containerType, currentUserId)
    }

    if (settings && settings.userId !== currentUserId) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_VIEW_OWNER)
    }

    return await this.checkAccessToViewContainer(viewType, containerType || settings.containerType, containerId || settings.containerId)
  }

  async canUpdateViewSettingsLink(context: PermissionContext): Promise<CheckPermissionResult> {
    const { viewSettingsId, currentUserId } = context
    const settings = await this.viewSettingsProvider.getSettngsById(viewSettingsId)
    if (!settings) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }

    if (settings.userId !== currentUserId) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_VIEW_OWNER)
    }

    return await this.checkAccessToViewContainer(settings.viewType, settings.containerType, settings.containerId)
  }

  private async checkAccessToViewContainer(
    viewType: ViewSettingsType,
    containerType: ViewContainerType,
    containerId: Id
  ): Promise<CheckPermissionResult> {
    await this.getOrganizationIdFromContainer(containerType, containerId)

    switch (viewType) {
      case ViewSettingsType.TIMELINE: {
        switch (containerType) {
          case ViewContainerType.OVERWATCH_SPACE_TILE: {
            return this.checkOverwatchFeatureAccess()
          }
          default: {
            return {
              status: CheckPermissionStatus.OK,
            }
          }
        }
      }
      case ViewSettingsType.OVERWATCH: {
        return this.checkOverwatchFeatureAccess()
      }
      default: {
        return {
          status: CheckPermissionStatus.OK
        }
      }
    }
  }

  private async checkOverwatchFeatureAccess(): Promise<CheckPermissionResult> {
    return {
      status: CheckPermissionStatus.OK,
    }
  }

  private async getOrganizationIdFromContainer(containerType: ViewContainerType, containerId: Id): Promise<Id> {
    switch (containerType) {
      case ViewContainerType.ORGANIZATION: {
        return containerId
      }
      case ViewContainerType.MY_TASKS:
      case ViewContainerType.OVERWATCH_SPACE_TILE:
      case ViewContainerType.PROJECT: {
        return this.organizationService.getOrganizationIdByProjectId(containerId)
      }
      case ViewContainerType.TASK: {
        return this.organizationService.getOrganizationIdByTaskId(containerId)
      }
      default:
        throw new Error('Unknown container type')
    }
  }

  async canGetUserInOrganizationSettings(context: PermissionContext): Promise<CheckPermissionResult> {
    const { organizationId, currentUserId } = context
    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, organizationId)

    if (!userInOrganization) {
      return {
        status: CheckPermissionStatus.NOT_PERMITTED
      }
    }

    return {
      status: CheckPermissionStatus.OK
    }
  }

  async canUpdateUserInOrganizationSettings(context: PermissionContext): Promise<CheckPermissionResult> {
    const { organizationId, currentUserId, settingsId, settingsType } = context
    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, organizationId)

    if (!userInOrganization) {
      return {
        status: CheckPermissionStatus.NOT_PERMITTED
      }
    }

    let settings: UserInOrganizationSettingsFullDbRow;

    if (settingsId) {
      settings = await this.userInOrganizationSettingsProvider.getSettngsById(settingsId)
      if (!settings) {
        return {
          status: CheckPermissionStatus.RESOURCE_NOT_FOUND
        }
      }
    } else {
      settings = await this.userInOrganizationSettingsProvider.getSettngsByTypeAndContainer(settingsType, organizationId, currentUserId)
    }

    if (settings && settings.userInOrganizationId !== userInOrganization.id) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_SETTINGS_OWNER)
    }

    return {
      status: CheckPermissionStatus.OK
    }
  }

}
