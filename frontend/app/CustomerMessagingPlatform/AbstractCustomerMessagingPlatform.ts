import handleError from '../common/utils/handleError';
import { CustomerMessagingPlatformInterface } from './CustomerMessagingPlatformInterface';
import { DataProviderInterface } from './types';

export abstract class AbstractCustomerMessagingPlatform<T> implements CustomerMessagingPlatformInterface {
  constructor(private isTrackingEnabled: boolean) {}

  abstract sendData(data: T): void;
  abstract getPayload(data: DataProviderInterface): T;

  public propagateData(data: DataProviderInterface): void {
    if (!this.isTrackingEnabled) {
      return;
    }

    try {
      const payload = this.getPayload(data);
      this.sendData(payload);
    } catch (error) {
      handleError(error);
    }
  }
}
