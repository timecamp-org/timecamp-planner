import {
  TrelloDataImportJobType,
  TrelloImportRootJobInterface,
  TrelloRootExternalDataInterface,
  TrelloRootInternalDataInterface,
} from '../types'
import { inject, named } from 'inversify'
import { InfrastructureModule } from '../../../../../../infrastructure/InfrastructureModule'
import { LoggerInterface } from '../../../../../../infrastructure/logger'
import { MessageQueueModule } from '../../../messageQueue/MessageQueueModule'
import { JobStatusServiceInterface } from '../../../messageQueue/interfaces/JobStatusServiceInterface'
import { IntegrationModule } from '../../IntegrationModule'
import { TrelloApiInterface } from '../interfaces/TrelloApiInterface'
import { MessageQueuePublisherInterface } from '../../../messageQueue/interfaces/MessageQueuePublisherInterface'
import {
  APIRateLimitDelay,
  DataImportQueueType,
  ExternalEntityType,
  FetchExternalDataResult,
  FetchExternalDataResultStatus,
} from '../../types'
import { QueueDescriptorInterface } from '../../../messageQueue/interfaces/QueueDescriptorInterface'
import { AbstractDataImportSubWorker } from '../../AbstractDataImportSubWorker'
import { TrelloDataMapperInterface } from '../interfaces/TrelloDataMapperInterface'
import { DataImportProjectServiceInterface } from '../../dataImportEntityService/interfaces/DataImportProjectServiceInterface'

import { DataImportUserInProjectServiceInterface } from '../../dataImportEntityService/interfaces/DataImportUserInProjectServiceInterface'
import { ProjectRole } from '../../../db/schema'
import { ExistingEntitiesServiceInterface } from '../../interfaces/ExistingEntitiesServiceInterface'
import { TrelloDataImportJobFactoryInterface } from '../interfaces/TrelloDataImportJobFactoryInterface'
import { JobNamespace, MessageOptions } from '../../../messageQueue/types'
import { ConnectionInterface } from '../../../db/ConnectionInterface'
import { DbModule } from '../../../db/DbModule'
import { ExternalAPIRateLimitsServiceInterface } from '../../interfaces/ExternalAPIRateLimitsServiceInterface';
import { TrelloApiErrorHandlerInterface } from '../interfaces/TrelloApiErrorHandlerInterface'

export class TrelloDataImportRootWorker
  extends AbstractDataImportSubWorker<TrelloImportRootJobInterface, TrelloRootExternalDataInterface, TrelloRootInternalDataInterface>
{

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    protected jobStatusService: JobStatusServiceInterface,
    @inject(IntegrationModule.TrelloApiInterface)
    private trelloApi: TrelloApiInterface,
    @inject(MessageQueueModule.MessageQueuePublisherInterface)
    private mqPublisher: MessageQueuePublisherInterface,
    @inject(MessageQueueModule.DelayedMessageQueuePublisherInterface)
    protected mqDelayedPublisher: MessageQueuePublisherInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO_DELAYED)
    protected delayedQueue: QueueDescriptorInterface,
    @inject(IntegrationModule.TrelloDataImportQueue) @named(DataImportQueueType.TRELLO)
    private queue: QueueDescriptorInterface,
    @inject(IntegrationModule.ExternalAPIRateLimitsService)
    protected apiRateLimitsService: ExternalAPIRateLimitsServiceInterface,
    @inject(IntegrationModule.TrelloDataMapper)
    private trelloDataMapper: TrelloDataMapperInterface,
    @inject(IntegrationModule.DataImportProjectServiceInterface)
    private dataImportProjectService: DataImportProjectServiceInterface,
    @inject(IntegrationModule.DataImportUserInProjectServiceInterface)
    private dataImportUserInProjectService: DataImportUserInProjectServiceInterface,
    @inject(IntegrationModule.ExistingEntitiesServiceInterface)
    private existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(IntegrationModule.TrelloDataImportJobFactoryInterface)
    private jobFactory: TrelloDataImportJobFactoryInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(IntegrationModule.TrelloApiErrorHandlerInterface)
    private apiErrorHandler: TrelloApiErrorHandlerInterface,
    @inject(MessageQueueModule.DelayedQueueMessageOptionsFactory)
    delayedQueueMessageOptionsFactory: (delay: number) => MessageOptions
  ) {
    super(
      TrelloDataImportJobType.ROOT_JOB,
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

  public async fetchData(job: TrelloImportRootJobInterface): Promise<FetchExternalDataResult<TrelloRootExternalDataInterface>> {
    try {
      const { userId, organizationId } = job
      const boardsData = await this.trelloApi.fetchUserBoardsData(organizationId, userId)
      return {
        result: { boardsData },
        status: FetchExternalDataResultStatus.OK
      }
    } catch (error) {
      return this.apiErrorHandler.handleError(job, error)
    }
  }

  public async filterOutExistingData(
    externalData: TrelloRootExternalDataInterface,
    job: TrelloImportRootJobInterface,
  ): Promise<TrelloRootExternalDataInterface> {
    const { organizationId, extensionId } = job
    const projectInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.PROJECT)

    return {
      boardsData: externalData.boardsData
        .filter(externalProject => {
          const projectAlreadyImported = projectInternalIdByExternalId[externalProject.id]
          return !projectAlreadyImported
        })
    }
  }

  public parseData(externalData: TrelloRootExternalDataInterface, job: TrelloImportRootJobInterface): TrelloRootInternalDataInterface {
    const { userId } = job
    const projects = externalData.boardsData
      .map(this.trelloDataMapper.translateTrelloBoard)
    const projectPeople = projects.map(project => ({
      userId,
      projectId: project.id,
      role: ProjectRole.OWNER,
    }))

    return {
      projects,
      projectPeople,
    }
  }

  public async insertData(
    parsedData: TrelloRootInternalDataInterface,
    job: TrelloImportRootJobInterface,
  ): Promise<void> {
    const { projects, projectPeople } = parsedData
    if (projects.length === 0) {
      return
    }
    const { extensionId, organizationId, userId } = job
    await this.connection.getConnection().transaction(async (trx: Transaction) => {
      const internalProjects = await this.dataImportProjectService.createProjects(
        extensionId,
        organizationId,
        userId,
        projects,
        trx,
      )
      await this.dataImportUserInProjectService.createProjectPeople(
        extensionId,
        organizationId,
        internalProjects,
        projectPeople,
        trx,
      )
    })
  }

  public async spawnNewJobs(
    externalData: TrelloRootExternalDataInterface,
    job: TrelloImportRootJobInterface,
  ): Promise<number> {
    const { userId, organizationId, extensionId } = job
    const jobs = externalData.boardsData
      .map(({ id }) => this.jobFactory.createBoardLabelsImportJob(id, userId, organizationId, extensionId))

    await Promise.all(jobs.map(async (job) => {
      await this.mqPublisher.publish(job, this.queue)
    }))

    return jobs.length
  }
}
