import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason } from "../permissions/types";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { inject, injectable } from "inversify";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PermissionChainInterface } from "../permissions/interfaces/PermissionChainInterface";
import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { PermissionRule } from "../permissions/PermissionRule";
import { UserInOrganizationProviderInterface } from "../organizations/interfaces/UserInOrganizationProviderInterface";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { TagsModule } from "./TagsModule";
import { TagServiceInterface } from "./TagServiceInterface";
import { createPermissionResult } from "../permissions/helpers";

@injectable()
export class TagPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface
  private userInOrganizationProvider: UserInOrganizationProviderInterface;
  private permissionChain: PermissionChainInterface;
  private tagService: TagServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(TagsModule.TagServiceInterface)
    tagService: TagServiceInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.userInOrganizationProvider = userInOrganizationProvider
    this.tagService = tagService
  }

  public registerChainableRules() {
    this.logger.debug('Registering tag permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.CREATE_TAG,
        this.canCreateTag.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_TAG,
        this.canUpdateTag.bind(this)
      ),
      new PermissionRule(
        PermissionType.VIEW_TAGS_OVERVIEW,
        this.canViewTagsOverview.bind(this)
      ),
    ])
  }

  async canCreateTag(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId } = context
    const userIsInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(organizationId, currentUserId)
    return createPermissionResult(userIsInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
  }

  async canUpdateTag(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, tagId } = context
    const tag = await this.tagService.getTag(tagId)
    const userIsInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(tag.organizationId, currentUserId)
    return createPermissionResult(userIsInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
  }

  async canViewTagsOverview(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId } = context
    const userIsInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(organizationId, currentUserId)
    return createPermissionResult(userIsInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
  }

}
