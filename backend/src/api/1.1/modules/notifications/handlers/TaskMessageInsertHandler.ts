import { NotificationAction, NotificationPayload } from '../../db/types';
import { AbstractNotificationHandler } from './AbstractNotificationHandler';
import Table from '../../db/Table';
import { NotificationFactoryInterface } from '../interfaces/NotificationFactoryInterface';
import { MessageServiceInterface } from '../../messages/interfaces/MessageServiceInterface';
import { inject, injectable } from 'inversify';
import { MessagesModule } from '../../messages/MessagesModule';
import { NotificationsModule } from '../NotificationsModule';

@injectable()
export class TaskMessageInsertHandler extends AbstractNotificationHandler {
  constructor(
    @inject(NotificationsModule.NotificationFactoryInterface) notificationFactory: NotificationFactoryInterface,
    @inject(MessagesModule.MessageServiceInterface) protected messageService: MessageServiceInterface,
  ) {
    super(
      notificationFactory,
      Table.MESSAGE_CONTAINER_TASK,
      NotificationAction.INSERT
    );
  }

  public async handle(payload: NotificationPayload): Promise<void> {
    const [messageId, taskId] = this.parseNotificationIds(payload.id)

    await this.notificationFactory.createNotificationTaskMessageSent(messageId, taskId);
  }
}
