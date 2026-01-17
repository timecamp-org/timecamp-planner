import { inject, injectable } from 'inversify'
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface'
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { PermissionsModule } from '../permissions/PermissionsModule'
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface'
import { PermissionRule } from '../permissions/PermissionRule'
import {
  CheckPermissionResult,
  CheckPermissionStatus,
  PermissionContext,
  PermissionDeniedReason,
  PermissionType,
} from '../permissions/types'
import { ProjectsModule } from '../projects/ProjectsModule'
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface'
import { TasksModule } from '../tasks/TasksModule'
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface'
import { ChecklistModule } from './ChecklistModule'
import { createPermissionResult } from '../permissions/helpers'
import { ChecklistItemProviderInterface } from './ChecklistItemProviderInterface'

@injectable()
export class ChecklistPermissions implements EntityPermissionInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
      private permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
      private projectService: ProjectServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
      private taskProvider: TaskProviderInterface,
    @inject(ChecklistModule.ChecklistItemProviderInterface)
      private checklistItemProvider: ChecklistItemProviderInterface,
  ) {}

  public registerChainableRules(): void {
    this.logger.debug('Registering checklist permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.UPDATE_CHECKLIST_ITEM,
        this.canUpdateChecklistItem.bind(this)
      ),
      new PermissionRule(
        PermissionType.UPDATE_CHECKLIST_ITEM_ASSIGNEES,
        this.canUpdateChecklistItemAssignees.bind(this)
      )
    ])
  }

  async canUpdateChecklistItem(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, checklistItemId } = context

    const checklistItemData = await this.checklistItemProvider.getChecklistItem(checklistItemId)
    if (!checklistItemData) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }

    const task = await this.taskProvider.getTaskById(checklistItemData.taskId)
    if (!task) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }

    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, task.projectId)

    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT)
  }

  async canUpdateChecklistItemAssignees(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, checklistItemId } = context

    const checklistItemData = await this.checklistItemProvider.getChecklistItem(checklistItemId)
    if (!checklistItemData) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }

    const task = await this.taskProvider.getTaskById(checklistItemData.taskId)
    if (!task) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }

    const hasAccessToProjectPromise = this.projectService.hasUserAccessToProject(currentUserId, task.projectId)
    const projectPromise = this.projectService.getProject(task.projectId)

    const [
      hasAccessToProject,
      project
    ] = await Promise.all([hasAccessToProjectPromise, projectPromise])

    if (!project) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }

    if (!hasAccessToProject) {
      return createPermissionResult(hasAccessToProject, PermissionDeniedReason.USER_NOT_IN_PROJECT)
    } else {
      return {
        status: CheckPermissionStatus.OK,
      }
    }
  }

}