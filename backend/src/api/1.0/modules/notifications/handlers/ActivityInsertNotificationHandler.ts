import { AbstractNotificationHandler } from './AbstractNotificationHandler';
import { inject, multiInject, injectable } from 'inversify';
import { NotificationsModule } from '../NotificationsModule';
import { NotificationFactoryInterface } from '../interfaces/NotificationFactoryInterface';
import Table from '../../db/Table';
import { NotificationAction, NotificationPayload } from '../../db/types';
import { ActivitiesModule } from '../../activities/ActivitiesModule';
import { ActivityProviderInterface } from '../../activities/interfaces/ActivityProviderInterface';
import { ActivityNotificationHandlerInterface } from '../interfaces/ActivityNotificationHandlerInterface';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';

@injectable()
export class ActivityInsertNotificationHandler
  extends AbstractNotificationHandler
{
  constructor(
    @inject(InfrastructureModule.LoggerInterface) protected logger: LoggerInterface,
    @inject(NotificationsModule.NotificationFactoryInterface) notificationFactory: NotificationFactoryInterface,
    @inject(ActivitiesModule.ActivityProviderInterface) protected activityProvider: ActivityProviderInterface,

    @multiInject(NotificationsModule.PgActivityNotificationHandler)
    protected activityHandlers: ActivityNotificationHandlerInterface<any>[],
  ) {
    super(
      notificationFactory,
      Table.ACTIVITY,
      NotificationAction.INSERT
    );
  }

  public async handle(payload: NotificationPayload): Promise<void>
  {
    const activity = await this.activityProvider.getActivity(payload.id);
    const target = await this.activityProvider.getActivityTarget(payload.id, activity.targetType);

    this.logger.debug(`Trying registered ActivityNotification handlers for: ${activity.id} [${activity.type} ${activity.targetType}]`);
    for (const activityHandler of this.activityHandlers) {
      // TODO logs

      if (await activityHandler.supports(activity)) {
        this.logger.info(`Found ActivityNotification handler for activity ${activity.id}: ${activityHandler.constructor.name}`);
        await activityHandler.handle(activity, target);
        return;
      }
      this.logger.debug(`Skipping ${activityHandler.constructor.name} for activity ${activity.id}`);
    }
  }

  // In future supports() can be overridden to also check nested activity handlers for specific activity.

}
