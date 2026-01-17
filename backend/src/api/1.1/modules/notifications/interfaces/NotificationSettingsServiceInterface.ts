import { NotificationsDeliverySettingsDbRow, ChatNotificationSettingsType, ChatNotificationSettingsDbRow } from '../../db/schema';
import { NotificationsDeliverySettingsJsonInterface, NotificationsDeliverySettingsResult, ChatNotificationSettingsResult } from '../types';
import { Id } from '../../common/identifier';


export interface NotificationSettingsServiceInterface {
  /**
   * @param {Id} userId
   * @param {Id} organizationId
   * @return {Promise<PushNotificationDeviceResult>}
   */
  getNotificationsDeliverySettings(userId: Id, organizationId: Id, trx?: Transaction): Promise<NotificationsDeliverySettingsDbRow>;

  /**
   * @param {Id} userId
   * @param {Id} organizationId
   * @param {NotificationsDeliverySettingsJsonInterface} settings
   * @return {Promise<PushNotificationDeviceResult>}
   */
  updateNotificationsDeliverySettings(
    userId: Id,
    organizationId: Id,
    settings: NotificationsDeliverySettingsJsonInterface
  ): Promise<NotificationsDeliverySettingsResult>;

  updateChatNotificationSettingsType(
    userId: Id,
    projectId: Id,
    chatNotificationSettingsType: ChatNotificationSettingsType
  ): Promise<ChatNotificationSettingsResult>;

  doUpdateNotificationDeliverySettings(
    trx: Transaction,
    userId: Id,
    organizationId: Id,
    settings: NotificationsDeliverySettingsJsonInterface
  );

  getChatNotificationSettingsType(userId: Id, projectId: Id): Promise<ChatNotificationSettingsType>;

  getUserChatNotificationSettingsTypes(userId: Id, trx?: Transaction): Promise<ChatNotificationSettingsDbRow[]>;

  getPeopleChatNotificationSettingsTypes(userIds: Id[], projectIds: Id[], trx?: Transaction): Promise<ChatNotificationSettingsDbRow[]>
}
