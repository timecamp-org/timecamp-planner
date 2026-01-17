import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason, CheckPermissionStatus } from "../permissions/types";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { inject, injectable } from "inversify";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { PermissionChainInterface } from "../permissions/interfaces/PermissionChainInterface";
import { EntityPermissionInterface } from "../permissions/interfaces/EntityPermissionInterface";
import { PermissionsModule } from "../permissions/PermissionsModule";
import { PermissionRule } from "../permissions/PermissionRule";
import { TaskProviderInterface } from "./interfaces/TaskProviderInterface";
import { TasksModule } from "./TasksModule";
import { ProjectsModule } from "../projects/ProjectsModule";
import { ProjectServiceInterface } from "../projects/interfaces/ProjectServiceInterface";
import { createPermissionResult } from "../permissions/helpers";

@injectable()
export class TaskPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface;
  private projectService: ProjectServiceInterface;
  private taskProvider: TaskProviderInterface
  private permissionChain: PermissionChainInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    projectService: ProjectServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
    taskProvider: TaskProviderInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.projectService = projectService
    this.taskProvider = taskProvider
  }

  public registerChainableRules() {
    this.logger.debug('Registering task permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.VIEW_TASK,
        this.canViewTask.bind(this)
      ),
      new PermissionRule(
        PermissionType.CREATE_TASK,
        this.canCreateTask.bind(this)
      ),
    ])
  }

  async canViewTask(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, taskId, sourceTaskId } = context

    let finalTaskId = taskId || sourceTaskId
    const task = await this.taskProvider.getTaskById(finalTaskId)
    if (!task) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      }
    }
    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, task.projectId)
    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT)
  }

  async canCreateTask(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, projectId } = context

    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, projectId)
    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT)
  }

}
