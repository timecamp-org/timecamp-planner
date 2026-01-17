import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { ActivityDbRow, ActivityTargetProjectDbRow, ActivityType, TargetType } from '../../../db/schema';

export class ModifyProjectNotificationHandler
  extends AbstractActivityNotificationHandler<ActivityTargetProjectDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetProjectDbRow): Promise<void>
  {
    const listenedProps = ['isPrivate', 'status'];
    const changedProps = await this.activityProvider.getActivityChangedProps(activity.id);
    const shouldCreateNotification = this.checkIfListenedPropsChanged(changedProps, listenedProps);

    if (!shouldCreateNotification) {
      return;
    }

    const projectPeople = await this.projectPeopleService.getProjectPeople(target.projectId);
    const recipientIds = projectPeople
      .map(row => row.userId)
      .filter(userId => userId !== activity.actorId)
    ;
    const recipientIdsWithAccessToProject =
    await this.notificationService.filterUsersWithoutAccessToProjectNotifications(recipientIds, target.projectId);
    await this.notificationFactory.createNotificationProjectUpdated(
      target.projectId,
      activity,
      recipientIdsWithAccessToProject
    );
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.targetType === TargetType.PROJECT) && (activity.type === ActivityType.MODIFY);
  }

}
