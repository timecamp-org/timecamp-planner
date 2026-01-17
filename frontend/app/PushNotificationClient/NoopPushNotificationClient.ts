import { PushNotificationClientInterface } from './PushNotificationClientInterface'
import { TokenRefreshListener } from './types'
import { DeviceType } from '../common/models/domain/NotificationsModel/types'
import { Maybe } from '../common/types'

export default class NoopPushNotificationClient implements PushNotificationClientInterface {
  init = async (): Promise<void> => {}

  onTokenRefresh = (listener: TokenRefreshListener): void => {
    if (listener) {
      listener(null)
    }
  }

  subscribeBackgroundNotificationClick = (): (() => PromiseLike<void>) => () => Promise.resolve()

  getDeviceInfo = async (): Promise<Maybe<{ deviceId: string; deviceType: DeviceType }>> => null

  requestPermission = async (): Promise<void> => {}

  getInitialNotification = async (): Promise<null> => null
}
