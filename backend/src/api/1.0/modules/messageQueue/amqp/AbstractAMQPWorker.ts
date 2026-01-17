import { injectable, inject } from 'inversify';
import { Connection, Message, Channel } from 'amqplib';
import { MessageQueueModule } from '../MessageQueueModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { MessageQueueWorkerInterface } from '../interfaces/MessageQueueWorkerInterface';
import { QueueDescriptorInterface } from '../interfaces/QueueDescriptorInterface';
import { CommonModule } from '../../common/CommonModule';
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface';
import { AnyDict } from '../../common/types';
import { ChannelMap } from './types'
import { WorkerOptionsInterface } from '../types';


@injectable()
export abstract class AbstractAMQPWorker<T extends Message> implements MessageQueueWorkerInterface<T> {

  private channels: ChannelMap = {}

  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
    protected mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(MessageQueueModule.WorkerOptionsInterface)
    protected options: WorkerOptionsInterface,
    @inject(CommonModule.JsonSerializerInterface)
    private jsonSerializer: JsonSerializerInterface,
    protected queues: QueueDescriptorInterface[],
  ) { }

  public async initialize(): Promise<void> {
    try {
      this.logger.info('Starting MQ Worker...')
      for (const queue of this.queues) {
        await this.initializeChannel(queue)
      }
      this.logger.info('Worker started.')
    } catch (error) {
      this.logger.error(error)
    }
  }

  private async initializeChannel(queue: QueueDescriptorInterface): Promise<void> {
    const queueName = queue.getName()

    const channel = await this.mqInstance.createChannel()
    this.logger.info(`Channel created for ${queueName}`)
    this.channels[queueName] = channel

  }

  public async close(): Promise<void> {
    this.logger.info('Closing Worker channels...')
    for (const queue of this.queues) {
      await this.channels[queue.getName()].close()
    }
  }

  public async listen(): Promise<void> {
    try {
      for (const queue of this.queues) {
        const queueName = queue.getName()
        this.logger.info(`Listening on queue: ${queueName}...`)
        const channel = this.channels[queueName]
        await channel.assertQueue(queueName)
        if (this.options.maxConcurrentJobs) {
          await channel.prefetch(this.options.maxConcurrentJobs)
        }
        await channel.consume(queueName, this.onMessage.bind(this, channel))
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  public async onMessage(channel: Channel, message: T): Promise<void> {
    try {
      if (!message) {
        return
      }
      const parsedMessage = this.parseMessage(message)
      const jobHandled = await this.delegateMessage(parsedMessage)
      if (jobHandled) {
        channel.ack(message)
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  private parseMessage(message: T): AnyDict {
    return this.jsonSerializer.fromJson(message.content.toString())
  }

  public abstract delegateMessage(message: AnyDict): Promise<boolean>;

}
