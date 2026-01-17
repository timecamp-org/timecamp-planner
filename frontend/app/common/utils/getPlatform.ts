import { DeviceType } from '../models/domain/NotificationsModel/types'
import DesktopAppController from './desktopAppController'

export default (): DeviceType => {
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    const { Platform } = require('../../HeySpaceMobile/node_modules/react-native')
    return Platform.OS
  } else if (DesktopAppController.isDesktopApp()) {
    return DeviceType.DESKTOP_APP
  } else {
    return DeviceType.BROWSER
  }
}
