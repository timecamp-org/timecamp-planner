import * as Sentry from '../HeySpaceMobile/node_modules/@sentry/react-native'
import { SentryClientInterface } from './SentryClientInterface';
import { SentryUserData, SentryClientOptions } from './types';
import { AnyDict } from '../common/types';
import DeviceInfo from '../HeySpaceMobile/node_modules/react-native-device-info'

const defaultOptions = {
  release: DeviceInfo.getReadableVersion(),
}

export default class SentryNativeClient implements SentryClientInterface {
  private options: SentryClientOptions;
  
  constructor(
    config,
    filters,
  ) {
    this.options = { ...defaultOptions, ...config }
  }

  init() {
    Sentry.init({
      dsn: this.options.sentryDSN,
      ...this.options,
    })
  }

  setUserContext(userData: SentryUserData) {
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: userData.userId,
        username: userData.username,
        email: userData.email,
      })
    })
  }

  setExtraContext(context: AnyDict) {
    Sentry.configureScope((scope) => {
      Object.keys(context).forEach(key => {
        scope.setExtra(key, context[key])
      })
    });
  }

  captureException(error: Error, userData: SentryUserData, context: AnyDict) {
    this.setUserContext(userData)
    this.setExtraContext(context)
    Sentry.captureException(error)
  }

  isErrorPermittedToCapture(error: Error): boolean {
    throw new Error("Method not implemented.");
  }
}
