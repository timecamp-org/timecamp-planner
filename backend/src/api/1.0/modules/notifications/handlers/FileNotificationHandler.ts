import { AbstractNotificationHandler } from './AbstractNotificationHandler';
import { NotificationAction, NotificationPayload } from '../../db/types';
import { inject, injectable } from 'inversify';
import { NotificationsModule } from '../NotificationsModule';
import { NotificationFactoryInterface } from '../interfaces/NotificationFactoryInterface';
import { MessagesModule } from '../../messages/MessagesModule';
import { MessageServiceInterface } from '../../messages/interfaces/MessageServiceInterface';
import Table from '../../db/Table';
import { FilesModule } from '../../files/FilesModule';
import { FileProviderInterface } from '../../files/interfaces/FileProviderInterface';

@injectable()
export class FileNotificationHandler
  extends AbstractNotificationHandler
{

  constructor(
    @inject(NotificationsModule.NotificationFactoryInterface) notificationFactory: NotificationFactoryInterface,
    @inject(MessagesModule.MessageServiceInterface) protected messageService: MessageServiceInterface,
    @inject(FilesModule.FileProviderInterface) protected fileProvider: FileProviderInterface,
  ) {
    super(
      notificationFactory,
      Table.MESSAGE_FILE,
      NotificationAction.INSERT
    );
  }

  public async handle(payload: NotificationPayload): Promise<void>
  {
    const [messageId, fileId] = this.parseNotificationIds(payload.id);
    const message = await this.messageService.getMessage(messageId);
    const file = await this.fileProvider.getFileById(fileId);
    await this.notificationFactory.createNotificationFileUploadedInChat(
      message,
      file
    );
  }

}
