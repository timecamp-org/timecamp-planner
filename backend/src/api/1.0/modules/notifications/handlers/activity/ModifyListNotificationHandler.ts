import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { ActivityDbRow, ActivityTargetTaskListDbRow, ActivityType, TargetType } from '../../../db/schema';
import { without } from 'lodash';

export class ModifyListNotificationHandler
  extends AbstractActivityNotificationHandler<ActivityTargetTaskListDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetTaskListDbRow): Promise<void>
  {
    let followers = await this.followerService.getFollowersForList(target.taskListId);
    followers = without(followers, activity.actorId);

    const listenedProps = ['isArchived', 'order'];
    const changedProps = await this.activityProvider.getActivityChangedProps(activity.id);
    const shouldCreateNotification = this.checkIfListenedPropsChanged(changedProps, listenedProps);

    if (!shouldCreateNotification) {
      return ;
    }
    await this.notificationFactory.createNotificationTaskListUpdated(target.taskListId, activity, followers);
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.type === ActivityType.MODIFY) && (activity.targetType === TargetType.TASK_LIST);
  }
}
