import {
  PermissionContext,
  CheckPermissionResult,
  PermissionType,
  PermissionDeniedReason,
  CheckPermissionStatus,
} from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { CustomFieldTargetType, ExtensionDbRow } from '../db/schema';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TasksModule } from '../tasks/TasksModule';
import { UserInOrganizationProviderInterface } from '../organizations/interfaces/UserInOrganizationProviderInterface';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { ListsModule } from '../lists/ListsModule';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { createPermissionResult, createPermissionResultConditional } from '../permissions/helpers';
import { ExtensionNamespace } from './types';
import { Maybe } from '../common/types';
import { ExtensionsModule } from './ExtensionsModule';
import { ExtensionServiceInterface } from './interfaces/ExtensionServiceInterface';
import { Id, IdGeneratorInterface } from '../common/identifier';
import { CommonModule } from '../common/CommonModule';

const extensionNamespaces = Object.values(ExtensionNamespace);

@injectable()
export class ExtensionPermissions implements EntityPermissionInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(OrganizationsModule.UserInOrganizationProviderInterface)
    private userInOrganizationProvider: UserInOrganizationProviderInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface)
    private extensionService: ExtensionServiceInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>
  ) {}

  public registerChainableRules() {
    this.logger.debug('Registering extension permission rules...');

    this.permissionChain.registerPermissionRules([
      new PermissionRule(PermissionType.UPDATE_CUSTOM_FIELD, this.canUpdateCustomField.bind(this)),
      new PermissionRule(PermissionType.VIEW_CUSTOM_FIELD, this.canViewCustomField.bind(this)),
      new PermissionRule(PermissionType.UPDATE_EXTENSION_RELATION, this.canUpdateExtensionRelation.bind(this)),
      new PermissionRule(PermissionType.UPDATE_EXTENSION_STATUS, this.canUpdateExtensionStatus.bind(this)),
      new PermissionRule(PermissionType.UPDATE_INTEGRATION_STATUS, this.canUpdateIntegrationStatus.bind(this)),
    ]);
  }

  private getExtensionNamespaceFromContext(context: PermissionContext): Maybe<ExtensionNamespace> {
    const namespace = Object.keys(context).find((param) => {
      const matchParam = param.split('.')[0] as ExtensionNamespace;
      return extensionNamespaces.includes(matchParam);
    });
    if (namespace) {
      return namespace.split('.')[0] as ExtensionNamespace;
    }
  }

  async canViewCustomField(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, targetType, targetId } = context;

    if (!this.idGenerator.isValid(targetId)) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }

    switch (targetType) {
      case CustomFieldTargetType.ORGANIZATION: {
        const userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, targetId);
        return createPermissionResult(!!userInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION);
      }
      case CustomFieldTargetType.USER_IN_ORGANIZATION: {
        const userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(targetId);
        return createPermissionResult(!!userInOrganization, PermissionDeniedReason.USER_NOT_IN_ORGANIZATION);
      }
      case CustomFieldTargetType.PROJECT: {
        const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, targetId);
        return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT);
      }
      case CustomFieldTargetType.TASK_LIST: {
        const list = await this.listProvider.getList(targetId);
        const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, list.projectId);
        return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT);
      }
      case CustomFieldTargetType.TASK: {
        const task = await this.taskProvider.getTaskById(targetId);
        const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, task.projectId);
        return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT);
      }
      default: {
        return {
          status: CheckPermissionStatus.OK,
        };
      }
    }
  }

  async canUpdateCustomField(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, targetType, targetId } = context;

    if (!this.idGenerator.isValid(targetId)) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }

    const extensionNamespace = this.getExtensionNamespaceFromContext(context);

    let extension: ExtensionDbRow;
    if (extensionNamespace) {
      extension = await this.extensionService.getExtensionByNamespace(extensionNamespace);
      if (!extension) {
        return {
          status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
        };
      }
    }

    switch (targetType) {
      case CustomFieldTargetType.ORGANIZATION: {
        return this.checkAccessToOrganizationExtension(currentUserId, extension.id, targetId);
      }
      case CustomFieldTargetType.USER_IN_ORGANIZATION: {
        return this.checkAccessToOrganizationExtension(currentUserId, extension.id, null, targetId);
      }
      case CustomFieldTargetType.PROJECT: {
        return this.checkAccessToProjectExtension(currentUserId, extension.id, targetId);
      }
      case CustomFieldTargetType.TASK_LIST: {
        const list = await this.listProvider.getList(targetId);
        return this.checkAccessToProjectExtension(currentUserId, extension.id, list.projectId);
      }
      case CustomFieldTargetType.TASK: {
        const task = await this.taskProvider.getTaskById(targetId);
        return this.checkAccessToProjectExtension(currentUserId, extension.id, task.projectId);
      }
      default: {
        return {
          status: CheckPermissionStatus.OK,
        };
      }
    }
  }

  async canUpdateExtensionRelation(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, taskId, projectId, taskListId, organizationId, userInOrganizationId, namespace } = context;
    const extension = await this.extensionService.getExtensionByNamespace(namespace);
    if (!extension) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }

    if (organizationId) {
      return await this.checkAccessToOrganizationExtension(currentUserId, extension.id, organizationId);
    } else if (userInOrganizationId) {
      return await this.checkAccessToOrganizationExtension(currentUserId, extension.id, null, userInOrganizationId);
    } else if (projectId) {
      return await this.checkAccessToProjectExtension(currentUserId, extension.id, projectId);
    } else if (taskListId) {
      const list = await this.listProvider.getList(taskListId);
      return await this.checkAccessToProjectExtension(currentUserId, extension.id, list.projectId);
    } else if (taskId) {
      const task = await this.taskProvider.getTaskById(taskId);
      return await this.checkAccessToProjectExtension(currentUserId, extension.id, task.projectId);
    }
  }

  private async checkAccessToProjectExtension(
    currentUserId: Id,
    extensionId: Id,
    projectId: Id
  ): Promise<CheckPermissionResult> {
    const project = await this.projectService.getProject(projectId);
    if (!project) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }
    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, project.id, project);
    return this.checkAccessToExtensionEntity(
      extensionId,
      project.organizationId,
      isPermitted,
      PermissionDeniedReason.USER_NOT_IN_PROJECT
    );
  }

  private async checkAccessToOrganizationExtension(
    currentUserId: Id,
    extensionId: Id,
    organizationId?: Id,
    userInOrganizationId?: Id
  ): Promise<CheckPermissionResult> {
    let userInOrganization;
    if (organizationId) {
      userInOrganization = await this.userInOrganizationProvider.getUserInOrganization(currentUserId, organizationId);
    } else if (userInOrganizationId) {
      userInOrganization = await this.userInOrganizationProvider.getUserInOrganizationById(userInOrganizationId);
    }

    if (!userInOrganization) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }
    const isPermitted = userInOrganization.userId === currentUserId;
    return this.checkAccessToExtensionEntity(
      extensionId,
      userInOrganization.organizationId,
      isPermitted,
      PermissionDeniedReason.USER_NOT_IN_ORGANIZATION
    );
  }

  private async checkAccessToExtensionEntity(
    extensionId: Id,
    organizationId: Id,
    isPermitted: boolean,
    deniedReason: PermissionDeniedReason
  ): Promise<CheckPermissionResult> {
    return createPermissionResultConditional([
      createPermissionResult(isPermitted, deniedReason),
    ]);
  }

  async canUpdateExtensionStatus(context: PermissionContext): Promise<CheckPermissionResult> {
    void context;
    return {
      status: CheckPermissionStatus.OK,
    };
  }

  async canUpdateIntegrationStatus(context: PermissionContext): Promise<CheckPermissionResult> {
    void context;
    return {
      status: CheckPermissionStatus.OK,
    };
  }
}
