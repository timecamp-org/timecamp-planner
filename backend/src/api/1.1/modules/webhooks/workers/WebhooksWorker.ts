import { inject, injectable, multiInject, named } from 'inversify';

import { Connection, Message } from 'amqplib';
import { WebhookModule } from '../WebhookModule';

import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { WebhooksSubworkerInterface } from '../interfaces/WebhooksSubworkerInterface';

import { CommonModule } from '../../common/CommonModule';
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface';
import { WebhooksJobInterface } from '../types';
import { AbstractAMQPWorker } from '../../messageQueue/amqp/AbstractAMQPWorker';
import { MessageQueueModule } from '../../messageQueue/MessageQueueModule';
import { QueueDescriptorInterface } from '../../messageQueue/interfaces/QueueDescriptorInterface';
import { WorkerOptionsInterface } from '../../messageQueue/types';

@injectable()
export class WebhooksWorker extends AbstractAMQPWorker<Message> {
  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
    mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
    logger: LoggerInterface,
    @multiInject(WebhookModule.WebhooksQueue)
    queues: QueueDescriptorInterface[],
    @inject(CommonModule.JsonSerializerInterface)
    jsonSerializer: JsonSerializerInterface,
    @inject(MessageQueueModule.WorkerOptionsInterface)
    @named('WebhooksWorker')
    options: WorkerOptionsInterface,
    @multiInject(WebhookModule.WebhookSubworkers)
    private subWorkers: WebhooksSubworkerInterface[]
  ) {
    super(mqInstance, logger, options, jsonSerializer, queues);
  }
  public async delegateMessage(message: WebhooksJobInterface): Promise<boolean> {
    const jobDescriptor = `${message.type}/${message.id})`;
    this.logger.debug(`Trying registered webhooks sub-worker for job: ${jobDescriptor}`);
    try {
      for (const worker of this.subWorkers) {
        if (await worker.supports(message)) {
          this.logger.info(`Worker ${worker.constructor.name} supports ${jobDescriptor}.`);
          await worker.handle(message);
          return true;
        } else {
          this.logger.info(`Worker ${worker.constructor.name} does not support this job.`);
        }
      }
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
