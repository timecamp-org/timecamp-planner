import { injectable, inject } from 'inversify';
import { Id } from '../../common/identifier';

import { NotificationPushDeviceDbRow, DeviceType } from '../../db/schema';
import { PushNotificationJson } from '../types';
import Table from '../../db/Table';
import { EntityStatus } from '../../common/enum';
import { NotificationPushDeviceProviderInterface } from '../interfaces/NotificationPushDeviceProviderInterface';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';

@injectable()
export class NotificationPushDeviceProvider implements NotificationPushDeviceProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {}

  async getExistingPushNotificationDevices(userId: Id, deviceTypes: DeviceType[], trx?: Transaction): Promise<NotificationPushDeviceDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.NOTIFICATION_PUSH_DEVICE)
      .whereIn('deviceType', deviceTypes)
      .andWhere({ userId, status: EntityStatus.EXISTS })
    ;
  }

  async getAllExistingPushNotificationDevices(deviceTypes: DeviceType[], trx?: Transaction): Promise<NotificationPushDeviceDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select()
      .from(Table.NOTIFICATION_PUSH_DEVICE)
      .whereIn('deviceType', deviceTypes)
      .andWhere({ status: EntityStatus.EXISTS })
    ;
  }

  async getOnlineNotificationDevices(deviceTypes: DeviceType[], trx?: Transaction): Promise<NotificationPushDeviceDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(`${Table.NOTIFICATION_PUSH_DEVICE}.deviceId`, `${Table.NOTIFICATION_PUSH_DEVICE}.deviceType`)
      .from(Table.NOTIFICATION_PUSH_DEVICE)
      .join(Table.USER_SESSION, `${Table.NOTIFICATION_PUSH_DEVICE}.userId`, `${Table.USER_SESSION}.userId`)
      .whereIn(`${Table.NOTIFICATION_PUSH_DEVICE}.deviceType`, deviceTypes)
      .andWhere(`${Table.USER_SESSION}.finishedAt`, null)
      .andWhere({ status: EntityStatus.EXISTS })
      .groupBy(`${Table.NOTIFICATION_PUSH_DEVICE}.deviceId`, `${Table.NOTIFICATION_PUSH_DEVICE}.deviceType`)
    ;
  }

  async removeUnregisteredPushNotificationDevices(deviceIds: Id[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.NOTIFICATION_PUSH_DEVICE)
      .whereIn(`${Table.NOTIFICATION_PUSH_DEVICE}.deviceId`, deviceIds)
      .update({ status: EntityStatus.DELETED })
    ;
  }

  async savePushNotification(pushNotification: PushNotificationJson, trx?: Transaction) {
    let connection = trx || this.connection.getConnection()
    const queryParams = {
      notificationId: connection.raw('?', pushNotification.notificationId),
      sentAt: connection.raw('?', pushNotification.sentAt),
      retryCount: connection.raw('?', pushNotification.retryCount),
    };

    const rawQuery = `INSERT INTO ${Table.NOTIFICATION_PUSH} `
      + '(notification_id, sent_at, retry_count) VALUES '
      + '(:notificationId:, :sentAt:, :retryCount:) '
      + 'ON CONFLICT (notification_id) DO UPDATE SET '
      + 'retry_count = :retryCount:'
      ;
    return await connection.raw(rawQuery, queryParams);
  }
}
