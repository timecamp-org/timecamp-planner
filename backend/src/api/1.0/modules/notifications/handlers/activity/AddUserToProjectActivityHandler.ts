import {
  ActivityContainerProjectDbRow,
  ActivityDbRow,
  ActivityTargetUserDbRow,
  ActivityType,
  ContainerType,
  TargetType
} from '../../../db/schema';
import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { injectable } from 'inversify';

@injectable()
export class AddUserToProjectActivityHandler
  extends AbstractActivityNotificationHandler<ActivityTargetUserDbRow, ActivityContainerProjectDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetUserDbRow): Promise<void>
  {
    const container = await this.getActivityContainer(activity.id, activity.containerType);

    // We do not check if user has access to project in case of ADDing to project.

    await this.notificationFactory.createNotificationUserInvitedToProject(target.userId, container.projectId, activity)
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.targetType === TargetType.USER) && (activity.containerType === ContainerType.PROJECT) && (activity.type === ActivityType.ADD);
  }

}
