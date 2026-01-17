import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { ActivityDbRow, ActivityTargetTaskDbRow, ActivityType, TargetType } from '../../../db/schema';
import { without } from 'lodash';

export class CreateTaskNotificationHandler
  extends AbstractActivityNotificationHandler<ActivityTargetTaskDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetTaskDbRow): Promise<void>
  {
    let followers = await this.followerService.getFollowersForTask(target.taskId);
    followers = without(followers, activity.actorId);

    await this.notificationFactory.createNotificationTaskCreated(target.taskId, activity, followers);
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.type === ActivityType.CREATE) && (activity.targetType === TargetType.TASK);
  }

}
