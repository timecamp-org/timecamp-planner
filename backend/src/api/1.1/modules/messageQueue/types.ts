import { Id } from '../common/identifier';
import { AnyDict } from '../common/types';
import { AMQPOptions } from './amqp/types';

export interface MessageQueueOptions {
  amqp: AMQPOptions;
}

export interface MessageOptions {
  persistent: boolean;
  headers?: AnyDict;
}

export interface QueueOptions {
  durable: boolean;
}

export type JobType = string;

export enum JobNamespace {
  ARCHIVE_NOTIFICATIONS = 'archive_notifications',
  TRELLO_DATA_IMPORT = 'trello_data_import',
  DETERMINE_ORDER_FOR_UNARCHIVED_SPACE = 'determine_order_for_unarchived_space',
  SEND_WEBHOOK = 'send_webhook',
}

export interface JobInterface<T> {
  id: Id;
  type: T;
}

export interface WorkerOptionsInterface {
  maxConcurrentJobs?: number;
}
