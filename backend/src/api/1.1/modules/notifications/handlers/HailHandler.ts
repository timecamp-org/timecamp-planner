import { AbstractNotificationHandler } from './AbstractNotificationHandler';
import { inject, injectable } from 'inversify';
import { NotificationAction, NotificationPayload } from '../../db/types';
import { NotificationsModule } from '../NotificationsModule';
import { NotificationFactoryInterface } from '../interfaces/NotificationFactoryInterface';
import { MessagesModule } from '../../messages/MessagesModule';
import { MessageServiceInterface } from '../../messages/interfaces/MessageServiceInterface';
import Table from '../../db/Table';

@injectable()
export class HailHandler
  extends AbstractNotificationHandler
{
  constructor(
    @inject(NotificationsModule.NotificationFactoryInterface) notificationFactory: NotificationFactoryInterface,
    @inject(MessagesModule.MessageServiceInterface) protected messageService: MessageServiceInterface,
  ) {
    super(
      notificationFactory,
      Table.MESSAGE_HAIL,
      NotificationAction.INSERT
    );
  }

  public async handle(payload: NotificationPayload): Promise<void>
  {
    await this.notificationFactory.createNotificationHailMentioned(payload.id)
  }
}
