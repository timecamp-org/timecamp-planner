import { NotificationProviderInterface } from '../notifications/interfaces/NotificationProviderInterface'
import { injectable } from 'inversify'
import { AbstractPostgresProvider } from './AbstractPostgresProvider'
import { NotificationType } from '../notifications/types'
import { Id } from '../common/identifier'
import Table from '../db/Table'
import { NotificationDbRow } from '../db/schema'

@injectable()
export class PostgresNotificationProvider
  extends AbstractPostgresProvider
  implements NotificationProviderInterface {
  protected static readonly Column = {
    CreatedAt: 'created_at',
    ContainerId: 'container_id',
  }
  async getSentDueDateRemindersForTasks(
    taskIds: Id[],
    between: Date,
    and: Date
  ) {
    const qb = this.connection.getQueryBuilder();
    return await qb.from(Table.NOTIFICATION)
      .where({
        notificationType: NotificationType.DUE_DATE_REMINDER,
      })
      .whereIn(PostgresNotificationProvider.Column.ContainerId, taskIds)
      .andWhereBetween(PostgresNotificationProvider.Column.CreatedAt, [between, and])
    ;
  }

  async getNotification(notificationId: Id): Promise<NotificationDbRow> {
    const qb = this.connection.getQueryBuilder();
    return await qb.from(Table.NOTIFICATION)
      .first()
      .where({
        id: notificationId,
      })
    ;
  }

  async getUserInOrganizationNotifications(userId: Id, organizationId: Id, limit: number, notificationTypesToArchive?: NotificationType[]): Promise<Id[]> {
    const queryBuilder = this.connection.getQueryBuilder();

    const query = queryBuilder
      .select(`${Table.NOTIFICATION}.id`)
      .from(Table.NOTIFICATION)
      .join(Table.NOTIFICATION_IN_APP, `${Table.NOTIFICATION}.id`, `${Table.NOTIFICATION_IN_APP}.notification_id`)
      .where(function () {
        if (notificationTypesToArchive && notificationTypesToArchive.length > 0) {
          this.whereIn(`${Table.NOTIFICATION}.notificationType`, notificationTypesToArchive)
        }

        this.andWhere({
          [`${Table.NOTIFICATION_IN_APP}.is_archived`]: false,
          [`${Table.NOTIFICATION}.organization_id`]: organizationId,
          [`${Table.NOTIFICATION}.recipient_id`]: userId,
        })
      })
      .limit(limit)
      .pluck('id')

    return await query
  };

  async archiveNotifications(notificationIds: Id[]): Promise<void> {
    await this.connection.getQueryBuilder()
      .from(Table.NOTIFICATION_IN_APP)
      .update({ isArchived: true })
      .whereIn('notification_id', notificationIds)
  }

}
