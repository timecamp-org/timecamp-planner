import { Id } from '../common/identifier';
import { FileDbRow } from './schema';

export type DbValue = string | number | boolean | Date;
export type DbRow = { [_: string]: DbValue };

// https://www.postgresql.org/docs/9.1/plpgsql-trigger.html
export enum NotificationAction {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface NotificationPayload {
  table: string;
  action: NotificationAction;
  id: string;
  optionalId?: string;
}

export interface WithTaskId {
  taskId?: Id;
}

export interface FileWithTaskId extends FileDbRow, WithTaskId {}
