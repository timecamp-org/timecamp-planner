import { MessageQueueInstanceInterface } from '../interfaces/MessageQueueInstanceInterface';
import { injectable, inject } from 'inversify';
import { MessageQueueModule } from '../MessageQueueModule';
import { MessageQueueOptions } from '../types';
import * as amqp from 'amqplib'
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';

@injectable()
export class AMQPInstance implements MessageQueueInstanceInterface {
  private connection: amqp.Connection
  
  constructor(
    @inject(MessageQueueModule.MessageQueueOptions)
    private options: MessageQueueOptions,
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
  ) {
  }

  async connect(): Promise<void> {
    this.logger.info(`Connecting to amqp instance ${this.options.amqp.hostname} ...`)
    this.connection = await amqp.connect({
      hostname: this.options.amqp.hostname,
      username: this.options.amqp.username,
      password: this.options.amqp.password,
      vhost: this.options.amqp.vhost,
      port: this.options.amqp.port,
    })
    this.logger.info(`Connected to ${this.options.amqp.hostname}`)
  }

  async disconnect(): Promise<void> {
    this.logger.info(`Disconnecting from ${this.options.amqp.hostname} instance...`)
    this.connection.close()
  }

  getInstance(): amqp.Connection {
    return this.connection
  }

  async createChannel(): Promise<amqp.Channel> {
    this.logger.info('Creating channel ...')
    return await this.connection.createChannel()
  }
}