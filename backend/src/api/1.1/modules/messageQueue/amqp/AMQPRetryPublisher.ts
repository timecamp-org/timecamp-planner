import { inject, injectable } from 'inversify';

import { Connection } from 'amqplib';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { CommonModule } from '../../common/CommonModule';
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface';
import { AnyDict } from '../../common/types';
import { MessageQueueModule } from '../MessageQueueModule';
import { DEFAULT_RETRY_QUEUE_ARGUMENTS } from '../const';
import { QueueDescriptorInterface } from '../interfaces/QueueDescriptorInterface';
import { RetryMessageQueuePublisherInterface } from '../interfaces/RetryMessageQueuePublisherInterface';
import { RetryMessageQueuePublisherOptionsInterface } from '../interfaces/RetryMessageQueuePublisherOptionsInterface';
import { MessageOptions } from '../types';
import { getRetryQueueName } from '../utils';
import { AbstractAMQPPublisher } from './AbstractAMQPPublisher';
import { ExchangeName, ExchangeType } from './types';

@injectable()
export class AMQPRetryPublisher extends AbstractAMQPPublisher implements RetryMessageQueuePublisherInterface {
  retryPublisherOptions: RetryMessageQueuePublisherOptionsInterface;
  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
    mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @inject(CommonModule.JsonSerializerInterface)
    jsonSerializer: JsonSerializerInterface
  ) {
    super(mqInstance, logger, jsonSerializer);
    this.retryPublisherOptions = null;
  }

  public async publish(
    data: AnyDict,
    queue: QueueDescriptorInterface,
    messageOptions?: MessageOptions,
    exchangeName?: string,
    routingQueueName?: string
  ): Promise<void> {
    const queueName = queue.getName();
    try {
      await this.channel.assertExchange(ExchangeName.RETRY, ExchangeType.FANOUT, { durable: true });
      await this.channel.assertExchange(ExchangeName.TTL, ExchangeType.DIRECT, { durable: true });
      await this.channel.assertExchange(ExchangeName.DLX, ExchangeType.FANOUT, { durable: true });

      this.retryPublisherOptions.retryQueues.forEach(async ({ messageTtl }, index) => {
        const retryQueueName = getRetryQueueName(index + 1);
        await this.channel.assertQueue(retryQueueName, {
          durable: true,
          deadLetterExchange: ExchangeName.DLX,
          messageTtl,
          arguments: DEFAULT_RETRY_QUEUE_ARGUMENTS,
        });
        await this.channel.bindQueue(retryQueueName, ExchangeName.TTL, retryQueueName);
      });

      await this.channel.bindQueue(queueName, ExchangeName.RETRY, queueName);
      await this.channel.bindQueue(queueName, ExchangeName.DLX, queueName);

      const bufferedMessage = this.getPayload(data);

      await this.channel.publish(exchangeName, routingQueueName, bufferedMessage, messageOptions);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
