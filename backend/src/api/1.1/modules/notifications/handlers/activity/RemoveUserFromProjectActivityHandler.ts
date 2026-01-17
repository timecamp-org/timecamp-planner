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
export class RemoveUserFromProjectActivityHandler
  extends AbstractActivityNotificationHandler<ActivityTargetUserDbRow, ActivityContainerProjectDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetUserDbRow): Promise<void>
  {
    const container = await this.getActivityContainer(activity.id, activity.containerType);

    if (!await this.userHasAccessToProject(target.userId, container.projectId)) {
      return;
    }

    await this.notificationFactory.createNotificationUserRemovedFromProject(target.userId, container.projectId, activity)
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.targetType === TargetType.USER) && (activity.containerType === ContainerType.PROJECT) && (activity.type === ActivityType.REMOVE);
  }
}
