import { Notification } from 'pg';

import PostgresListenerPlugin from '../../../../infrastructure/PostgresListenerPlugin';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { NotificationPayload } from '../db/types';

import { NEW_NOTIFICATION } from '../../../../infrastructure/types';
import { inject, injectable, multiInject } from 'inversify';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { NotificationsModule } from './NotificationsModule';
import { ProjectServiceInterface } from '../projects/interfaces/ProjectServiceInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { FollowerServiceInterface } from './interfaces/FollowerServiceInterface';
import { NotificationFactoryInterface } from './interfaces/NotificationFactoryInterface';
import { ActivityProviderInterface } from '../activities/interfaces/ActivityProviderInterface';
import { ProjectPeopleServiceInterface } from '../projects/interfaces/ProjectPeopleServiceInterface';
import { NotificationServiceInterface } from './interfaces/NotificationServiceInterface';
import { MessagesModule } from '../messages/MessagesModule';
import { MessageServiceInterface } from '../messages/interfaces/MessageServiceInterface';
import { FilesModule } from '../files/FilesModule';
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface';
import { PgNotificationHandlerInterface } from './interfaces/PgNotificationHandlerInterface';
import { CommonModule } from '../common/CommonModule';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';
import { AbstractFeedServicePlugin } from '../feed/AbstractFeedServicePlugin';

@injectable()
class NotificationListenerPlugin
  extends AbstractFeedServicePlugin {
  protected logger: LoggerInterface
  protected postgresListener: PostgresListenerPlugin
  protected notificationFactory: NotificationFactoryInterface
  protected projectService: ProjectServiceInterface
  protected followerService: FollowerServiceInterface
  protected activityProvider: ActivityProviderInterface
  protected projectPeopleService: ProjectPeopleServiceInterface;
  protected notificationService: NotificationServiceInterface;
  protected messageService: MessageServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ActivitiesModule.ActivityProviderInterface) activityProvider: ActivityProviderInterface,
    @inject(NotificationsModule.NotificationFactoryInterface) notificationFactory: NotificationFactoryInterface,
    @inject(ProjectsModule.ProjectServiceInterface) projectService: ProjectServiceInterface,
    @inject(InfrastructureModule.PostgresListener) postgresListener: PostgresListenerPlugin,
    @inject(NotificationsModule.FollowerServiceInterface) followerService: FollowerServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface) projectPeopleService: ProjectPeopleServiceInterface,
    @inject(NotificationsModule.NotificationServiceInterface) notificationService: NotificationServiceInterface,
    @inject(MessagesModule.MessageServiceInterface) messageService: MessageServiceInterface,

    @inject(FilesModule.FileProviderInterface) protected fileProvider: FileProviderInterface,
    @inject(CommonModule.JsonSerializerInterface) protected jsonSerializer: JsonSerializerInterface,

    @multiInject(NotificationsModule.PgNotificationHandler)
    protected handlers: PgNotificationHandlerInterface[]
  ) {
    super();
    this.logger = logger
    this.postgresListener = postgresListener
    this.activityProvider = activityProvider
    this.notificationFactory = notificationFactory
    this.projectService = projectService
    this.followerService = followerService
    this.projectPeopleService = projectPeopleService
    this.notificationService = notificationService
    this.messageService = messageService
  }

  async attach(): Promise<void> {
    try {
      this.postgresListener.on(NEW_NOTIFICATION, this.handleNotification.bind(this))
      this.logger.info('attached.')
    } catch (error) {
      this.logger.error(error)
    }
  }

  async detach(): Promise<void> {
    this.postgresListener.off(NEW_NOTIFICATION, this.handleNotification.bind(this))
    this.logger.info(' detached.')
  }

  async handleNotification(notification: Notification) {
    try {

      const payload: NotificationPayload = this.jsonSerializer.fromJson(notification.payload);

      if (await this.tryRegisteredHandler(payload)) {
        this.logger.debug(`Registered handler supports notification ${payload.table}/${payload.action}. Skipping legacy notification handling.`);
        return;
      }

    } catch (error) {
      this.logger.error(error)
    }
  }

  /**
   * Calls registered handlers and if any of then supports this type
   * of notification it will be requested to handle it.
   *
   * @param payload
   * @return boolean TRUE if any handler supports the notification and was requested to handle it.
   */
  protected async tryRegisteredHandler(payload: NotificationPayload) : Promise<boolean>
  {
    const notificationDescriptor = `${payload.table}/${payload.action} (${payload.id})`;
    this.logger.debug(`Trying registered notif. handler for ${notificationDescriptor}`);
    for (const handler of this.handlers) {
      if (await handler.supports(payload)) {
        this.logger.info(`Handler ${handler.constructor.name} supports ${notificationDescriptor}.`);
        await handler.handle(payload);
        return true;
      }
      this.logger.debug(`Handler ${handler.constructor.name} does not support this notification.`);
    }

    return false;
  }
}

export default NotificationListenerPlugin
