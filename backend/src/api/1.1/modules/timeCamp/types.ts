import { Id } from '../common/identifier';

export type TimeCampTimerAction = 'start' | 'stop' | 'status';

export interface TimerStatus {
  browser_plugin_button_hash: string;
  elapsed: number;
  entry_id: string;
  external_task_id: Id;
  isTimerRunning: boolean;
  note: string;
  start_time: string;
  timer_id: string;
}

export interface TimeEntryTag {
  tagListName: string;
  tagListId: string;
  tagId: string;
  name: string;
  mandatory: string;
}

export interface TimeEntry {
  id: number;
  duration: number; // in miliseconds
  user_id: number;
  user_name: string;
  task_id: number;
  last_modify: string;
  date: string;
  start_time: string;
  end_time: string;
  locked: string;
  name: string;
  addons_external_id: string;
  billable: number;
  invoiceId: string;
  color: string;
  description: string;
  tags: TimeEntryTag[];
  hasEntryLocationHistory: false;
}

export enum HasTokenStatus {
  OK,
  TOKEN_NOT_FOUND,
}

export interface HasTokenResult {
  status: HasTokenStatus;
}

export enum GetTimeEntriesStatus {
  OK,
  TOKEN_NOT_FOUND,
  TASK_NOT_FOUND,
}
export interface GetTimeEntriesResult {
  status: GetTimeEntriesStatus;
  timeEntries?: TimeEntry[];
}

export enum CreateTimeEntryStatus {
  OK,
  TOKEN_NOT_FOUND,
  TASK_NOT_FOUND,
}

export interface CreateTimeEntryResult {
  status: CreateTimeEntryStatus;
  timeEntryId?: number;
}

export enum TimerActionStatus {
  OK,
  TOKEN_NOT_FOUND,
  TASK_NOT_FOUND,
}

export interface TimerActionResult {
  status: TimerActionStatus;
  timerActionResult?: TimerStatus;
}
