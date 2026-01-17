import { AnyDict } from '../../common/types';
import { Channel } from 'amqplib';

export interface MessageQueueWorkerInterface<T> {
    initialize(): PromiseLike<void>;
    close(): PromiseLike<void>;
    listen(): PromiseLike<void>;
    onMessage(channel: Channel, message: T): PromiseLike<void>;
    delegateMessage(message: AnyDict): PromiseLike<boolean>;
}