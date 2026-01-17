import { LoggerInterface } from '../../../../../infrastructure/logger';
import { NotificationDbRow, NotificationPushDeviceDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';
import { NotificationRendererInterface } from '../interfaces/NotificationRendererInterface';
import {
  NotificationMethod,
  PushNotificationContent,
  UnregisteredDeviceErrors,
  SendMessageResult,
  AudienceType
} from '../types';
import { NotificationTransportInterface } from '../interfaces/NotificationTransportInterface';
import { NotificationMethodMapper } from '../NotificationMethodMapper'
import { injectable } from 'inversify'
import { NotificationPushDeviceProviderInterface } from '../interfaces/NotificationPushDeviceProviderInterface';


@injectable()
export abstract class AbstractPushNotificationTransport
implements NotificationTransportInterface {

  protected logger: LoggerInterface;
  protected renderer: NotificationRendererInterface<PushNotificationContent>;
  protected notificationMethod: NotificationMethod;
  protected notificationMethodMapper: NotificationMethodMapper;
  protected notificationPushDeviceProvider: NotificationPushDeviceProviderInterface;

  constructor(
    logger: LoggerInterface,
    renderer: NotificationRendererInterface<PushNotificationContent>,
    notificationMethod: NotificationMethod,
    notificationMethodMapper: NotificationMethodMapper,
    notificationPushDeviceProvider: NotificationPushDeviceProviderInterface,
  ) {
    this.logger = logger;
    this.renderer = renderer;
    this.notificationMethod = notificationMethod;
    this.notificationMethodMapper = notificationMethodMapper;
    this.notificationPushDeviceProvider = notificationPushDeviceProvider;
  }

  getNotificationMethod(): NotificationMethod {
    return this.notificationMethod;
  }

  async sendNotification(notification: NotificationDbRow, trx?: Transaction): Promise<SendMessageResult[]> {
    if (!notification.recipientId) {
      this.logger.warn(`Notification without recipient_id [${notification.id}]`);
      return;
    }
    const deviceTypes = this.notificationMethodMapper.deviceTypesForNotification(this.notificationMethod)
    const devices = await this.notificationPushDeviceProvider.getExistingPushNotificationDevices(notification.recipientId, deviceTypes, trx);

    if (devices.length === 0) {
      this.logger.debug(`No devices to push to [${notification.recipientId}]`)
      return;
    }
    const pushNotificationContent = await this.renderer.renderNotification(notification);

    if (!pushNotificationContent) {
      return;
    }

    const results = await this.pushNotification(notification.id, devices, pushNotificationContent, notification, trx);

    await this.cleanupUnregisteredDevices(results, trx);
  }

  public async sendSystemNotification(audienceType: AudienceType, title: string, content: string): Promise<SendMessageResult[]> {
    let devices = []
    const deviceTypes = this.notificationMethodMapper.deviceTypesForNotification(this.notificationMethod)

    switch (audienceType) {
      case AudienceType.ONLINE: {
        devices = await this.notificationPushDeviceProvider.getOnlineNotificationDevices(deviceTypes)
        break;
      }
      case AudienceType.ALL: {
        devices = await this.notificationPushDeviceProvider.getAllExistingPushNotificationDevices(deviceTypes)
        break;
      }
    }

    const pushNotificationContent: PushNotificationContent = {
      title,
      content,
    }
    const results = await this.pushBaseNotification(devices, pushNotificationContent);

    return results
  }

  private async cleanupUnregisteredDevices(results: SendMessageResult[], trx?: Transaction): Promise<void> {
    const unregisteredDevices = []
    results.forEach(result => {
      const { deviceId, error } = result
      if (error && UnregisteredDeviceErrors.includes(error)) {
        unregisteredDevices.push(deviceId)
      }
    })
    if (unregisteredDevices.length > 0) {
      await this.notificationPushDeviceProvider.removeUnregisteredPushNotificationDevices(unregisteredDevices, trx)
    }
  }

  protected abstract pushNotification(
    notificationId: Id,
    devices: NotificationPushDeviceDbRow[],
    pushNotificationContent: PushNotificationContent,
    notification: NotificationDbRow,
    trx?: Transaction,
  ): Promise<SendMessageResult[]>;

  protected abstract pushBaseNotification(
    devices: NotificationPushDeviceDbRow[],
    pushNotificationContent: PushNotificationContent,
  ): Promise<SendMessageResult[]>;

}
