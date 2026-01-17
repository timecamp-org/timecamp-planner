import {
  PermissionContext,
  CheckPermissionResult,
  PermissionType,
  PermissionDeniedReason
} from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { NotificationsModule } from './NotificationsModule';
import { NotificationProviderInterface } from './interfaces/NotificationProviderInterface';
import { createPermissionResult } from '../permissions/helpers';

@injectable()
export class NotificationPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface;
  private permissionChain: PermissionChainInterface;
  private userInOrganizationProvider: UserInOrganizationProviderInterface;
  private notificationProvider: NotificationProviderInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
      permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
      userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(NotificationsModule.NotificationProviderInterface)
      notificationProvider: NotificationProviderInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.userInOrganizationProvider = userInOrganizationProvider
    this.notificationProvider = notificationProvider
  }

  public registerChainableRules() {
    this.logger.debug('Registering notification permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.UPDATE_NOTIFICATION,
        this.canUpdateNotification.bind(this)
      ),
    ])
  }
  
  async canUpdateNotification(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, notificationId } = context

    const notification = await this.notificationProvider.getNotification(notificationId)
    const userIsInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(notification.organizationId, currentUserId)
    return createPermissionResult(userIsInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
  }

}
