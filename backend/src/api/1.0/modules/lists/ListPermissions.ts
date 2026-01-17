import { PermissionContext, CheckPermissionResult, PermissionType, PermissionDeniedReason, CheckPermissionStatus } from '../permissions/types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { PermissionChainInterface } from '../permissions/interfaces/PermissionChainInterface';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { PermissionRule } from '../permissions/PermissionRule';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ListsModule } from './ListsModule';
import { ListProviderInterface } from './interfaces/ListProviderInterface';
import { createPermissionResult } from '../permissions/helpers';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';

@injectable()
export class ListPermissions implements EntityPermissionInterface {
  private logger: LoggerInterface;
  private projectService: ProjectServiceInterface;
  private listProvider: ListProviderInterface
  private permissionChain: PermissionChainInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
      permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
      projectService: ProjectServiceInterface,
    @inject(ListsModule.ListProviderInterface)
      listProvider: ListProviderInterface,
  ) {
    this.logger = logger
    this.permissionChain = permissionChain
    this.projectService = projectService
    this.listProvider = listProvider
  }

  public registerChainableRules() {
    this.logger.debug('Registering list permission rules...')

    this.permissionChain.registerPermissionRules([
      new PermissionRule(
        PermissionType.VIEW_LIST,
        this.canViewList.bind(this)
      ),
      new PermissionRule(
        PermissionType.CREATE_LIST,
        this.canCreateList.bind(this)
      ),
    ])
  }

  async canViewList(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, listId, sourceListId } = context

    const finalListId = listId || sourceListId
    const taskList = await this.listProvider.getList(finalListId)
    if (!taskList) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND
      }
    }
    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, taskList.projectId)
    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT)
  }

  async canCreateList(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, projectId } = context

    const isPermitted = await this.projectService.hasUserAccessToProject(currentUserId, projectId)
    return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT)
  }

}
