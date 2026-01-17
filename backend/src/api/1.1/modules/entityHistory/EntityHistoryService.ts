import { EntityHistoryServiceInterface } from './EntityHistoryServiceInterface';
import { StringPropertiesOf } from '../common/types';
import { EntityHistory, EntityWithHistory } from './types';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';

export class EntityHistoryService<T extends EntityWithHistory<T>> implements EntityHistoryServiceInterface<T> {
  protected trackedFields: StringPropertiesOf<T>[];
  protected timeService: TimeServiceInterface;

  constructor(trackedFields: StringPropertiesOf<T>[], timeService: TimeServiceInterface) {
    this.trackedFields = trackedFields;
    this.timeService = timeService;
  }

  getNewEntityHistory(
    entity: T,
    changes: Partial<T>,
    timestamp = this.timeService.getCurrentEpoch()
  ): EntityHistory<T> {
    if (!entity) {
      return {} as EntityHistory<T>;
    }
    const newEntityHistory = (entity.entityHistory || {}) as EntityHistory<T>;

    this.trackedFields.forEach((fieldKey) => {
      if (changes.hasOwnProperty(fieldKey) && entity[fieldKey] !== changes[fieldKey]) {
        newEntityHistory[fieldKey] = timestamp;
      }
    });

    return newEntityHistory;
  }
}
