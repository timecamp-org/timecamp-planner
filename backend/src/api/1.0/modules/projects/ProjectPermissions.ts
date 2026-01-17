import {
  PermissionContext,
  CheckPermissionResult,
  PermissionType,
  PermissionDeniedReason,
  CheckPermissionStatus,
} from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { ProjectsModule } from './ProjectsModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { UserInProjectProviderInterface } from './interfaces/UserInProjectProviderInterface';
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { ProjectServiceInterface } from './interfaces/ProjectServiceInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { UserInOrganizationService } from '../organizations/UserInOrganizationService';
import { createPermissionResult, createPermissionResultConditional, getPermissionStatus } from '../permissions/helpers';
import { OrganizationRole, ProjectType } from '../db/schema';
import { ConversationServiceInterface } from './interfaces/ConversationServiceInterface';
import { CommonModule } from '../common/CommonModule';
import { Id, IdGeneratorInterface } from '../common/identifier';

@injectable()
export class ProjectPermissions implements EntityPermissionInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationServiceInterface)
    private userInOrganizationService: UserInOrganizationService,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) {}

  public registerChainableRules() {
    this.logger.debug('Registering project permission rules...');

    this.permissionChain.registerPermissionRules([
      new PermissionRule(PermissionType.CREATE_PROJECT, this.canCreateProject.bind(this)),
      new PermissionRule(PermissionType.VIEW_PROJECT, this.canViewProject.bind(this)),
      new PermissionRule(PermissionType.VIEW_CONVERSATION_DATA, this.canViewConversationData.bind(this)),
      new PermissionRule(PermissionType.UPDATE_PROJECT_PEOPLE, this.canUpdateProjectPeople.bind(this)),
      new PermissionRule(PermissionType.DELETE_PROJECT_PEOPLE, this.canDeleteProjectPeople.bind(this)),
    ]);
  }

  async canViewProject(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, projectId } = context;
    if (!this.idGenerator.isValid(projectId)) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }
    const project = await this.projectProvider.getProject(projectId);
    if (!project) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }
    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, projectId, project);
    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT);
  }

  async canCreateProject(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, organizationId, projectType } = context;
    const userInOrganization = await this.userInOrganizationService.getUserInOrganization(
      currentUserId,
      organizationId
    );

    return createPermissionResultConditional([
      {
        status: getPermissionStatus(!!userInOrganization),
        reason: PermissionDeniedReason.USER_NOT_IN_ORGANIZATION,
      },
      {
        status: getPermissionStatus(
          !!userInOrganization &&
            (userInOrganization.role !== OrganizationRole.GUEST || projectType !== ProjectType.PROJECT)
        ),
        reason: PermissionDeniedReason.INSUFFICIENT_ROLE_PRIVILEGES,
      },
    ]);
  }

  async canViewConversationData(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, userId, organizationId } = context;
    const conversationPeople = [currentUserId];
    if (currentUserId !== userId) {
      conversationPeople.push(userId);
    }
    const conversationProject = await this.conversationService.getConversation(organizationId, conversationPeople);

    return createPermissionResult(!!conversationProject, PermissionDeniedReason.CONVERSATION_DOESNT_EXIST);
  }

  async canUpdateProjectPeople(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, projectId, userId } = context;
    const project = await this.projectProvider.getProject(projectId);
    const userInOrganization = await this.userInOrganizationService.getUserInOrganization(
      currentUserId,
      project.organizationId
    );
    const userIsInOrganization = await this.userInOrganizationService.checkIfUserIsInOrganization(
      project.organizationId,
      currentUserId
    );
    const { userIsOrganizationAdmin } = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(
      currentUserId,
      project.organizationId
    );

    if (!userIsInOrganization) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION);
    }
    let isPermitted = false;

    const userInProject = await this.userInProjectProvider.getUserInProject(currentUserId, projectId);
    const isModifyingSelf = userId === currentUserId;
    const isGuest = userInOrganization.role === OrganizationRole.GUEST;

    if (isModifyingSelf) {
      isPermitted = !isGuest && !project.isPrivate;
    } else {
      isPermitted = !isGuest && (!!userInProject || userIsOrganizationAdmin);
    }

    return createPermissionResult(isPermitted, PermissionDeniedReason.INSUFFICIENT_ROLE_PRIVILEGES);
  }

  async canDeleteProjectPeople(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, projectId, userId } = context;
    const project = await this.projectProvider.getProject(projectId);
    const userIsInOrganization = await this.userInOrganizationService.checkIfUserIsInOrganization(
      project.organizationId,
      currentUserId
    );
    if (!userIsInOrganization) {
      return createPermissionResult(false, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION);
    }

    const isProjectManagerOrOwner = await this.userInProjectProvider.checkIfUserIsProjectManagerOrOwner(
      currentUserId,
      projectId
    );
    const { userIsOrganizationAdmin } = await this.userInOrganizationService.checkIfUserIsOrganizationAdmin(
      currentUserId,
      project.organizationId
    );
    const isDeletingSelf = userId === currentUserId;

    const isPermitted = isProjectManagerOrOwner || userIsOrganizationAdmin || isDeletingSelf;
    return createPermissionResult(isPermitted, PermissionDeniedReason.INSUFFICIENT_ROLE_PRIVILEGES);
  }
}
