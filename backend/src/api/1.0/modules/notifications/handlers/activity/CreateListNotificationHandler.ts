import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { ActivityDbRow, ActivityTargetTaskListDbRow, ActivityType, TargetType } from '../../../db/schema';
import { without } from 'lodash';

export class CreateListNotificationHandler
  extends AbstractActivityNotificationHandler<ActivityTargetTaskListDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetTaskListDbRow): Promise<void>
  {
    let followers = await this.followerService.getFollowersForList(target.taskListId);
    followers = without(followers, activity.actorId);

    await this.notificationFactory.createNotificationTaskListCreated(target.taskListId, activity, followers)
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.type === ActivityType.CREATE) && (activity.targetType === TargetType.TASK_LIST);
  }

}
