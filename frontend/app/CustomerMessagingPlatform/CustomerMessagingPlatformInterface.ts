import { DataProviderInterface } from './types';

export interface CustomerMessagingPlatformInterface {
  propagateData(data: DataProviderInterface): void;
}
