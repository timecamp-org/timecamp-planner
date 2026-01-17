import { Id } from '../common/identifier'

import Table, { ForeignKey } from '../db/Table'
import { NotificationsDeliverySettingsDbRow, ChatNotificationSettingsType, ChatNotificationSettingsDbRow } from '../db/schema'

import { violatesForeignKey } from '../../../../utils';
import { injectable, inject } from 'inversify';
import { NotificationSettingsServiceInterface } from './interfaces/NotificationSettingsServiceInterface';
import {
  NotificationsDeliverySettingsJsonInterface,
  DEFAULT_DELIVERY_SETTINGS,
  NotificationsDeliverySettingsResult,
  NotificationsDeliverySettingsResultStatus,
  ChatNotificationSettingsResult,
  ChatNotificationSettingsResultStatus
} from './types';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

@injectable()
export class NotificationSettingsService
implements NotificationSettingsServiceInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getNotificationsDeliverySettings(userId: Id, organizationId: Id, trx?: Transaction): Promise<NotificationsDeliverySettingsDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.NOTIFICATION_DELIVERY_SETTINGS)
      .where({
        organizationId,
        userId,
      }).first()
  }

  async updateNotificationsDeliverySettings(
    userId: Id,
    organizationId: Id,
    settings: NotificationsDeliverySettingsJsonInterface = DEFAULT_DELIVERY_SETTINGS
  ): Promise<NotificationsDeliverySettingsResult> {
    return this.connection.getConnection().transaction(async (trx) => {
      await this.doUpdateNotificationDeliverySettings(
        trx,
        userId,
        organizationId,
        settings
      )
      return { status: NotificationsDeliverySettingsResultStatus.OK };
    })
  }

  async doUpdateNotificationDeliverySettings(
    trx: Transaction,
    userId: Id,
    organizationId: Id,
    settings: NotificationsDeliverySettingsJsonInterface
  ) {
    const queryFields = {
      organizationId,
      userId,
    }
    const notificationSettings = await this.connection.getQueryBuilder()
      .select()
      .transacting(trx)
      .from(Table.NOTIFICATION_DELIVERY_SETTINGS)
      .where(queryFields).first()


    if (notificationSettings) {
      await this.connection.getQueryBuilder()
        .from(Table.NOTIFICATION_DELIVERY_SETTINGS)
        .transacting(trx)
        .where(queryFields)
        .update(settings)
    } else {
      const insertRow = {
        ...DEFAULT_DELIVERY_SETTINGS,
        ...queryFields,
        ...settings,
      }
      await this.connection.getQueryBuilder()
        .insert(insertRow)
        .transacting(trx)
        .into(Table.NOTIFICATION_DELIVERY_SETTINGS)
    }
  }

  async updateChatNotificationSettingsType(
    userId: Id,
    projectId: Id,
    chatNotificationSettingsType: ChatNotificationSettingsType
  ): Promise<ChatNotificationSettingsResult> {
    try {
      const chatNotificationSettings = await this.connection.getQueryBuilder()
        .select()
        .from(Table.CHAT_NOTIFICATION_SETTINGS)
        .where({ projectId, userId }).first()

      if (chatNotificationSettings) {
        await this.connection.getQueryBuilder()
          .from(Table.CHAT_NOTIFICATION_SETTINGS)
          .where({ projectId, userId })
          .update({ chatNotificationSettingsType })
      } else {
        await this.connection.getQueryBuilder()
          .insert({ projectId, userId, chatNotificationSettingsType })
          .into(Table.CHAT_NOTIFICATION_SETTINGS)
      }

      return { status: ChatNotificationSettingsResultStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.CHAT_NOTIFICATION_SETTINGS_PROJECT_ID_FK)) {
        return { status: ChatNotificationSettingsResultStatus.PROJECT_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.CHAT_NOTIFICATION_SETTINGS_USER_ID_FK)) {
        return { status: ChatNotificationSettingsResultStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async getChatNotificationSettingsType(userId: Id, projectId: Id): Promise<ChatNotificationSettingsType> {
    return await this.connection.getQueryBuilder()
      .select()
      .from(Table.CHAT_NOTIFICATION_SETTINGS)
      .where({
        projectId,
        userId,
      }).first()
  }

  async getUserChatNotificationSettingsTypes(userId: Id, trx?: Transaction): Promise<ChatNotificationSettingsDbRow[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.CHAT_NOTIFICATION_SETTINGS)
      .where({
        userId,
      })
  }

  async getPeopleChatNotificationSettingsTypes(userIds: Id[], projectIds: Id[], trx?: Transaction): Promise<ChatNotificationSettingsDbRow[]> {
    const settingDbRows: ChatNotificationSettingsDbRow[] = await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.CHAT_NOTIFICATION_SETTINGS)
      .whereIn('userId', userIds)
      .whereIn('projectId', projectIds)

    return settingDbRows
  }
}
