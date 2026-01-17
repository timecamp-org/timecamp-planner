import { Platform } from 'react-native'

const isIOS = Platform.OS === 'ios'
export const isIOS13 = Boolean(isIOS && parseInt(`${Platform.Version}`, 10) >= 13)

export const getPlatformSpecificModule = <T = any>(iOSModule: T, androidModule: T): T => {
  switch (isIOS) {
    case true: {
      return iOSModule
    }
    case false: {
      return androidModule
    }
  }
}

export default isIOS
