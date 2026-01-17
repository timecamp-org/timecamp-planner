import { AnyDict } from '../../common/types';
import { MessageOptions } from '../types';
import { MessageQueuePublisherInterface } from './MessageQueuePublisherInterface';
import { QueueDescriptorInterface } from './QueueDescriptorInterface';
import { RetryMessageQueuePublisherOptionsInterface } from './RetryMessageQueuePublisherOptionsInterface';

export interface RetryMessageQueuePublisherInterface
  extends Pick<MessageQueuePublisherInterface, 'close' | 'initialize'> {
  publish(
    data: AnyDict,
    queue: QueueDescriptorInterface,

    messageOptions?: MessageOptions,
    exchangeName?: string,
    exchangeQueue?: string
  ): PromiseLike<void>;
  retryPublisherOptions: RetryMessageQueuePublisherOptionsInterface;
}
