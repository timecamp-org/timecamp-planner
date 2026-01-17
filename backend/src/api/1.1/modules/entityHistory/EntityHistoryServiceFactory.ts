import { injectable, inject } from 'inversify';
import { EntityHistoryServiceFactoryInterface } from './EntityHistoryServiceFactoryInterface';
import { EntityHistoryService } from './EntityHistoryService';
import { EntityHistoryServiceInterface } from './EntityHistoryServiceInterface';
import { StringPropertiesOf } from '../common/types';
import { EntityWithHistory } from './types';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { CommonModule } from '../common/CommonModule';

@injectable()
export class EntityHistoryServiceFactory implements EntityHistoryServiceFactoryInterface {

  protected timeService: TimeServiceInterface

  constructor(
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
  ) {
    this.timeService = timeService
  }

  create<T extends EntityWithHistory<T>>(trackedFields: (StringPropertiesOf<T>)[]): EntityHistoryServiceInterface<T> {
    return new EntityHistoryService<T>(trackedFields, this.timeService)
  }

}
