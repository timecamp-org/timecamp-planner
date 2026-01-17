import { EntityHistoryServiceInterface } from './EntityHistoryServiceInterface';
import { StringPropertiesOf } from '../common/types';
import { EntityWithHistory } from './types';

export interface EntityHistoryServiceFactoryInterface {

  create<T extends EntityWithHistory<T>>(trackedFields: (StringPropertiesOf<T>)[]): EntityHistoryServiceInterface<T>

}
