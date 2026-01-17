import { injectable, inject, named } from 'inversify'
import { IntegrationServiceInterface } from '../interfaces/IntegrationServiceInterface';
import { Id } from '../../common/identifier';
import { IntegrationProviderInterface } from '../interfaces/IntegrationProviderInterface';
import { IntegrationModule } from '../IntegrationModule';
import { DataImportQueueType } from '../types'
import { TrelloApiInterface } from './interfaces/TrelloApiInterface';
import { AbstractDataImportService } from '../AbstractDataImportService';
import { DataImportProjectServiceInterface } from '../dataImportEntityService/interfaces/DataImportProjectServiceInterface';
import { DataImportListServiceInterface } from '../dataImportEntityService/interfaces/DataImportListServiceInterface';
import { DataImportTaskServiceInterface } from '../dataImportEntityService/interfaces/DataImportTaskServiceInterface';
import { DataImportTagServiceInterface } from '../dataImportEntityService/interfaces/DataImportTagServiceInterface';
import { DataImportChecklistServiceInterface } from '../dataImportEntityService/interfaces/DataImportChecklistServiceInterface';
import { DataImportUserInProjectServiceInterface } from '../dataImportEntityService/interfaces/DataImportUserInProjectServiceInterface';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import { CommonModule } from '../../common/CommonModule';
import { QueueDescriptorInterface } from '../../messageQueue/interfaces/QueueDescriptorInterface'
import { TrelloDataImportJobFactoryInterface } from './interfaces/TrelloDataImportJobFactoryInterface'
import { MessageQueueModule } from '../../messageQueue/MessageQueueModule'
import { JobStatusServiceInterface } from '../../messageQueue/interfaces/JobStatusServiceInterface'
import { MessageQueuePublisherInterface } from '../../messageQueue/interfaces/MessageQueuePublisherInterface'
import { JobNamespace } from '../../messageQueue/types';

@injectable()
export class TrelloDataImportService extends AbstractDataImportService implements IntegrationServiceInterface {

  protected integrationProvider: IntegrationProviderInterface;
  protected trelloApi: TrelloApiInterface;
  protected logger: LoggerInterface;
  protected timeService: TimeServiceInterface;

  constructor(
    @inject(IntegrationModule.DataImportProjectServiceInterface) integrationProjectService: DataImportProjectServiceInterface,
    @inject(IntegrationModule.DataImportListServiceInterface) integrationListService: DataImportListServiceInterface,
    @inject(IntegrationModule.DataImportTaskServiceInterface) integrationTaskService: DataImportTaskServiceInterface,
    @inject(IntegrationModule.DataImportChecklistServiceInterface) integrationChecklistService: DataImportChecklistServiceInterface,
    @inject(IntegrationModule.DataImportTagServiceInterface) integrationTagService: DataImportTagServiceInterface,
    @inject(IntegrationModule.DataImportUserInProjectServiceInterface) integrationUserInProjectService: DataImportUserInProjectServiceInterface,
    @inject(IntegrationModule.IntegrationProviderInterface) integrationProvider: IntegrationProviderInterface,
    @inject(IntegrationModule.TrelloApiInterface) trelloApi: TrelloApiInterface,
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
    @inject(MessageQueueModule.MessageQueuePublisherInterface)
    private mqPublisher: MessageQueuePublisherInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO)
    private queue: QueueDescriptorInterface,
    @inject(IntegrationModule.TrelloDataImportJobFactoryInterface)
    private jobFactory: TrelloDataImportJobFactoryInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    private jobStatusService: JobStatusServiceInterface,
  ) {
    super(
      integrationProvider,
      integrationProjectService,
      integrationListService,
      integrationTaskService,
      integrationChecklistService,
      integrationTagService,
      integrationUserInProjectService,
      logger,
    )
    this.integrationProvider = integrationProvider
    this.trelloApi = trelloApi
    this.timeService = timeService
  }

  async startRootJob(userId: Id, organizationId: Id, extensionId: Id): Promise<void> {
    await this.jobStatusService.startNewJobIteration(JobNamespace.TRELLO_DATA_IMPORT, userId, organizationId)
    const job = this.jobFactory.createRootJob(userId, organizationId, extensionId)
    await this.mqPublisher.publish(job, this.queue)
    await this.jobStatusService.incrementSpawnedJobs(JobNamespace.TRELLO_DATA_IMPORT, userId, organizationId, 1)
  }


}
