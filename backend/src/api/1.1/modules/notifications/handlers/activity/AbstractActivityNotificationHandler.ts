import { ActivityNotificationHandlerInterface } from '../../interfaces/ActivityNotificationHandlerInterface';
import {
  AbstractActivityContainerDbRow,
  AbstractActivityTargetDbRow,
  ActivityChangedPropDbRow,
  ActivityDbRow,
  ContainerType
} from '../../../db/schema';
import { Id } from '../../../common/identifier';
import { ActivityProviderInterface } from '../../../activities/interfaces/ActivityProviderInterface';
import { NotificationServiceInterface } from '../../interfaces/NotificationServiceInterface';
import { NotificationFactoryInterface } from '../../interfaces/NotificationFactoryInterface';
import { TaskProviderInterface } from '../../../tasks/interfaces/TaskProviderInterface';
import { LoggerInterface } from '../../../../../../infrastructure/logger';
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../../../../infrastructure/InfrastructureModule';
import { ActivitiesModule } from '../../../activities/ActivitiesModule';
import { NotificationsModule } from '../../NotificationsModule';
import { TasksModule } from '../../../tasks/TasksModule';
import { FollowerServiceInterface } from '../../interfaces/FollowerServiceInterface';
import { ProjectsModule } from '../../../projects/ProjectsModule';
import { ProjectPeopleServiceInterface } from '../../../projects/interfaces/ProjectPeopleServiceInterface';
import { ChecklistModule } from '../../../checklist/ChecklistModule'
import { ChecklistItemProviderInterface } from '../../../checklist/ChecklistItemProviderInterface'

@injectable()
export abstract class AbstractActivityNotificationHandler<
  TTarget extends AbstractActivityTargetDbRow,
  TContainer extends AbstractActivityContainerDbRow = AbstractActivityContainerDbRow
  >
implements ActivityNotificationHandlerInterface<TTarget>
{
  constructor(
    @inject(InfrastructureModule.LoggerInterface) protected logger: LoggerInterface,
    @inject(ActivitiesModule.ActivityProviderInterface) protected activityProvider: ActivityProviderInterface,
    @inject(NotificationsModule.NotificationFactoryInterface) protected notificationFactory: NotificationFactoryInterface,
    @inject(NotificationsModule.FollowerServiceInterface) protected followerService: FollowerServiceInterface,
    @inject(NotificationsModule.NotificationServiceInterface) protected notificationService: NotificationServiceInterface,
    @inject(TasksModule.TaskProviderInterface) protected taskProvider: TaskProviderInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface) protected projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ChecklistModule.ChecklistItemProviderInterface)
    protected checklistItemProvider: ChecklistItemProviderInterface,
  ) {}

  public abstract handle(activity: ActivityDbRow, target: TTarget): PromiseLike<void>;

  public abstract supports(activity: ActivityDbRow): PromiseLike<boolean>;

  protected async getActivityContainer(id: Id, containerType: ContainerType): Promise<TContainer>
  {
    return await this.activityProvider.getActivityContainer<TContainer>(id, containerType)
  }

  protected async userHasAccessToProject(userId: Id, projectId: Id): Promise<boolean>
  {
    return await this.notificationService.getUserHasAccessToProjectNotifications(userId, projectId);
  }

  protected async userHasAccessToTaskProject(userId: Id, taskId: Id): Promise<boolean>
  {
    const task = await this.taskProvider.getTaskById(taskId);
    if (!task) {
      this.logger.warn(`Activity referring to non-existing task: ${taskId}`);
      return false;
    }
    return await this.notificationService.getUserHasAccessToProjectNotifications(userId, task.projectId);
  }

  protected async userHasAccessToChecklistItemProject(userId: Id, checklistItemId: Id): Promise<boolean> {
    const checklistItem = await this.checklistItemProvider.getChecklistItem(checklistItemId)
    if (!checklistItem) {
      this.logger.warn(`Activity referring to non-existing checklist item: ${checklistItemId}`)
      return false
    }

    return await this.userHasAccessToTaskProject(userId, checklistItem.taskId)
  }

  protected checkIfListenedPropsChanged(
    changedProps: Array<ActivityChangedPropDbRow>,
    listenedProps: Array<string>
  ): boolean {
    if (!changedProps) {
      return false
    }
    for (let i = 0; i < changedProps.length; i++) {
      const changedProp = changedProps[i]
      const propertyName = changedProp.propertyName

      if (listenedProps.indexOf(propertyName) !== -1) {
        return true
      }
    }

    return false
  }
}
