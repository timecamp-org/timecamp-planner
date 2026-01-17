import { PgNotificationHandlerInterface } from '../interfaces/PgNotificationHandlerInterface';
import { NotificationAction, NotificationPayload } from '../../db/types';
import Table from '../../db/Table';
import { Id } from '../../common/identifier';
import { parseNotificationIds } from '../../db/utils';
import { NotificationFactoryInterface } from '../interfaces/NotificationFactoryInterface';
import { injectable, unmanaged } from 'inversify';

/**
 * Covers most common case when handler is registered for specific TABLE and ACTION.
 */
@injectable()
export abstract class AbstractNotificationHandler
  implements PgNotificationHandlerInterface
{
  protected constructor(
    // https://github.com/inversify/InversifyJS/issues/522
    @unmanaged() protected notificationFactory: NotificationFactoryInterface,
    protected table: Table,
    protected action: NotificationAction
  ) {}

  public abstract handle(payload: NotificationPayload): PromiseLike<void>;

  public async supports(payload: NotificationPayload): Promise<boolean>
  {
    return (payload.action === this.action) && (payload.table === this.table);
  }

  /**
   * Ids are transported as string in notification payload.
   * @param ids
   */
  protected parseNotificationIds(ids: string) : Id[]{
    // Ultimately this should be injected as some form of util class. For now just wrap the shit in object.
    return parseNotificationIds(ids);
  }
}
