import { NotificationPayload } from '../../db/types';

export interface PgNotificationHandlerInterface
{
  supports(payload: NotificationPayload) : PromiseLike<boolean>;

  handle(payload: NotificationPayload) : PromiseLike<void>;
}
