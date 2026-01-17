import { EntityHistory } from "./types";

export interface EntityHistoryServiceInterface<T> {

  getNewEntityHistory(
    entity: T,
    changes: Partial<T>,
    timestamp: number,
  ): EntityHistory<T>

}
