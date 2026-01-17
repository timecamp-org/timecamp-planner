import { Id } from '../../common/identifier';
import { TaskTimeEstimateDbRow } from '../../db/schema';

export interface TaskTimeEstimatesProviderInterface {
  createEstimate(payload: Partial<TaskTimeEstimateDbRow>, trx?: Transaction): PromiseLike<TaskTimeEstimateDbRow>;

  updateEstimate(payload: Partial<TaskTimeEstimateDbRow>, trx?: Transaction): PromiseLike<TaskTimeEstimateDbRow>;

  deleteEstimate(taskId: Id, trx?: Transaction): PromiseLike<void>;

  getEstimate(taskId: Id, trx?: Transaction): PromiseLike<TaskTimeEstimateDbRow>;

  getEstimates(taskIds: Id[], trx?: Transaction): PromiseLike<TaskTimeEstimateDbRow[]>;
}
