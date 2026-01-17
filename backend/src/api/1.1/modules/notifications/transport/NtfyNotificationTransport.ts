import axios from 'axios'
import { inject, injectable } from 'inversify'
import { pick, isEmpty } from 'lodash'
import config from '../../../../../config'
import { LoggerInterface } from '../../../../../infrastructure/logger'
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule'
import { CommonModule } from '../../common/CommonModule'
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface'
import { DeviceType, NotificationDbRow, NotificationPushDeviceDbRow } from '../../db/schema'
import { Id } from '../../common/identifier'
import {
  NotificationMethod,
  NotificationType,
  PushNotificationContent,
  PushNotificationPriority,
  RecipientDevicesMap,
  SendMessageResult,
} from '../types'
import { NotificationRendererInterface } from '../interfaces/NotificationRendererInterface'
import { NotificationsModule } from '../NotificationsModule'
import { AbstractPushNotificationTransport } from './AbstractPushNotificationTransport'
import { NotificationMethodMapper } from '../NotificationMethodMapper'
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface'
import { NotificationPushDeviceProviderInterface } from '../interfaces/NotificationPushDeviceProviderInterface'

const MAX_RETRIES = 3
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

type NtfyMessagePayload = {
  title: string
  body: string
  notificationType?: string
  containerId?: Id
  actorId?: Id
  organizationId?: Id
  data?: NotificationDbRow['data']
  notificationId?: Id
}

@injectable()
export class NtfyNotificationTransport extends AbstractPushNotificationTransport {
  protected logger: LoggerInterface
  private timeService: TimeServiceInterface
  private jsonSerializer: JsonSerializerInterface
  protected notificationPushDeviceProvider: NotificationPushDeviceProviderInterface

  constructor(
    @inject(NotificationsModule.NotificationMethod)
      notificationMethod: NotificationMethod,
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(NotificationsModule.NotificationRendererInterface)
      renderer: NotificationRendererInterface<PushNotificationContent>,
    @inject(CommonModule.TimeServiceInterface)
      timeService: TimeServiceInterface,
    @inject(NotificationsModule.NotificationMethodMapper)
      notificationMethodMapper: NotificationMethodMapper,
    @inject(CommonModule.JsonSerializerInterface)
      jsonSerializer: JsonSerializerInterface,
    @inject(NotificationsModule.NotificationPushDeviceProviderInterface)
      notificationPushDeviceProvider: NotificationPushDeviceProviderInterface,
  ) {
    super(logger, renderer, notificationMethod, notificationMethodMapper, notificationPushDeviceProvider)
    this.logger = logger
    this.timeService = timeService
    this.jsonSerializer = jsonSerializer
    this.notificationPushDeviceProvider = notificationPushDeviceProvider
  }

  private buildRecipientDeviceIds(devices: NotificationPushDeviceDbRow[]): RecipientDevicesMap {
    const filteredDevices = devices.filter(device => device.deviceType !== DeviceType.DESKTOP_APP)

    return filteredDevices.reduce((res, device): Record<DeviceType, Id[]> => {
      if (res[device.deviceType]) {
        res[device.deviceType].push(device.deviceId)
      } else {
        res[device.deviceType] = [device.deviceId]
      }

      return res
    }, {} as Record<DeviceType, Id[]>)
  }

  protected async pushNotification(
    notificationId: Id,
    devices: NotificationPushDeviceDbRow[],
    pushNotificationContent: PushNotificationContent,
    notification: NotificationDbRow,
    trx?: Transaction
  ): Promise<SendMessageResult[]> {
    try {
      const customData = pick(notification, [
        'notificationType',
        'targetType',
        'targetId',
        'containerType',
        'containerId',
        'organizationId',
        'data',
        'actorId',
      ])

      const sendMessageResults = await this.pushNotificationForDevices(
        devices,
        pushNotificationContent,
        customData,
        notification.recipientId,
        notificationId,
      )

      await this.notificationPushDeviceProvider.savePushNotification({
        notificationId,
        sentAt: this.timeService.getCurrentTime(),
        retryCount: 0,
      }, trx)

      return sendMessageResults
    } catch (e) {
      this.logger.error(e)
      await this.notificationPushDeviceProvider.savePushNotification({
        notificationId,
        sentAt: null,
        retryCount: 0,
      }, trx)
      return []
    }
  }

  protected async pushBaseNotification(
    devices: NotificationPushDeviceDbRow[],
    pushNotificationContent: PushNotificationContent,
  ): Promise<SendMessageResult[]> {
    return await this.pushNotificationForDevices(devices, pushNotificationContent)
  }

  protected async pushNotificationForDevices(
    devices: NotificationPushDeviceDbRow[],
    pushNotificationContent: PushNotificationContent,
    customData?: Partial<NotificationDbRow>,
    recipientId?: Id,
    notificationId?: Id,
  ): Promise<SendMessageResult[]> {
    const recipientDeviceIdsByDeviceType = this.buildRecipientDeviceIds(devices)
    let sendMessageResults: SendMessageResult[] = []
    const priority = this.getPriority(customData?.notificationType)

    if (isEmpty(recipientDeviceIdsByDeviceType)) {
      this.logger.debug(`No ntfy devices to push to [${recipientId}]`)
    } else {
      for (const deviceType of Object.keys(recipientDeviceIdsByDeviceType)) {
        const recipientDeviceIds = recipientDeviceIdsByDeviceType[deviceType]
        if (recipientDeviceIds) {
          const payload = this.buildMessagePayload(pushNotificationContent, customData, notificationId)
          const results = await this.sendMessage(payload, recipientDeviceIds, pushNotificationContent, priority)
          sendMessageResults = sendMessageResults.concat(results)
        }
      }
    }
    return sendMessageResults
  }

  private buildMessagePayload(
    pushNotificationContent: PushNotificationContent,
    customData?: Partial<NotificationDbRow>,
    notificationId?: Id,
  ): string {
    const payload: NtfyMessagePayload = {
      title: pushNotificationContent.title,
      body: pushNotificationContent.content,
      notificationType: customData?.notificationType?.toString(),
      containerId: pushNotificationContent.containerId,
      actorId: customData?.actorId,
      organizationId: customData?.organizationId,
      data: customData?.data,
      notificationId,
    }

    return this.jsonSerializer.toJson(payload)
  }

  private getPriority(notificationType?: NotificationType): PushNotificationPriority {
    if (notificationType && [
      NotificationType.CONVERSATION_MESSAGE_SENT,
      NotificationType.HAIL_MENTIONED,
      NotificationType.USER_MENTIONED,
      NotificationType.TASK_MESSAGE_SENT,
    ].includes(notificationType)) {
      return PushNotificationPriority.HIGH
    }
    return PushNotificationPriority.NORMAL
  }

  private getTopic(deviceId: Id): string {
    const basePrefix = config.pushNotifications?.ntfy?.topicPrefix || ''
    if (basePrefix && !deviceId.startsWith(basePrefix)) {
      return `${basePrefix}${deviceId}`
    }
    return deviceId
  }

  private getTopicUrl(deviceId: Id): string {
    const baseUrl = config.pushNotifications?.ntfy?.baseUrl
    if (!baseUrl) {
      return ''
    }
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    return `${normalizedBaseUrl}/${this.getTopic(deviceId)}`
  }

  private async sendMessage(
    payload: string,
    deviceIds: Id[],
    pushNotificationContent: PushNotificationContent,
    priority: PushNotificationPriority,
    attemptsLeft = MAX_RETRIES,
  ): Promise<SendMessageResult[]> {
    const baseUrl = config.pushNotifications?.ntfy?.baseUrl
    if (!baseUrl) {
      this.logger.warn(new Error('Missing ntfy baseUrl for push notifications'))
      return deviceIds.map((deviceId) => ({
        deviceId,
        error: 'Missing ntfy baseUrl',
      }))
    }

    const results = await Promise.all(deviceIds.map(async (deviceId) => {
      try {
        const url = this.getTopicUrl(deviceId)
        await axios.post(url, payload, {
          headers: {
            ...DEFAULT_HEADERS,
            Title: pushNotificationContent.title,
            Priority: priority === PushNotificationPriority.HIGH ? '5' : '3',
          },
        })
        return { deviceId }
      } catch (error) {
        if (attemptsLeft > 0) {
          return this.sendMessage(payload, [deviceId], pushNotificationContent, priority, attemptsLeft - 1).then(([retryResult]) => retryResult)
        }
        const message = error instanceof Error ? error.message : 'Unknown push error'
        this.logger.warn(new Error(`Push send error to device ${deviceId}: ${message}`))
        return {
          deviceId,
          error: message,
        }
      }
    }))

    return results
  }
}
