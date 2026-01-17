import { MessageOptions } from "../types";
import { QueueDescriptorInterface } from './QueueDescriptorInterface';
import { AnyDict } from '../../common/types';

export interface MessageQueuePublisherInterface {
  initialize(): PromiseLike<void>
  close(): Promise<void>
  publish(
    data: AnyDict, 
    queue: QueueDescriptorInterface, 
    messageOptions?: MessageOptions
  ): PromiseLike<void>
}