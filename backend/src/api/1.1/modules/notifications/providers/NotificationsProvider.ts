import { NotificationsProviderInterface } from '../interfaces/NotificationsProviderInterface';
import { Id } from '../../common/identifier';
import { UnreadNotificationDbRow } from '../../db/schema';
import { injectable, inject } from 'inversify';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import Table from '../../db/Table';

@injectable()
export class NotificationsProvider implements NotificationsProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) { }

  async getUserUnreadNotifications(userId: Id, organizationId?: Id): Promise<UnreadNotificationDbRow[]> {
    let q = this.connection.getQueryBuilder()
      .select(
        `${Table.NOTIFICATION_IN_APP}.notificationId`,
        `${Table.NOTIFICATION_IN_APP}.readAt`,
        `${Table.NOTIFICATION}.notificationType`,
        `${Table.NOTIFICATION}.data`,
        `${Table.NOTIFICATION}.createdAt`,
        `${Table.NOTIFICATION}.containerId`,
        `${Table.NOTIFICATION}.organizationId`,
      )
      .from(Table.NOTIFICATION_IN_APP)
      .join(Table.NOTIFICATION, `${Table.NOTIFICATION_IN_APP}.notificationId`, `${Table.NOTIFICATION}.id`)
      .where({
        [`${Table.NOTIFICATION}.recipientId`]: userId,
        [`${Table.NOTIFICATION_IN_APP}.isArchived`]: false,
      })
      .whereNull(`${Table.NOTIFICATION_IN_APP}.readAt`)

    if (organizationId) {
      q = q.where(function () {
        this.where(`${Table.NOTIFICATION}.organizationId`, organizationId)
          .orWhereNull(`${Table.NOTIFICATION}.organizationId`)
      })
    }

    return await q
  }
}