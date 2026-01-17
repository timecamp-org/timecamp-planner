import { injectable, inject } from 'inversify';
import { MessageOptions } from '../types'
import { Connection, Options } from 'amqplib';
import { MessageQueuePublisherInterface } from '../interfaces/MessageQueuePublisherInterface';
import { MessageQueueModule } from '../MessageQueueModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { CommonModule } from '../../common/CommonModule';
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface';
import { QueueDescriptorInterface } from '../interfaces/QueueDescriptorInterface';
import { AbstractAMQPPublisher } from './AbstractAMQPPublisher'
import { AnyDict } from '../../common/types';
import { ExchangeType, ExchangeName } from './types';

const DEFAULT_QUEUE_OPTIONS: Options.AssertQueue = {
  durable: true,
}

const ASSERT_DELAYED_EXCHANGE_DEFAULT_OPTIONS: Options.AssertExchange = {
  durable: true,
  arguments: { 'x-delayed-type': 'direct' }
}

@injectable()
export class AMQPDelayedPublisher extends AbstractAMQPPublisher
  implements MessageQueuePublisherInterface {

  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
      mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(CommonModule.JsonSerializerInterface)
      jsonSerializer: JsonSerializerInterface,
  ) {
    super(mqInstance, logger, jsonSerializer)
  }

  public async publish(
    data: AnyDict, 
    queue: QueueDescriptorInterface, 
    messageOptions?: MessageOptions
  ): Promise<void> {
    const queueName = queue.getName()
    this.logger.info(`Sending DELAYED message to "${queueName}" queue...`)
    try {
      const queueOptions = queue.getOptions()

      const assertExchange = await this.channel.assertExchange(
        ExchangeName.DELAYED,
        ExchangeType.DELAYED,
        ASSERT_DELAYED_EXCHANGE_DEFAULT_OPTIONS,
      )
      const assertQueue = await this.channel.assertQueue(
        queueName,
        { ...DEFAULT_QUEUE_OPTIONS, ...queueOptions }
      )
      // TODO: why binding queue to exchange is not enough?
      // TODO: we need to set routing-key to queueName because x-delayed-type set on
      // TODO: exchange is set to direct?
      await this.channel.bindQueue(queueName, ExchangeName.DELAYED, queueName)

      if (assertQueue && assertExchange) {
        const bufferedMessage = this.getPayload(data)
        await this.channel.publish(ExchangeName.DELAYED, queueName, bufferedMessage, messageOptions)
        this.logger.info(`Message sent to "${queueName}" queue.`)
      } else {
        this.logger.error('Invalid queue')
      }
    } catch (error) {
      this.logger.error(error)
    }

  }

}