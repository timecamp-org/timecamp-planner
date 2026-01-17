import {
  ActivityContainerTaskDbRow,
  ActivityDbRow,
  ActivityTargetFileDbRow,
  ActivityType,
  ContainerType,
  TargetType
} from '../../../db/schema';
import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { injectable } from 'inversify';
import { without } from 'lodash';

@injectable()
export class AddFileToTaskActivityHandler
  extends AbstractActivityNotificationHandler<ActivityTargetFileDbRow, ActivityContainerTaskDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetFileDbRow): Promise<void>
  {
    const container = await this.activityProvider.getActivityContainer<ActivityContainerTaskDbRow>(activity.id, activity.containerType);
    let followers = await this.followerService.getFollowersForTask(container.taskId);
    followers = without(followers, activity.actorId);

    await this.notificationFactory.createNotificationFileAttachedToTask(target.fileId, container.taskId, activity, followers)
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.targetType === TargetType.FILE)  && (activity.containerType === ContainerType.TASK) && (activity.type === ActivityType.ADD);
  }
}
