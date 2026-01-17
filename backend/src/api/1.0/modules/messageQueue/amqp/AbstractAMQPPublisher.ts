import { injectable, inject } from 'inversify';
import { MessageQueuePublisherInterface } from '../interfaces/MessageQueuePublisherInterface'
import { Channel, Connection } from 'amqplib'
import { MessageQueueModule } from '../MessageQueueModule'
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule'
import { LoggerInterface } from '../../../../../infrastructure/logger'
import { CommonModule } from '../../common/CommonModule'
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface'
import { QueueDescriptorInterface } from '../interfaces/QueueDescriptorInterface'
import { MessageOptions } from '../types'
import { AnyDict } from '../../common/types';

@injectable()
export abstract class AbstractAMQPPublisher implements MessageQueuePublisherInterface {

  protected channel: Channel

  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
    protected mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(CommonModule.JsonSerializerInterface)
    protected jsonSerializer: JsonSerializerInterface,
  ) { }

  public async initialize(): Promise<void> {
    try {
      this.logger.info('Starting MQ Publisher...')

      this.channel = await this.mqInstance.createChannel()

      this.logger.info('Publisher started.')
    } catch (error) {
      this.logger.error(error)
    }
  }

  public async close(): Promise<void> {
    this.logger.info('Closing Publisher channel...')
    this.channel.close()
  }

  public abstract publish(
    data: AnyDict,
    queue: QueueDescriptorInterface,
    messageOptions?: MessageOptions
  ) : Promise<void>

  protected getPayload(data: AnyDict): Buffer {
    const message = this.jsonSerializer.toJson(data)
    return Buffer.from(message, 'utf-8')
  }


}