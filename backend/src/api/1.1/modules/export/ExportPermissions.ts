import { PermissionContext, CheckPermissionResult, PermissionType, CheckPermissionStatus } from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { ExtensionsModule } from '../extensions/ExtensionsModule';
import { ExtensionServiceInterface } from '../extensions/interfaces/ExtensionServiceInterface';

@injectable()
export class ExportPermissions implements EntityPermissionInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface)
    private extensionService: ExtensionServiceInterface,
  ) { }

  public registerChainableRules() {
    this.logger.debug('Registering export permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.EXPORT_DATA,
        this.canExportData.bind(this)
      ),
    ])
  }

  async canExportData(context: PermissionContext): Promise<CheckPermissionResult> {
    const { metadata } = context

    if (!metadata) {
      return {
        status: CheckPermissionStatus.NOT_PERMITTED,
      }
    }

    const { organizationId, extensionId, userInOrganizationId } = metadata

    let finalOrganizationId = organizationId

    if (!finalOrganizationId && userInOrganizationId) {
      const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId)
      finalOrganizationId = userInOrganization.organizationId
    }

    if (!finalOrganizationId) {
      return {
        status: CheckPermissionStatus.NOT_PERMITTED,
      }
    }

    if (extensionId) {
      const extension = await this.extensionService.getExtensionById(extensionId)
      if (!extension) {
        return {
          status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
        }
      }

      return {
        status: CheckPermissionStatus.OK,
      }
    } else {
      return {
        status: CheckPermissionStatus.OK,
      }
    }

  }

}
