import { injectable, inject } from 'inversify';
import { MessageOptions, QueueOptions } from '../types'
import { Connection } from 'amqplib';
import { MessageQueuePublisherInterface } from '../interfaces/MessageQueuePublisherInterface';
import { MessageQueueModule } from '../MessageQueueModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { CommonModule } from '../../common/CommonModule';
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface';
import { QueueDescriptorInterface } from '../interfaces/QueueDescriptorInterface';
import { AbstractAMQPPublisher } from './AbstractAMQPPublisher'
import { AnyDict } from '../../common/types';

const DEFAULT_QUEUE_OPTIONS: QueueOptions = {
  durable: true,
}

@injectable()
export class AMQPPublisher extends AbstractAMQPPublisher
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
    this.logger.info(`Sending message to "${queueName}" queue...`)
    try {
      const queueOptions = queue.getOptions()
      const assertQueue = await this.channel.assertQueue(queueName, { ...DEFAULT_QUEUE_OPTIONS, ...queueOptions })
      if (assertQueue) {
        const bufferedMessage = this.getPayload(data)
        await this.channel.sendToQueue(queueName, bufferedMessage, messageOptions)
        this.logger.info(`Message sent to "${queueName}" queue.`)
      } else {
        this.logger.error('Invalid queue')
      }
    } catch (error) {
      this.logger.error(error)
    }

  }

}