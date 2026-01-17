import { AbstractDataImportSubWorker } from '../../AbstractDataImportSubWorker'
import {
  TrelloBoardListsExternalDataInterface,
  TrelloBoardListsInternalDataInterface,
  TrelloDataImportJobType,
  TrelloImportBoardListsJobInterface,
} from '../types'
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
import { DataImportListServiceInterface } from '../../dataImportEntityService/interfaces/DataImportListServiceInterface'

import { JobNamespace, MessageOptions } from '../../../messageQueue/types'
import { TrelloDataImportJobFactoryInterface } from '../interfaces/TrelloDataImportJobFactoryInterface'
import { ConnectionInterface } from '../../../db/ConnectionInterface'
import { DbModule } from '../../../db/DbModule'
import { ExternalAPIRateLimitsServiceInterface } from '../../interfaces/ExternalAPIRateLimitsServiceInterface';
import { TrelloApiErrorHandlerInterface } from '../interfaces/TrelloApiErrorHandlerInterface'

export class TrelloDataImportBoardListsWorker extends AbstractDataImportSubWorker<TrelloImportBoardListsJobInterface, TrelloBoardListsExternalDataInterface, TrelloBoardListsInternalDataInterface> {

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
    @inject(IntegrationModule.DataImportListServiceInterface)
    private dataImportListService: DataImportListServiceInterface,
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
      TrelloDataImportJobType.BOARD_LISTS_IMPORT,
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

  async fetchData(job: TrelloImportBoardListsJobInterface): Promise<FetchExternalDataResult<TrelloBoardListsExternalDataInterface>> {
    try {
      const { userId, organizationId, boardId } = job
      const listsData = await this.trelloApi.fetchBoardListsData(boardId, organizationId, userId)
      return {
        status: FetchExternalDataResultStatus.OK,
        result: { listsData },
      }
    } catch (error) {
      return this.apiErrorHandler.handleError(job, error)
    }
  }

  async filterOutExistingData(
    externalData: TrelloBoardListsExternalDataInterface,
    job: TrelloImportBoardListsJobInterface,
  ): Promise<TrelloBoardListsExternalDataInterface> {
    const { organizationId, extensionId } = job
    const listInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.LIST)

    return {
      listsData: externalData.listsData
        .filter(externalList => {
          const listAlreadyImported = listInternalIdByExternalId[externalList.id]
          return !listAlreadyImported
        })
    }
  }

  parseData(externalData: TrelloBoardListsExternalDataInterface, job: TrelloImportBoardListsJobInterface): TrelloBoardListsInternalDataInterface {
    const lists = externalData.listsData
      .map(this.trelloDataMapper.translateTrelloList)

    return {
      lists
    }
  }

  async insertData(
    parsedData: TrelloBoardListsInternalDataInterface,
    job: TrelloImportBoardListsJobInterface,
  ): Promise<void> {
    const { lists } = parsedData
    if (lists.length === 0) {
      return
    }
    const { userId, organizationId, extensionId } = job
    await this.connection.getConnection().transaction(async (trx: Transaction) => {
      await this.dataImportListService.createLists(
        extensionId,
        organizationId,
        userId,
        lists,
        trx,
      )
    })
  }


  async spawnNewJobs(externalData: TrelloBoardListsExternalDataInterface, job: TrelloImportBoardListsJobInterface): Promise<number> {
    const { userId, organizationId, boardId, extensionId } = job
    const newJob = this.jobFactory.createBoardCardsImportJob(
      userId,
      organizationId,
      extensionId,
      boardId,
    )

    await this.mqPublisher.publish(newJob, this.queue)
    return 1
  }

}
