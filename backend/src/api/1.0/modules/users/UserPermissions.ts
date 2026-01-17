import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason } from "../permissions/types";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { inject, injectable } from "inversify";
import { some } from 'lodash'
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PermissionChainInterface } from "../permissions/interfaces/PermissionChainInterface";
import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { PermissionRule } from "../permissions/PermissionRule";
import { createPermissionResult } from "../permissions/helpers";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { UserInOrganizationProviderInterface } from "../organizations/interfaces/UserInOrganizationProviderInterface";

@injectable()
export class UserPermissions implements EntityPermissionInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
  ) {
  }

  public registerChainableRules() {
    this.logger.debug('Registering organization permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.DELETE_USER,
        this.canDeleteUser.bind(this)
      ),
    ])
  }

  async canDeleteUser(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId } = context

    const userOwnedOrganizationIds = await this.userInOrganizationProvider.getUserOwnedOrganizationIds(currentUserId)
    const organizationPeopleCount = await this.userInOrganizationProvider.getOrganizationsPeopleCountWithoutBot(userOwnedOrganizationIds)
    const isUserOwnerInNotEmptyOrganization = some(organizationPeopleCount, (count: number) =>  count > 1)
    if (isUserOwnerInNotEmptyOrganization) {
      return createPermissionResult(false, PermissionDeniedReason.CANNOT_DEACTIVATE_OWNER)
    }

    return createPermissionResult(true)
  }

}
