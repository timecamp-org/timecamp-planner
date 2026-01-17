import { Id } from 'common/utils/identifier';

export interface TaskTimerInterface {
  taskId?: Id;
  startedAt?: Date;
  isRunning: boolean;
}

export interface TimeEntryInterface {
  taskId: Id;
  from?: string;
  to?: string;
  elapsed?: number;
}

export interface DurationEntryInterface {
  taskId: Id;
  date: string;
  duration: number;
}

export interface ElapsedTimeByTask {
  [taskId: string]: number;
}

export type TimeEntryAction = 'start' | 'stop' | 'status';

export enum TIMECAMP_STATE_KEYS {
  ELAPSED_TIME_BY_TASK_ID = 'elapsedTimeByTaskId',
  HAS_INTEGRATION_BY_ORGANIZATION_ID = 'hasIntegrationByOrganizationId',
  CURRENT_TIMER = 'currentTimer',
}

export interface TimecampTimerState {
  [TIMECAMP_STATE_KEYS.ELAPSED_TIME_BY_TASK_ID]: ElapsedTimeByTask;
  [TIMECAMP_STATE_KEYS.HAS_INTEGRATION_BY_ORGANIZATION_ID]: { [organizationId: string]: boolean };
  [TIMECAMP_STATE_KEYS.CURRENT_TIMER]: TaskTimerInterface | null;
}
