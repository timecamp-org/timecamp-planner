import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason } from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { OrganizationsModule } from './OrganizationsModule';
import { UserInOrganizationProviderInterface } from './interfaces/UserInOrganizationProviderInterface';
import { OrganizationRole } from '../db/schema';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { existingProjectsUserAssignedToModifier } from '../projects/queryDecorators';
import { UserInOrganizationServiceInterface } from './interfaces/UserInOrganizationServiceInterface';
import { EntityStatus } from '../common/enum';
import { createPermissionResult } from '../permissions/helpers';

@injectable()
export class OrganizationPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface
  private userInOrganizationProvider: UserInOrganizationProviderInterface;
  private userInOrganizationService: UserInOrganizationServiceInterface;
  private permissionChain: PermissionChainInterface;
  private projectService: ProjectServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
      permissionChain: PermissionChainInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
      userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
      userInOrganizationService: UserInOrganizationServiceInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
      projectService: ProjectServiceInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.userInOrganizationProvider = userInOrganizationProvider
    this.userInOrganizationService = userInOrganizationService
    this.projectService = projectService
  }

  public registerChainableRules() {
    this.logger.debug('Registering organization permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.VIEW_ORGANIZATION,
        this.canViewOrganization.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_ORGANIZATION,
        this.canUpdateOrganization.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_ORGANIZATION_ROLE,
        this.canUpdateOrganizationRole.bind(this)
      ),
      new PermissionRule(
        PermissionType.DEACTIVATE_USER_FROM_ORGANIZATION,
        this.canDeactivateUserFromOrganization.bind(this)
      ),
      new PermissionRule(
        PermissionType.REACTIVATE_USER_FROM_ORGANIZATION,
        this.canReactivateUserFromOrganization.bind(this)
      ),
      new PermissionRule(
        PermissionType.DELETE_GUEST_FROM_ALL_SPACES,
        this.canDeleteGuestFromAllSpaces.bind(this)
      ),
    ])
  }

  async canViewOrganization(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId } = context
    const userIsInOrganization = await this.userInOrganizationProvider.checkIfUserIsInOrganization(organizationId, currentUserId)
    return createPermissionResult(!!userIsInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION)
  }

  async canUpdateOrganization(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId, status } = context

    const [
      { userIsOrganizationAdmin },
      { userIsOrganizationOwner }
    ] = await Promise.all([
      this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationOwner(currentUserId, organizationId),
    ])

    switch (status) {
      case EntityStatus.ARCHIVED: {
        return createPermissionResult(userIsOrganizationOwner, PermissionDeniedReason.USER_NOT_ORGANIZATION_OWNER)
      }

      case EntityStatus.EXISTS: {
        return createPermissionResult(userIsOrganizationOwner, PermissionDeniedReason.USER_NOT_ORGANIZATION_OWNER)
      }

      default: {
        return createPermissionResult(userIsOrganizationAdmin, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
      }
    }
  }

  async canUpdateOrganizationRole(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId, role, userId } = context

    const [
      { userIsOrganizationAdmin },
      { userIsOrganizationOwner }
    ] = await Promise.all([
      this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationOwner(currentUserId, organizationId),
    ])

    switch (role) {
      case OrganizationRole.ADMIN:
      case OrganizationRole.OWNER: {
        return createPermissionResult(userIsOrganizationOwner, PermissionDeniedReason.USER_NOT_ORGANIZATION_OWNER)
      }
      case OrganizationRole.MEMBER: {
        const previousUserInOrganization = await this.userInOrganizationProvider.getUserInOrganization(userId, organizationId)
        if (previousUserInOrganization.role === OrganizationRole.GUEST) {
          return createPermissionResult(userIsOrganizationAdmin, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
        }
        return createPermissionResult(userIsOrganizationAdmin, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
        break
      }
      case OrganizationRole.GUEST: {
        if (!userIsOrganizationAdmin) {
          return createPermissionResult(false, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
        }
        const { projects: userAssignedProjects } = await this.projectService.getUserProjects(
          organizationId,
          userId,
          existingProjectsUserAssignedToModifier(userId),
          false
        )

        if (userAssignedProjects.length === 0) {
          return createPermissionResult(false, PermissionDeniedReason.NOT_ENOUGH_ASSIGNED_PROJECTS)
        }
        return createPermissionResult(true)
      }
    }
  }

  async canDeactivateUserFromOrganization(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId, userId } = context
    const [
      userInOrganization,
      { userIsOrganizationAdmin },
      { userIsOrganizationOwner }
    ] = await Promise.all([
      this.userInOrganizationProvider.getUserInOrganization(userId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationOwner(currentUserId, organizationId),
    ])
    const isDeactivatingSelf = currentUserId === userId

    switch (userInOrganization.role) {
      case OrganizationRole.OWNER:
        return createPermissionResult(false, PermissionDeniedReason.CANNOT_DEACTIVATE_OWNER)
      case OrganizationRole.ADMIN: {
        return createPermissionResult(userIsOrganizationOwner || isDeactivatingSelf, PermissionDeniedReason.USER_NOT_ORGANIZATION_OWNER)
      }
      case OrganizationRole.GUEST:
      case OrganizationRole.MEMBER: {
        return createPermissionResult(userIsOrganizationAdmin || isDeactivatingSelf, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
      }
    }
  }

  async canDeleteGuestFromAllSpaces(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId, userId } = context
    
    const [
      { userIsOrganizationAdmin },
      { userIsOrganizationMember }
    ] = await Promise.all([
      this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationMember(currentUserId, organizationId),
    ])
    
    const isDeactivatingSelf = currentUserId === userId

    return createPermissionResult(
      userIsOrganizationMember || userIsOrganizationAdmin || isDeactivatingSelf,
      PermissionDeniedReason.INSUFFICIENT_ROLE_PRIVILEGES
    )
  }

  async canReactivateUserFromOrganization(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId, userId } = context
    const [
      userInOrganization,
      { userIsOrganizationAdmin },
      { userIsOrganizationOwner }
    ] = await Promise.all([
      this.userInOrganizationProvider.getUserInOrganization(userId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationAdmin(currentUserId, organizationId),
      this.userInOrganizationService.checkIfUserIsOrganizationOwner(currentUserId, organizationId),
    ])

    switch (userInOrganization.role) {
      case OrganizationRole.OWNER:
        return createPermissionResult(false, PermissionDeniedReason.CANNOT_DEACTIVATE_OWNER)
      case OrganizationRole.ADMIN: {
        return createPermissionResult(userIsOrganizationOwner, PermissionDeniedReason.USER_NOT_ORGANIZATION_OWNER)
      }
      case OrganizationRole.GUEST: {
        return createPermissionResult(userIsOrganizationAdmin, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
      }
      case OrganizationRole.MEMBER: {
        return createPermissionResult(userIsOrganizationAdmin, PermissionDeniedReason.USER_NOT_ORGANIZATION_ADMIN)
      }
    }
  }

}
