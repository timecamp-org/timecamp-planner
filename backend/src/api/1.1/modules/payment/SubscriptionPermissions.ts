import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason } from "../permissions/types";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { inject, injectable } from "inversify";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PermissionChainInterface } from "../permissions/interfaces/PermissionChainInterface";
import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { PermissionRule } from "../permissions/PermissionRule";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { UserInOrganizationServiceInterface } from "../organizations/interfaces/UserInOrganizationServiceInterface";
import { createPermissionResult } from "../permissions/helpers";

@injectable()
export class SubscriptionPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface;
  private permissionChain: PermissionChainInterface;
  private userInOrganizationService: UserInOrganizationServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    userInOrganizationService: UserInOrganizationServiceInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.userInOrganizationService = userInOrganizationService
  }

  public registerChainableRules() {
    this.logger.debug('Registering subscription permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.CREATE_PAYMENT,
        this.canCreatePayment.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_SUBSCRIPTION,
        this.canCreatePayment.bind(this)
      ),
    ])
  }

  async canCreatePayment(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId } = context
    
    const { userIsOrganizationAdmin } = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId)
    return createPermissionResult(userIsOrganizationAdmin, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
  }
}
