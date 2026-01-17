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
import { MessageContainerType } from '../db/schema';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TasksModule } from '../tasks/TasksModule';
import { Id } from '../common/identifier';
import { MessagesModule } from './MessagesModule';
import { MessageServiceInterface } from './interfaces/MessageServiceInterface';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { createPermissionResult } from '../permissions/helpers';

@injectable()
export class MessagePermissions implements EntityPermissionInterface {
  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(PermissionsModule.PermissionChainInterface)
    private permissionChain: PermissionChainInterface,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(MessagesModule.MessageServiceInterface)
    private messageService: MessageServiceInterface
  ) {}

  public registerChainableRules() {
    this.logger.debug('Registering message permission rules...');

    this.permissionChain.registerPermissionRules([
      new PermissionRule(PermissionType.CREATE_MESSAGE, this.canCreateMessage.bind(this)),
      new PermissionRule(PermissionType.UPDATE_MESSAGE, this.canUpdateMessage.bind(this)),
      new PermissionRule(PermissionType.VIEW_MESSAGES, this.canViewMessages.bind(this)),
      new PermissionRule(PermissionType.CREATE_REACTION, this.canCreateReaction.bind(this)),
      new PermissionRule(PermissionType.UPDATE_REACTION, this.canUpdateReaction.bind(this)),
    ]);
  }

  async canCreateMessage(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, containerId, containerType } = context;
    return await this.checkContainerPermission(currentUserId, containerType as MessageContainerType, containerId);
  }

  async canUpdateMessage(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, messageId } = context;
    const message = await this.messageService.getMessage(messageId);

    if (!message) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }

    const containerPermission = await this.checkContainerPermission(
      currentUserId,
      message.containerType,
      message.containerId
    );

    if (containerPermission.status !== CheckPermissionStatus.OK) {
      return containerPermission;
    }

    return createPermissionResult(currentUserId === message.senderId, PermissionDeniedReason.USER_NOT_MESSAGE_OWNER);
  }

  async canCreateReaction(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, messageId } = context;
    const message = await this.messageService.getMessage(messageId);

    if (!message) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }

    return await this.checkContainerPermission(currentUserId, message.containerType, message.containerId);
  }

  async canUpdateReaction(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, reactionId } = context;
    const reaction = await this.messageService.getReaction(reactionId);

    if (!reaction) {
      return {
        status: CheckPermissionStatus.RESOURCE_NOT_FOUND,
      };
    }

    return createPermissionResult(currentUserId === reaction.userId, PermissionDeniedReason.USER_NOT_REACTION_OWNER);
  }

  async canViewMessages(context: PermissionContext): Promise<CheckPermissionResult> {
    const { currentUserId, containerId, containerType } = context;
    return await this.checkContainerPermission(currentUserId, containerType as MessageContainerType, containerId);
  }

  private async checkContainerPermission(
    userId: Id,
    containerType: MessageContainerType,
    containerId: Id
  ): Promise<CheckPermissionResult> {
    switch (containerType) {
      case MessageContainerType.PROJECT: {
        const isPermitted = await this.projectService.hasUserAccessToProject(userId, containerId);
        return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT);
      }
      case MessageContainerType.TASK: {
        const task = await this.taskProvider.getTaskById(containerId);
        const isPermitted = await this.projectService.hasUserAccessToProject(userId, task.projectId);
        return createPermissionResult(isPermitted, PermissionDeniedReason.USER_NOT_IN_PROJECT);
      }
      default: {
        return {
          status: CheckPermissionStatus.OK,
        };
      }
    }
  }
}
