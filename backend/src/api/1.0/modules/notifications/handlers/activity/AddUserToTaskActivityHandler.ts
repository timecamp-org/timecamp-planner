import {
  ActivityContainerTaskDbRow,
  ActivityDbRow,
  ActivityTargetUserDbRow,
  ActivityType,
  ContainerType,
  TargetType
} from '../../../db/schema';
import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { injectable } from 'inversify';

@injectable()
export class AddUserToTaskActivityHandler
  extends AbstractActivityNotificationHandler<ActivityTargetUserDbRow, ActivityContainerTaskDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetUserDbRow): Promise<void>
  {
    const container = await this.getActivityContainer(activity.id, activity.containerType);

    if (!await this.userHasAccessToTaskProject(target.userId, container.taskId)) {
      return;
    }

    await this.notificationFactory.createNotificationUserAssignedToTask(target.userId, container.taskId, activity)
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.targetType === TargetType.USER) && (activity.containerType === ContainerType.TASK) && (activity.type === ActivityType.ADD);
  }

}
