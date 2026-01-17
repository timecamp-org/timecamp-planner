import { Id } from "../../common/identifier";
import { NotificationPushDeviceDbRow, DeviceType } from "../../db/schema";
import { PushNotificationJson } from "../types";


export interface NotificationPushDeviceProviderInterface {
  getExistingPushNotificationDevices(userId: Id, deviceTypes: DeviceType[], trx?: Transaction): Promise<NotificationPushDeviceDbRow[]>;

  getAllExistingPushNotificationDevices(deviceTypes: DeviceType[], trx?: Transaction): Promise<NotificationPushDeviceDbRow[]>;

  getOnlineNotificationDevices(deviceTypes: DeviceType[], trx?: Transaction): Promise<NotificationPushDeviceDbRow[]>;

  removeUnregisteredPushNotificationDevices(deviceIds: Id[], trx?: Transaction): Promise<void>;

  savePushNotification(pushNotification: PushNotificationJson, trx?: Transaction) : Promise<void>;
}
