import {
  ActivityContainerChecklistItemDbRow,
  ActivityDbRow,
  ActivityTargetUserDbRow,
  ActivityType,
  ContainerType,
  TargetType,
} from '../../../db/schema'
import { AbstractActivityNotificationHandler } from './AbstractActivityNotificationHandler';
import { injectable } from 'inversify';

@injectable()
export class AddUserToChecklistItemActivityHandler
  extends AbstractActivityNotificationHandler<ActivityTargetUserDbRow, ActivityContainerChecklistItemDbRow>
{
  public async handle(activity: ActivityDbRow, target: ActivityTargetUserDbRow): Promise<void>
  {
    const container = await this.getActivityContainer(activity.id, activity.containerType);

    if (!await this.userHasAccessToChecklistItemProject(target.userId, container.checklistItemId)) {
      return;
    }

    await this.notificationFactory.createNotificationUserAssignedToChecklistItem(target.userId, container.checklistItemId, activity)
  }

  public async supports(activity: ActivityDbRow): Promise<boolean>
  {
    return (activity.targetType === TargetType.USER) && (activity.containerType === ContainerType.CHECKLIST_ITEM) && (activity.type === ActivityType.ADD);
  }

}
