import { Id } from '../../common/identifier';
import { TimeEntry, TimerStatus } from '../types';

export type TimeCampAction = 'start' | 'stop' | 'status';
export interface TimeCampTimerRequestData {
  action: TimeCampAction;
  external_task_id: string;
  note: string;
}

export interface TimeCampTimeEntryRequestData {
  task_id: string;
  duration?: number;
  date: string;
  start?: string;
  end?: string;
  note: string;
}

export interface TimeCampTimeEntriesRequestData {
  taskIds: Id[];
  startDate: string;
  endDate: string;
}

export interface TimerOptions {
  token: string;
  external_task_id: string;
  note: string;
  action: TimeCampAction;
}

export interface CreateEntryOptions {
  token: string;
  task_id: string;
  date: string;
  duration?: number;
  start?: string;
  end?: string;
  note: string;
}

export interface GetEntryOptions {
  token: string;
  taskId: Id;
}

export interface TimeCampApiInterface {
  startTimer(timerOptions: TimerOptions): Promise<void>;
  stopTimer(timerOptions: TimerOptions): Promise<void>;
  getTimerStatus(timerOptions: TimerOptions): Promise<TimerStatus>;

  getTimeEntries({ token, taskId }: GetEntryOptions): Promise<TimeEntry[]>;
  createTimeEntry({
    token,
    task_id,
    start,
    end,
    duration,
    date,
  }: CreateEntryOptions): Promise<CreateTimeEntryRequestResult>;
  getTaskIdFromExternalTaskId({ token, taskId }): Promise<TimeCampTaskInfoResponse>;
}

export interface TimeCampTaskInfoResponse {
  task_id: string;
  parent_id: string;
  assigned_by: string;
  name: string;
  external_task_id: null;
  external_parent_id: null;
  level: string;
  archived: string;
  tags: string;
  budgeted: string;
  budget_unit: string;
  root_group_id: string;
  billable: string;
  note: string;
  public_hash: string;
  add_date: string;
  modify_time: string;
  color: string;
  users: {
    [userId: string]: {
      user_id: string;
      role_id: string;
    };
  };
  user_access_type: number;
}

export interface CreateTimeEntryRequestResult {
  entry_id: number;
}
