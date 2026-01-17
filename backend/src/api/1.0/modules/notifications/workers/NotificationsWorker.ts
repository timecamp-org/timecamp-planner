import { AbstractAMQPWorker } from '../../messageQueue/amqp/AbstractAMQPWorker';
import { Message, Connection } from 'amqplib';
import { NotificationsJobInterface } from '../types';
import { injectable, inject, multiInject, named } from 'inversify';
import { MessageQueueModule } from '../../messageQueue/MessageQueueModule';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { NotificationsModule } from '../NotificationsModule';
import { QueueDescriptorInterface } from '../../messageQueue/interfaces/QueueDescriptorInterface';
import { CommonModule } from '../../common/CommonModule';
import { JsonSerializerInterface } from '../../common/json/JsonSerializerInterface';
import { NotificationsSubWorkerInterface } from '../interfaces/NotificationsSubWorkerInterface';
import { WorkerOptionsInterface } from '../../messageQueue/types';

@injectable()
export class NotificationsWorker extends AbstractAMQPWorker<Message> {

  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
      mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @multiInject(NotificationsModule.NotificationsQueue)
      queues: QueueDescriptorInterface[],
    @inject(MessageQueueModule.WorkerOptionsInterface) @named('NotificationsWorker')
      options: WorkerOptionsInterface,
    @inject(CommonModule.JsonSerializerInterface)
      jsonSerializer: JsonSerializerInterface,
    @multiInject(NotificationsModule.NotificationsSubWorker)
    private subWorkers: NotificationsSubWorkerInterface[],
  ) {
    super(mqInstance, logger, options, jsonSerializer, queues)
  }

  async delegateMessage(message: NotificationsJobInterface): Promise<boolean> {
    const jobDescriptor = `${message.type}/${message.id})`;
    this.logger.debug(`Trying registered notif. sub-worker for job: ${jobDescriptor}`);
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

      return false;
    } catch (error) {
      this.logger.error(error)
      return false
    }
  }
}
