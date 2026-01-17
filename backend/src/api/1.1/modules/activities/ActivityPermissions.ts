import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason } from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { ContainerType } from '../db/schema';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TasksModule } from '../tasks/TasksModule';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { ListsModule } from '../lists/ListsModule';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { createPermissionResult } from '../permissions/helpers';

@injectable()
export class ActivityPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface;
  private projectService: ProjectServiceInterface;
  private taskProvider: TaskProviderInterface
  private permissionChain: PermissionChainInterface;
  private listProvider: ListProviderInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
      permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
      projectService: ProjectServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
      taskProvider: TaskProviderInterface,
    @inject(ListsModule.ListProviderInterface)
      listProvider: ListProviderInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.projectService = projectService
    this.taskProvider = taskProvider
    this.listProvider = listProvider
  }

  public registerChainableRules() {
    this.logger.debug('Registering activity permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.VIEW_ACTIVITIES,
        this.canViewActivity.bind(this)
      ),
    ])
  }

  async canViewActivity(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, containerId, containerType } = context
    let isPermitted = false

    switch (containerType) {
      case ContainerType.PROJECT: {
        isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, containerId)
        break;
      }
      case ContainerType.TASK_LIST: {
        const list = await this.listProvider.getList(containerId)
        isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, list.projectId)
        break;
      }
      case ContainerType.TASK: {
        const task = await this.taskProvider.getTaskById(containerId)
        isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, task.projectId)
        break;
      }
      default: {
        break;
      }
    }

    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT)
  }

}
