import { injectable } from 'inversify'

import { DeviceType } from '../db/schema'
import { NotificationMethod } from './types'

@injectable()
export class NotificationMethodMapper {

  deviceTypesForNotification(
    notificationMethod: NotificationMethod,
  ): DeviceType[] {

    switch(notificationMethod) {
      case NotificationMethod.MOBILE: {
        return [ DeviceType.MOBILE, DeviceType.IOS, DeviceType.ANDROID ]
        break
      }
      case NotificationMethod.PUSH: {
        return [ DeviceType.BROWSER, DeviceType.DESKTOP_APP ]
        break
      }
    }

  }
}
