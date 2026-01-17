import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { inject, injectable } from "inversify";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { PermissionChainInterface } from "../permissions/interfaces/PermissionChainInterface";
import { PermissionRule } from "../permissions/PermissionRule";
import { CheckPermissionResult, PermissionContext, PermissionDeniedReason, PermissionType } from "../permissions/types";
import { createPermissionResult } from "../permissions/helpers";
import { OrganizationsModule } from "../organizations/OrganizationsModule";
import { UserInOrganizationProviderInterface } from "../organizations/interfaces/UserInOrganizationProviderInterface";
import { ProjectPersonalStructureModule } from "./ProjectPersonalStructureModule";
import { PersonalProjectGroupProviderInterface } from "./interfaces/PersonalProjectGroupProviderInterface";
import { ProjectsModule } from "../projects/ProjectsModule";
import { ProjectProviderInterface } from "../projects/interfaces/ProjectProviderInterface";
import { ProjectType } from "../db/schema";
import { ProjectPersonalContainerType } from "./types";

@injectable()
export class ProjectPersonalStructurePermissions implements EntityPermissionInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ProjectPersonalStructureModule.PersonalProjectGroupProviderInterface)
    private personalProjectGroupProvider: PersonalProjectGroupProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
  ) { }

  registerChainableRules(): void {
    this.logger.debug('Registering personal project order permission rules...')
    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.GET_PERSONAL_PROJECT_STRUCTURE,
        this.hasAccessToPersonalProjectStructure.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_PERSONAL_PROJECT_STRUCTURE,
        this.canUpdatePersonalProjectStructure.bind(this)
      ),
      new PermissionRule(
        PermissionType.CREATE_PROJECT_GROUP,
        this.canCreateGroup.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_PROJECT_GROUP,
        this.canUpdateGroup.bind(this)
      ),
    ])
  }

  async hasAccessToPersonalProjectStructure(context: PermissionContext): Promise<CheckPermissionResult> {
    const {
      currentUserId, organizationId,
    } = context

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, organizationId)
    if (!userInOrganization) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
    }

    return createPermissionResult(true)
  }

  async canUpdatePersonalProjectStructure(context: PermissionContext): Promise<CheckPermissionResult> {
    const {
      currentUserId, organizationId, containerId, projectId, containerType,
    } = context

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, organizationId)
    if (!userInOrganization) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
    }

    if (containerId && containerType === ProjectPersonalContainerType.GROUP) {
      const projectsGroup = await this.personalProjectGroupProvider.getPersonalProjectGroup(containerId)
      if (!projectsGroup) {
        return createPermissionResult(false, PermissionDeniedReason.RESOURCE_NOT_FOUND)
      }

      if (projectsGroup.userInOrganizationId !== userInOrganization.id) {
        return createPermissionResult(false, PermissionDeniedReason.USER_NOT_PROJECT_GROUP_OWNER)
      }
    }

    const projectEntity = await this.projectProvider.getProject(projectId)
    if (projectEntity.projectType !== ProjectType.PROJECT) {
      createPermissionResult(false, PermissionDeniedReason.PROJECT_MUST_BE_SPACE)
    }

    return createPermissionResult(true)
  }

  async canUpdateGroup(context: PermissionContext): Promise<CheckPermissionResult> {
    const {
      currentUserId, groupId
    } = context

    const projectGroupEntity = await this.personalProjectGroupProvider.getPersonalProjectGroup(groupId)

    if (!projectGroupEntity) {
      return createPermissionResult(false, PermissionDeniedReason.RESOURCE_NOT_FOUND)
    }

    const { userInOrganizationId } = projectGroupEntity

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId)

    if (userInOrganization.userId !== currentUserId) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_PROJECT_GROUP_OWNER)
    }

    return createPermissionResult(true)
  }

  async canCreateGroup(context: PermissionContext): Promise<CheckPermissionResult> {
    const {
      currentUserId, userInOrganizationId,
    } = context

    const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId)

    if (!userInOrganization) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
    }

    if (userInOrganization.userId !== currentUserId) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_PROJECT_GROUP_OWNER)
    }

    return createPermissionResult(true)
  }
}