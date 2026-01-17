import { NotificationDbRow } from '../../db/schema';
import { NotificationMethod, SendMessageResult, AudienceType } from '../types';


export interface NotificationTransportInterface {
  getNotificationMethod(): NotificationMethod;

  sendNotification(notification: NotificationDbRow, trx?: Transaction): PromiseLike<SendMessageResult[]>;

  sendSystemNotification(audienceType: AudienceType, title: string, content: string): PromiseLike<SendMessageResult[]>;
}
