import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason } from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { createPermissionResult } from '../permissions/helpers';
import { FileProviderInterface } from './interfaces/FileProviderInterface';
import { FilesModule } from './FilesModule';

@injectable()
export class FilePermissions implements EntityPermissionInterface {
  private logger: LoggerInterface
  private userInOrganizationProvider: UserInOrganizationProviderInterface;
  private permissionChain: PermissionChainInterface;
  private fileProvider: FileProviderInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
      permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
      userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(FilesModule.FileProviderInterface)
      fileProvider: FileProviderInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.userInOrganizationProvider = userInOrganizationProvider
    this.fileProvider = fileProvider
  }

  public registerChainableRules() {
    this.logger.debug('Registering file permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.CREATE_FILE,
        this.canCreateFile.bind(this)
      ),
    ])
  }

  async canCreateFile(context: PermissionContext): Promise<CheckPermissionResult> {
    let { currentUserId, organizationId, fileId } = context

    if (!organizationId) {
      const file = await this.fileProvider.getFileById(fileId)
      if (file) {
        organizationId = file.organizationId
      }
    }

    const userIsInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(organizationId, currentUserId)
    return createPermissionResult(userIsInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
  }

}
