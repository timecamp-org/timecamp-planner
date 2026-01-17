import { Id } from 'common/utils/identifier';
import { ImmutableMap } from '../../../types';
export enum SumPeriod {
  DAILY = 'daily',
  TOTAL = 'total',
}

export interface TaskTimeEstimateInterface {
  minutes?: number;
  skipWeekends: boolean;
  sumPeriod: SumPeriod;
  taskId: Id;
  createdAt?: number;
  updatedAt?: number;
}

export enum TASK_ESTIMATES_STATE_KEYS {
  ESTIMATES_BY_TASK_ID = 'estimatesByTaskId',
}

export interface TaskTimeEstimateState extends ImmutableMap<TASK_ESTIMATES_STATE_KEYS, any> {
  [TASK_ESTIMATES_STATE_KEYS.ESTIMATES_BY_TASK_ID]: Map<Id, TaskTimeEstimateInterface>;
}

export interface DurationInterface {
  hours: number;
  minutes: number;
}
