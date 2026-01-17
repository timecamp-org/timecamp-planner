import { PermissionContext, CheckPermissionResult, PermissionType, CheckPermissionStatus, PermissionDeniedReason } from "../permissions/types";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { inject, injectable } from "inversify";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PermissionChainInterface } from "../permissions/interfaces/PermissionChainInterface";
import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { PermissionRule } from "../permissions/PermissionRule";
import { UserAppsModule } from "./UserAppsModule";
import { UserAppsDataProviderInterface } from "./interfaces/UserAppsDataProviderInterface";
import { createPermissionResult } from "../permissions/helpers";
import { AppUserRole } from "../db/schema";

@injectable()
export class UserAppsPermissions implements EntityPermissionInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(UserAppsModule.UserAppsDataProviderInterface)
    private userAppsDataProvider: UserAppsDataProviderInterface,
  ) {
  }

  public registerChainableRules() {
    this.logger.debug('Registering extension permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.UPDATE_APP,
        this.canUpdateApp.bind(this)
      ),
      new PermissionRule(
        PermissionType.DELETE_APP,
        this.canDeleteApp.bind(this)
      ),
      new PermissionRule(
        PermissionType.ADD_APP_MEMBER,
        this.canDeleteApp.bind(this)
      ),
      new PermissionRule(
        PermissionType.REMOVE_APP_MEMBER,
        this.canDeleteAppMember.bind(this)
      ),
    ])
  }

  async canUpdateApp(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, appId } = context
    const app = await this.userAppsDataProvider.getAppById(appId)
    if (!app) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }
    const isUserAppMember = await this.userAppsDataProvider.isUserAppMember(appId, currentUserId)
    return createPermissionResult(isUserAppMember, PermissionDeniedReason.USER_NOT_APP_MEMBER)
  }

  async canDeleteApp(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, appId } = context
    const canUpdateUserAppResult = await this.canUpdateApp(context)
    if (canUpdateUserAppResult.status !== CheckPermissionStatus.OK) {
      return canUpdateUserAppResult
    }
    const appMember = await this.userAppsDataProvider.getUserInApp(appId, currentUserId)
    const isOwner = appMember.role === AppUserRole.OWNER
    return createPermissionResult(isOwner, PermissionDeniedReason.USER_NOT_APP_OWNER)
  }

  async canDeleteAppMember(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, userId, appId } = context
    const canUpdateUserAppResult = await this.canUpdateApp(context)
    if (canUpdateUserAppResult.status !== CheckPermissionStatus.OK) {
      return canUpdateUserAppResult
    }
    const appMember = await this.userAppsDataProvider.getUserInApp(appId, currentUserId)
    const isOwner = appMember.role === AppUserRole.OWNER
    if (isOwner && currentUserId === userId) {
      return createPermissionResult(false, PermissionDeniedReason.CANNOT_REMOVE_APP_OWNER)
    }
    return {
      status: CheckPermissionStatus.OK
    }
  }

}
