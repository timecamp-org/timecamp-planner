import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { ActivityDbRow, ActivityTargetTaskDbRow, ActivityType, TargetType } from '../../../db/schema';
import { without } from 'lodash';

export class ModifyTaskNotificationHandler
  extends AbstractActivityNotificationHandler<ActivityTargetTaskDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetTaskDbRow): Promise<void>
  {
    const listenedProps = [
      'isArchived',
      'progress',
      'status', 'dueDate',
      'taskListId',
      'projectId'
    ];
    const changedProps = await this.activityProvider.getActivityChangedProps(activity.id);
    const shouldCreateNotification = this.checkIfListenedPropsChanged(changedProps, listenedProps);

    if (!shouldCreateNotification) {
      return;
    }

    let followers = await this.followerService.getFollowersForTask(target.taskId);
    followers = without(followers, activity.actorId);
    await this.notificationFactory.createNotificationTaskUpdated(target.taskId, activity, followers);

  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.type === ActivityType.MODIFY) && (activity.targetType === TargetType.TASK);
  }

}
