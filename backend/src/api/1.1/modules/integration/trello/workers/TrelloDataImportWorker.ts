import { Message, Connection } from 'amqplib';
import { injectable, inject, multiInject, named } from 'inversify'
import { MessageQueueModule } from '../../../messageQueue/MessageQueueModule';
import { InfrastructureModule } from '../../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../../infrastructure/logger';
import { CommonModule } from '../../../common/CommonModule';
import { JsonSerializerInterface } from '../../../common/json/JsonSerializerInterface';
import { IntegrationModule } from '../../IntegrationModule'
import {
  TrelloBoardListsInternalDataInterface,
  TrelloDataImportJobInterface,
  TrelloRootExternalDataInterface, TrelloRootInternalDataInterface,
} from '../types'
import { QueueDescriptorInterface } from '../../../messageQueue/interfaces/QueueDescriptorInterface'
import { AbstractAMQPWorker } from '../../../messageQueue/amqp/AbstractAMQPWorker'
import { DataImportSubWorkerInterface } from '../../interfaces/DataImportSubWorkerInterface'
import { DataImportQueueType, WorkerHandleStatus, IntegrationStatus } from '../../types';
import { IntegrationProviderInterface } from '../../interfaces/IntegrationProviderInterface';
import { WorkerOptionsInterface } from '../../../messageQueue/types';
import ErrorDefinitions, { Type } from '../../../common/ErrorDefinitions';

@injectable()
export class TrelloDataImportWorker extends AbstractAMQPWorker<Message> {

  constructor(
    @inject(MessageQueueModule.MessageQueueInstanceInterface)
      mqInstance: Connection,
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO)
      mainQueue: QueueDescriptorInterface,
    @inject(MessageQueueModule.WorkerOptionsInterface) @named('TrelloWorker')
      options: WorkerOptionsInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO_DELAYED)
      delayedQueue: QueueDescriptorInterface,
    @inject(CommonModule.JsonSerializerInterface)
      jsonSerializer: JsonSerializerInterface,
    @multiInject(IntegrationModule.TrelloDataImportSubWorker)
    private subWorkers: DataImportSubWorkerInterface<TrelloDataImportJobInterface, TrelloRootExternalDataInterface | TrelloBoardListsInternalDataInterface, TrelloRootInternalDataInterface | TrelloBoardListsInternalDataInterface>[],
    @inject(IntegrationModule.IntegrationProviderInterface)
    protected integrationProvider: IntegrationProviderInterface,
  ) {
    super(mqInstance, logger, options, jsonSerializer, [mainQueue, delayedQueue])
  }

  async delegateMessage(message: TrelloDataImportJobInterface): Promise<boolean> {
    const { extensionId, id, organizationId, type, userId } = message
    const jobDescriptor = `${type}/${id})`;
    this.logger.debug(`Trying registered trello data import sub-worker for job: ${jobDescriptor}`);
    for (const worker of this.subWorkers) {
      if (await worker.supports(message)) {
        this.logger.info(`Worker ${worker.constructor.name} supports ${jobDescriptor}.`);
        const { status, error } = await worker.handle(message);
        switch (status) {
          case WorkerHandleStatus.FAILED: {
            this.logger.error(error)
            await this.integrationProvider.setIntegrationStatus(extensionId, organizationId, userId, IntegrationStatus.FAILURE)
            return false
          }
          case WorkerHandleStatus.UNAUTHORIZED: {
            this.logger.error(ErrorDefinitions[Type.INVALID_AUTH_TOKEN])
            await this.integrationProvider.setIntegrationStatus(extensionId, organizationId, userId, IntegrationStatus.FAILURE)
            // ACK 401 message to not clog the queue
            return true
          }
          case WorkerHandleStatus.OK: {
            return true
          }
        }
      } else {
        this.logger.info(`Worker ${worker.constructor.name} does not support this job.`);
      }
    }

    return false;
  }
}
