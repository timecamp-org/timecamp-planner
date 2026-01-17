import {
  TrelloBoardLabelsExternalDataInterface,
  TrelloBoardLabelsInternalDataInterface,
  TrelloDataImportJobType,
  TrelloImportBoardLabelsJobInterface,
} from '../types'
import { AbstractDataImportSubWorker } from '../../AbstractDataImportSubWorker'
import {
  APIRateLimitDelay,
  DataImportQueueType, ExternalEntityType,
  FetchExternalDataResult,
  FetchExternalDataResultStatus,
} from '../../types'
import { inject, named } from 'inversify'
import { InfrastructureModule } from '../../../../../../infrastructure/InfrastructureModule'
import { LoggerInterface } from '../../../../../../infrastructure/logger'
import { MessageQueueModule } from '../../../messageQueue/MessageQueueModule'
import { JobStatusServiceInterface } from '../../../messageQueue/interfaces/JobStatusServiceInterface'
import { IntegrationModule } from '../../IntegrationModule'
import { TrelloApiInterface } from '../interfaces/TrelloApiInterface'
import { MessageQueuePublisherInterface } from '../../../messageQueue/interfaces/MessageQueuePublisherInterface'
import { QueueDescriptorInterface } from '../../../messageQueue/interfaces/QueueDescriptorInterface'
import { TrelloDataMapperInterface } from '../interfaces/TrelloDataMapperInterface'
import { ExistingEntitiesServiceInterface } from '../../interfaces/ExistingEntitiesServiceInterface'
import { DataImportTagServiceInterface } from '../../dataImportEntityService/interfaces/DataImportTagServiceInterface'

import { TrelloDataImportJobFactoryInterface } from '../interfaces/TrelloDataImportJobFactoryInterface'
import { JobNamespace, MessageOptions } from '../../../messageQueue/types'
import { ConnectionInterface } from '../../../db/ConnectionInterface'
import { DbModule } from '../../../db/DbModule'
import { ExternalAPIRateLimitsServiceInterface } from '../../interfaces/ExternalAPIRateLimitsServiceInterface';
import { TrelloApiErrorHandlerInterface } from '../interfaces/TrelloApiErrorHandlerInterface'

export class TrelloDataImportBoardLabelsWorker extends AbstractDataImportSubWorker<TrelloImportBoardLabelsJobInterface, TrelloBoardLabelsExternalDataInterface, TrelloBoardLabelsInternalDataInterface> {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    jobStatusService: JobStatusServiceInterface,
    @inject(IntegrationModule.TrelloApiInterface)
    private trelloApi: TrelloApiInterface,
    @inject(MessageQueueModule.DelayedMessageQueuePublisherInterface)
    protected mqDelayedPublisher: MessageQueuePublisherInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO_DELAYED)
    protected delayedQueue: QueueDescriptorInterface,
    @inject(IntegrationModule.ExternalAPIRateLimitsService)
    protected apiRateLimitsService: ExternalAPIRateLimitsServiceInterface,
    @inject(IntegrationModule.TrelloDataMapper)
    private trelloDataMapper: TrelloDataMapperInterface,
    @inject(IntegrationModule.DataImportTagServiceInterface)
    private dataImportTagService: DataImportTagServiceInterface,
    @inject(IntegrationModule.ExistingEntitiesServiceInterface)
    private existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(IntegrationModule.TrelloDataImportJobFactoryInterface)
    private jobFactory: TrelloDataImportJobFactoryInterface,
    @inject(MessageQueueModule.MessageQueuePublisherInterface)
    private mqPublisher: MessageQueuePublisherInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO)
    private queue: QueueDescriptorInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(IntegrationModule.TrelloApiErrorHandlerInterface)
    private apiErrorHandler: TrelloApiErrorHandlerInterface,
    @inject(MessageQueueModule.DelayedQueueMessageOptionsFactory)
    delayedQueueMessageOptionsFactory: (delay: number) => MessageOptions
  ) {
    super(
      TrelloDataImportJobType.BOARD_LABELS_IMPORT,
      JobNamespace.TRELLO_DATA_IMPORT,
      APIRateLimitDelay.TRELLO,
      logger,
      jobStatusService,
      apiRateLimitsService,
      mqDelayedPublisher,
      delayedQueue,
      delayedQueueMessageOptionsFactory,
    )
  }

  async fetchData(job: TrelloImportBoardLabelsJobInterface): Promise<FetchExternalDataResult<TrelloBoardLabelsExternalDataInterface>> {
    try {
      const { userId, organizationId, boardId } = job
      const labelsData = await this.trelloApi.fetchBoardLabelsData(boardId, organizationId, userId)

      return {
        status: FetchExternalDataResultStatus.OK,
        result: { labelsData },
      }
    } catch (error) {
      return this.apiErrorHandler.handleError(job, error)
    }
  }

  async filterOutExistingData(
    externalData: TrelloBoardLabelsExternalDataInterface, 
    job: TrelloImportBoardLabelsJobInterface,
  ): Promise<TrelloBoardLabelsExternalDataInterface> {
    const { organizationId, extensionId } = job
    const tagInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.TAG)

    return {
      labelsData: externalData.labelsData
        .filter(externalTag => {
          const tagAlreadyImported = tagInternalIdByExternalId[externalTag.id]
          return !tagAlreadyImported
        })
    }
  }

  parseData(externalData: TrelloBoardLabelsExternalDataInterface, job: TrelloImportBoardLabelsJobInterface): TrelloBoardLabelsInternalDataInterface {
    const tags = externalData.labelsData
      .map(this.trelloDataMapper.translateTrelloTag)

    return {
      tags,
    }
  }

  async insertData(
    parsedData: TrelloBoardLabelsInternalDataInterface, 
    job: TrelloImportBoardLabelsJobInterface,
  ): Promise<void> {
    const { tags } = parsedData
    if (tags.length === 0) {
      return
    }
    const { extensionId, organizationId } = job
    await this.connection.getConnection().transaction(async (trx: Transaction) => {
      await this.dataImportTagService.createTags(
        extensionId,
        organizationId,
        tags,
        trx
      )
    })
  }

  async spawnNewJobs(
    externalData: TrelloBoardLabelsExternalDataInterface, 
    job: TrelloImportBoardLabelsJobInterface,
  ): Promise<number> {
    const { userId, organizationId, boardId, extensionId } = job
    const newJob = this.jobFactory.createBoardListsImportJob(userId, organizationId, extensionId, boardId)

    await this.mqPublisher.publish(newJob, this.queue)
    return 1
  }

}
