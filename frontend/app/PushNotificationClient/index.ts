import { PushNotification, PushNotificationsConfigInterface } from './types'
import { AppEventType } from '../common/types'
import NtfyClient from './NtfyClient'
import NoopPushNotificationClient from './NoopPushNotificationClient'
import { PushNotificationClientInterface } from './PushNotificationClientInterface'

function onNotificationOpened(notification: PushNotification): void {
  const { AppEventEmitter } = require('common/services')
  AppEventEmitter.emit(AppEventType.PUSH_NOTIFICATION_CLICKED, notification)
}

export default function getPushNotificationClient(
  config?: PushNotificationsConfigInterface,
): PushNotificationClientInterface {
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    return new NoopPushNotificationClient()
  }

  if (!config?.baseUrl) {
    return new NoopPushNotificationClient()
  }

  try {
    const { canShowForegroundWebNotification } = require('./utils')
    return new NtfyClient({
      ...config,
      onNotificationOpened: onNotificationOpened,
      canShowForegroundNotification: canShowForegroundWebNotification,
    })
  } catch (error) {
    console.log(new Error('Could not import NtfyClient'))
    return new NoopPushNotificationClient()
  }
}
