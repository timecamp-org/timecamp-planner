import { AbstractDataImportSubWorker } from '../../AbstractDataImportSubWorker';
import {
  TrelloBoardCardsExternalDataInterface,
  TrelloBoardCardsInternalDataInterface,
  TrelloChecklist,
  TrelloDataImportJobType,
  TrelloImportBoardCardsJobInterface,
  TrelloTaskMinimalData,
  TrelloTaskWithChecklistData,
} from '../types';
import { inject, named } from 'inversify';
import { InfrastructureModule } from '../../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../../infrastructure/logger';
import { MessageQueueModule } from '../../../messageQueue/MessageQueueModule';
import { JobStatusServiceInterface } from '../../../messageQueue/interfaces/JobStatusServiceInterface';
import { IntegrationModule } from '../../IntegrationModule';
import { TrelloApiInterface } from '../interfaces/TrelloApiInterface';
import { MessageQueuePublisherInterface } from '../../../messageQueue/interfaces/MessageQueuePublisherInterface';
import {
  APIRateLimitDelay,
  DataImportQueueType,
  ExternalEntityIdsByExternalEntityId,
  ExternalEntityType,
  FetchExternalDataResult,
  FetchExternalDataResultStatus,
} from '../../types';
import { QueueDescriptorInterface } from '../../../messageQueue/interfaces/QueueDescriptorInterface';
import { TrelloDataMapperInterface } from '../interfaces/TrelloDataMapperInterface';
import { ExistingEntitiesServiceInterface } from '../../interfaces/ExistingEntitiesServiceInterface';
import { JobNamespace, MessageOptions } from '../../../messageQueue/types';
import { DataImportTaskServiceInterface } from '../../dataImportEntityService/interfaces/DataImportTaskServiceInterface';
import { DataImportTagServiceInterface } from '../../dataImportEntityService/interfaces/DataImportTagServiceInterface';
import { DataImportChecklistServiceInterface } from '../../dataImportEntityService/interfaces/DataImportChecklistServiceInterface';

import { TrelloDataImportJobFactoryInterface } from '../interfaces/TrelloDataImportJobFactoryInterface';
import { DbModule } from '../../../db/DbModule';
import { ConnectionInterface } from '../../../db/ConnectionInterface';
import { ExternalAPIRateLimitsServiceInterface } from '../../interfaces/ExternalAPIRateLimitsServiceInterface';
import { TrelloApiErrorHandlerInterface } from '../interfaces/TrelloApiErrorHandlerInterface';
import Table, { UniqueKey } from '../../../db/Table';
import { violatesUniqueKey } from '../../../../../../utils';
import { OrderServiceFactoryInterface } from '../../../order/OrderServiceFactoryInterface';
import { OrderModule } from '../../../order/OrderModule';
import { OrderServiceInterface } from '../../../order/OrderServiceInterface';
import { TaskDbRow } from '../../../db/schema';

const TRELLO_CARD_MAX_LIMIT = 50;
const TRELLO_CARD_MIN_LIMIT = 1;

export class TrelloDataImportBoardCardsWorker extends AbstractDataImportSubWorker<
  TrelloImportBoardCardsJobInterface,
  TrelloBoardCardsExternalDataInterface,
  TrelloBoardCardsInternalDataInterface
> {
  private orderService: OrderServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
    @inject(MessageQueueModule.JobStatusServiceInterface)
    jobStatusService: JobStatusServiceInterface,
    @inject(IntegrationModule.TrelloApiInterface)
    private trelloApi: TrelloApiInterface,
    @inject(MessageQueueModule.DelayedMessageQueuePublisherInterface)
    protected mqDelayedPublisher: MessageQueuePublisherInterface,
    @inject(IntegrationModule.TrelloDataImportQueue)
    @named(DataImportQueueType.TRELLO_DELAYED)
    protected delayedQueue: QueueDescriptorInterface,
    @inject(IntegrationModule.ExternalAPIRateLimitsService)
    protected apiRateLimitsService: ExternalAPIRateLimitsServiceInterface,
    @inject(IntegrationModule.TrelloDataMapper)
    private trelloDataMapper: TrelloDataMapperInterface,
    @inject(IntegrationModule.DataImportTaskServiceInterface)
    private dataImportTaskService: DataImportTaskServiceInterface,
    @inject(IntegrationModule.DataImportTagServiceInterface)
    private dataImportTagService: DataImportTagServiceInterface,
    @inject(IntegrationModule.DataImportChecklistServiceInterface)
    private dataImportChecklistService: DataImportChecklistServiceInterface,
    @inject(IntegrationModule.ExistingEntitiesServiceInterface)
    private existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(IntegrationModule.TrelloDataImportJobFactoryInterface)
    private jobFactory: TrelloDataImportJobFactoryInterface,
    @inject(MessageQueueModule.MessageQueuePublisherInterface)
    private mqPublisher: MessageQueuePublisherInterface,
    @inject(IntegrationModule.TrelloDataImportQueue)
    @named(DataImportQueueType.TRELLO)
    private queue: QueueDescriptorInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(IntegrationModule.TrelloApiErrorHandlerInterface)
    private apiErrorHandler: TrelloApiErrorHandlerInterface,
    @inject(OrderModule.OrderServiceFactoryInterface)
    private orderFactoryService: OrderServiceFactoryInterface,
    @inject(MessageQueueModule.DelayedQueueMessageOptionsFactory)
    delayedQueueMessageOptionsFactory: (delay: number) => MessageOptions
  ) {
    super(
      TrelloDataImportJobType.BOARD_CARDS_IMPORT,
      JobNamespace.TRELLO_DATA_IMPORT,
      APIRateLimitDelay.TRELLO,
      logger,
      jobStatusService,
      apiRateLimitsService,
      mqDelayedPublisher,
      delayedQueue,
      delayedQueueMessageOptionsFactory
    );
    this.orderService = this.orderFactoryService.create<TaskDbRow>(
      Table.TASK,
      'taskListId',
      'order'
    );
  }

  async fetchData(
    job: TrelloImportBoardCardsJobInterface
  ): Promise<FetchExternalDataResult<TrelloBoardCardsExternalDataInterface>> {
    try {
      const { userId, organizationId, boardId, cardId } = job;
      const limit = cardId ? TRELLO_CARD_MAX_LIMIT : TRELLO_CARD_MIN_LIMIT;
      const tasksWithChecklistsData = await this.trelloApi.fetchBoardCardsData(
        boardId,
        organizationId,
        userId,
        limit,
        cardId
      );

      return {
        status: FetchExternalDataResultStatus.OK,
        result: this.separateChecklistAndCardsData(tasksWithChecklistsData),
      };
    } catch (error) {
      return this.apiErrorHandler.handleError(job, error);
    }
  }

  private separateChecklistAndCardsData(
    tasksWithChecklistsData: TrelloTaskWithChecklistData[]
  ): TrelloBoardCardsExternalDataInterface {
    const checklistsData: TrelloChecklist[] = [];
    const cardsData: TrelloTaskMinimalData[] = [];

    tasksWithChecklistsData.forEach((taskWithChecklistsData) => {
      const { checklists, ...taskData } = taskWithChecklistsData;
      checklistsData.push(...checklists);
      cardsData.push(taskData);
    });

    return {
      cardsData,
      checklistsData,
    };
  }

  async filterOutExistingData(
    externalData: TrelloBoardCardsExternalDataInterface,
    job: TrelloImportBoardCardsJobInterface
  ): Promise<TrelloBoardCardsExternalDataInterface> {
    const { organizationId, extensionId } = job;
    const taskInternalIdByExternalId =
      await this.existingEntitiesService.getExistingEntityData(
        organizationId,
        extensionId,
        ExternalEntityType.TASK
      );

    const cardsData = externalData.cardsData.filter((externalCard) => {
      const cardAlreadyExists = taskInternalIdByExternalId[externalCard.id];
      return !cardAlreadyExists;
    });

    const checklistsData = externalData.checklistsData.filter(
      (externalChecklist) => {
        const parentCardAlreadyExists =
          taskInternalIdByExternalId[externalChecklist.idCard];
        return !parentCardAlreadyExists;
      }
    );

    return {
      cardsData,
      checklistsData,
    };
  }

  parseData(
    externalData: TrelloBoardCardsExternalDataInterface,
    job: TrelloImportBoardCardsJobInterface
  ): TrelloBoardCardsInternalDataInterface {
    const cards = externalData.cardsData.map(
      this.trelloDataMapper.translateTrelloTask.bind(this.trelloDataMapper)
    );
    const externalChecklists = externalData.checklistsData.map(
      this.trelloDataMapper.translateTrelloChecklist.bind(this.trelloDataMapper)
    );

    const externalTagIdsByExternalCardId: ExternalEntityIdsByExternalEntityId =
      {};
    externalData.cardsData.forEach((externalCard) => {
      externalTagIdsByExternalCardId[externalCard.id] = externalCard.idLabels;
    });

    return {
      cards,
      externalChecklists,
      externalTagIdsByExternalCardId,
    };
  }

  async insertData(
    parsedData: TrelloBoardCardsInternalDataInterface,
    job: TrelloImportBoardCardsJobInterface
  ): Promise<void> {
    const { cards } = parsedData;
    if (cards.length === 0) {
      return;
    }
    await this.connection
      .getConnection()
      .transaction(async (trx: Transaction) => {
        try {
          await this.doInsertData(trx, parsedData, job);
        } catch (error) {
          if (violatesUniqueKey(error, UniqueKey.TASK_ORDER_FOR_TASK_LIST)) {
            const { organizationId, extensionId } = job;
            this.logger.error(
              'Conflict detected, trying to reorganise task orders in list...'
            );
            const listInternalIdByExternalId =
              await this.existingEntitiesService.getExistingEntityData(
                organizationId,
                extensionId,
                ExternalEntityType.LIST,
                trx
              );
            const internalListId =
              listInternalIdByExternalId[cards[0].taskListId];

            if (!internalListId) {
              throw new Error(
                'Tried to reorganise orders but no internalListId exists'
              );
            }

            this.logger.info(
              `Found internal list id: ${internalListId}. Moving items...`
            );

            await this.orderService.moveItemsToMakeRoomForMultipleEntries(
              trx,
              cards.length,
              internalListId
            );

            this.logger.info(`Retrying to insert ${cards.length} rows...`);
            await this.doInsertData(trx, parsedData, job);
          } else {
            throw error;
          }
        }
      });
  }

  async doInsertData(
    trx: Transaction,
    parsedData: TrelloBoardCardsInternalDataInterface,
    job: TrelloImportBoardCardsJobInterface
  ): Promise<void> {
    const { extensionId, organizationId, userId } = job;
    const { cards, externalChecklists, externalTagIdsByExternalCardId } =
      parsedData;

    const newInternalTasks = await this.dataImportTaskService.createTasks(
      extensionId,
      organizationId,
      userId,
      cards,
      trx
    );

    const promises = []

    if (externalChecklists.length) {
      promises.push(this.dataImportChecklistService.createChecklists(
        extensionId,
        organizationId,
        newInternalTasks,
        externalChecklists,
        trx
      ))
    }

    promises.push(this.dataImportTagService.createTaskTags(
      extensionId,
      organizationId,
      newInternalTasks,
      externalTagIdsByExternalCardId,
      trx
    ))

    await Promise.all(promises)
  }

  async spawnNewJobs(
    externalData: TrelloBoardCardsExternalDataInterface,
    job: TrelloImportBoardCardsJobInterface
  ): Promise<number> {
    const boardHasMoreCardsToLoad =
      externalData.cardsData.length === TRELLO_CARD_MAX_LIMIT && job.cardId;
    const doesInitiallyRequestedCardExist =
      !job.cardId && externalData.cardsData.length === TRELLO_CARD_MIN_LIMIT;

    if (boardHasMoreCardsToLoad || doesInitiallyRequestedCardExist) {
      await this.spawnNewLimitedJob(externalData, job);
      return 1;
    } else {
      this.logger.info(`No jobs to spawn after this job: ${job.type}`);
      return 0;
    }
  }

  private async spawnNewLimitedJob(
    externalData: TrelloBoardCardsExternalDataInterface,
    job: TrelloImportBoardCardsJobInterface
  ): Promise<void> {
    const { userId, organizationId, boardId, extensionId } = job;

    // Trello has strange "pagination" mechanism.
    // More information here : https://stackoverflow.com/a/35131431
    const oldestCardId = this.getOldestCardId(
      externalData.cardsData,
      job.cardId
    );
    const newJob = this.jobFactory.createBoardCardsImportJob(
      userId,
      organizationId,
      extensionId,
      boardId,
      oldestCardId
    );

    await this.mqPublisher.publish(newJob, this.queue);
  }

  private getOldestCardId(
    cardsData: TrelloTaskMinimalData[],
    prevJobCardId: string
  ): string {
    const wasInitialBoardCardsJob = cardsData.length === 1 && !prevJobCardId;

    const oldestCardId = wasInitialBoardCardsJob
      ? cardsData[0].id
      : cardsData.sort(
        (cardA, cardB) =>
          this.objectIdToTimestamp(cardA.id) -
            this.objectIdToTimestamp(cardB.id)
      )[0].id;

    return oldestCardId;
  }

  private objectIdToTimestamp(objectId: string): number {
    const timestamp = objectId.substring(0, 8);
    return parseInt(timestamp, 16);
  }
}
