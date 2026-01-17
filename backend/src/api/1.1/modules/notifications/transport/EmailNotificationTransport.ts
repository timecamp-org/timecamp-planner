import { NotificationTransportInterface } from '../interfaces/NotificationTransportInterface';
import { UserServiceInterface } from '../../users/UserServiceInterface';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { UsersModule } from '../../users/UsersModule';
import { inject, injectable } from 'inversify';
import { NotificationDbRow } from '../../db/schema';
import { NotificationMethod, NotificationContent, SendMessageResult, AudienceType } from '../types';
import { NotificationRendererInterface } from '../interfaces/NotificationRendererInterface';
import { UserSessionServiceInterface } from '../../onlineStatus/UserSessionServiceInterface';
import { MailerServiceInterface } from '../../mailer/interfaces/MailerServiceInterface';
import { MailerModule } from '../../mailer/MailerModule';
import { OnlineStatusModule } from '../../onlineStatus/OnlineStatusModule';
import { NotificationsModule } from '../NotificationsModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';


@injectable()
export class EmailNotificationTransport
implements NotificationTransportInterface {
  protected mailerService: MailerServiceInterface;
  protected onlineStatusService: UserSessionServiceInterface;
  protected userService: UserServiceInterface;
  protected notificationRenderer: NotificationRendererInterface<NotificationContent>
  protected logger: LoggerInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(MailerModule.MailerServiceInterface) mailerService: MailerServiceInterface,
    @inject(OnlineStatusModule.UserSessionServiceInterface) onlineStatusService: UserSessionServiceInterface,
    @inject(UsersModule.UserServiceInterface) userService: UserServiceInterface,
    @inject(NotificationsModule.NotificationRendererInterface) notificationRenderer: NotificationRendererInterface<NotificationContent>
  ) {
    this.logger = logger;
    this.mailerService = mailerService
    this.onlineStatusService = onlineStatusService;
    this.userService = userService;
    this.notificationRenderer = notificationRenderer;
  }

  getNotificationMethod(): NotificationMethod {
    return NotificationMethod.EMAIL;
  }

  async sendNotification(notification: NotificationDbRow, trx?: Transaction): Promise<SendMessageResult[]> {
    const recipientId = notification.recipientId;
    this.logger.debug(`Sending email notification for [${recipientId}]:`, notification);

    if (await this.onlineStatusService.isOnline(recipientId, trx)) {
      // No need to send email.
      this.logger.debug(`Recipient [${recipientId}] is ONLINE -- skipping email notification.`);
      return;
    }
    try {
      const recipient = await this.userService.getUserById(recipientId, trx);
      const content = await this.notificationRenderer.renderNotification(notification);
      if (content) {
        this.logger.debug('Rendered notification: ', content.content);
        this.mailerService.sendNotificationMail({
          recipient,
          notificationContent: content.content
        });
        this.logger.info(`Sent email notification {type: ${notification.notificationType}} to [${recipientId}] (${recipient.email})`);
      } else {
        this.logger.debug('No content for notification: ', notification.id);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  sendSystemNotification(audienceType: AudienceType, title: string, content: string): PromiseLike<SendMessageResult[]> {
    throw new Error('Method not implemented.');
  }
}
