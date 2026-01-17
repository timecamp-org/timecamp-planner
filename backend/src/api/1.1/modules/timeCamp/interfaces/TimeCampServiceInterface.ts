import { Id } from '../../common/identifier';
import {
  CreateTimeEntryResult,
  GetTimeEntriesResult,
  HasTokenResult,
  TimeCampTimerAction,
  TimerActionResult,
} from '../types';

export interface TimerActionInterface {
  userId: Id;
  taskId: Id;
  action: TimeCampTimerAction;
}

export interface GetTimeEntryOptions {
  userId: Id;
  taskId: Id;
}

export interface TimeCampServiceInterface {
  timerAction({ userId, taskId, action }: TimerActionInterface): Promise<TimerActionResult>;
  hasToken({ userId, organizationId }): Promise<HasTokenResult>;
  createTimeEntry({ userId, taskId, start, end, duration, date }): Promise<CreateTimeEntryResult>;
  getTimeEntries({ userId, taskId }: GetTimeEntryOptions): Promise<GetTimeEntriesResult>;
}
