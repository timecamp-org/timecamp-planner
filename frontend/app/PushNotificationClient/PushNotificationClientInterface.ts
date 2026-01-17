import {
  DeviceInfo,
  PushNotificationMessage,
  PushNotification,
  TokenRefreshListener,
} from './types'
import { Maybe } from '../common/types'

export interface PushNotificationClientInterface {
  init(): PromiseLike<void>;

  onMessage?(message: PushNotificationMessage): void;

  onNotification?(notification: PushNotification): void;

  subscribeBackgroundNotificationClick(): () => PromiseLike<void>;

  onTokenRefresh(listener: TokenRefreshListener): void;

  getDeviceInfo(): PromiseLike<Maybe<DeviceInfo>>;

  requestPermission(): PromiseLike<void>;

  getInitialNotification?(): PromiseLike<PushNotification | null>;
}

