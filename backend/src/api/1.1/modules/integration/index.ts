import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { IntegrationModule } from './IntegrationModule';
import { IntegrationProvider } from './IntegrationProvider';
import { IntegrationController } from '../../controllers/IntegrationController';
import { TrelloDataImportService } from './trello/TrelloDataImportService';
import { IntegrationServiceFactory } from './IntegrationServiceFactory';
import { ExistingEntitiesService } from './ExistingEntitiesService';
import { TrelloApi } from './trello/TrelloApi';
import { DataImportProjectService } from './dataImportEntityService/DataImportProjectService';
import { DataImportListService } from './dataImportEntityService/DataImportListService';
import { DataImportTaskService } from './dataImportEntityService/DataImportTaskService';
import { DataImportChecklistService } from './dataImportEntityService/DataImportChecklistService';
import { DataImportTagService } from './dataImportEntityService/DataImportTagService';
import { DataImportUserInProjectService } from './dataImportEntityService/DataImportUserInProjectService';
import { QueueDescriptorInterface } from '../messageQueue/interfaces/QueueDescriptorInterface';
import { DataImportQueueType } from './types';
import { QueueDescriptor } from '../messageQueue/QueueDescriptor';
import { TrelloDataImportJobFactory } from './trello/TrelloDataImportJobFactory';
import { TrelloDataMapper } from './trello/TrelloDataMapper';
import { DataImportSubWorkerInterface } from './interfaces/DataImportSubWorkerInterface';
import { TrelloDataImportRootWorker } from './trello/workers/TrelloDataImportRootWorker';
import { TrelloDataImportWorker } from './trello/workers/TrelloDataImportWorker';
import {
  TrelloBoardCardsExternalDataInterface,
  TrelloBoardCardsInternalDataInterface,
  TrelloBoardLabelsExternalDataInterface,
  TrelloBoardLabelsInternalDataInterface,
  TrelloBoardListsExternalDataInterface,
  TrelloBoardListsInternalDataInterface,
  TrelloDataImportJobInterface,
  TrelloRootExternalDataInterface,
  TrelloRootInternalDataInterface,
} from './trello/types';
import { ExternalAPIRateLimitsService } from './ExternalAPIRateLimitsService';
import { ExternalAPIRateLimitsServiceInterface } from './interfaces/ExternalAPIRateLimitsServiceInterface';
import { TrelloDataImportBoardListsWorker } from './trello/workers/TrelloDataImportBoardListsWorker';
import { TrelloDataImportBoardLabelsWorker } from './trello/workers/TrelloDataImportBoardLabelsWorker';
import { TrelloDataImportBoardCardsWorker } from './trello/workers/TrelloDataImportBoardCardsWorker';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { WorkerOptionsInterface } from '../messageQueue/types';
import { TrelloApiErrorHandler } from './trello/TrelloApiErrorHandler';
import { TrelloApiErrorHandlerInterface } from './trello/interfaces/TrelloApiErrorHandlerInterface';

export const integrationModule: ModuleLoaderType = (kernel) => {
  kernel
    .bind(IntegrationModule.IntegrationProviderInterface)
    .to(IntegrationProvider);
  kernel
    .bind(IntegrationModule.IntegrationController)
    .to(IntegrationController);
  kernel
    .bind(IntegrationModule.TrelloDataImportService)
    .to(TrelloDataImportService);
  kernel
    .bind(IntegrationModule.IntegrationServiceFactoryInterface)
    .to(IntegrationServiceFactory);
  kernel
    .bind(IntegrationModule.ExistingEntitiesServiceInterface)
    .to(ExistingEntitiesService);
  kernel.bind(IntegrationModule.TrelloApiInterface).to(TrelloApi);
  kernel
    .bind(IntegrationModule.DataImportProjectServiceInterface)
    .to(DataImportProjectService);
  kernel
    .bind(IntegrationModule.DataImportListServiceInterface)
    .to(DataImportListService);
  kernel
    .bind(IntegrationModule.DataImportTaskServiceInterface)
    .to(DataImportTaskService);
  kernel
    .bind(IntegrationModule.DataImportChecklistServiceInterface)
    .to(DataImportChecklistService);
  kernel
    .bind(IntegrationModule.DataImportTagServiceInterface)
    .to(DataImportTagService);
  kernel
    .bind(IntegrationModule.DataImportUserInProjectServiceInterface)
    .to(DataImportUserInProjectService);

  kernel.bind(IntegrationModule.TrelloDataMapper).to(TrelloDataMapper);

  // Message Queue
  kernel
    .bind<QueueDescriptorInterface>(IntegrationModule.TrelloDataImportQueue)
    .toDynamicValue(
      () => new QueueDescriptor(DataImportQueueType.TRELLO, { durable: true })
    )
    .whenTargetNamed(DataImportQueueType.TRELLO);

  kernel
    .bind<QueueDescriptorInterface>(IntegrationModule.TrelloDataImportQueue)
    .toDynamicValue(
      () =>
        new QueueDescriptor(DataImportQueueType.TRELLO_DELAYED, {
          durable: true,
        })
    )
    .whenTargetNamed(DataImportQueueType.TRELLO_DELAYED);

  kernel
    .bind(IntegrationModule.TrelloDataImportWorker)
    .to(TrelloDataImportWorker);

  kernel
    .bind<WorkerOptionsInterface>(MessageQueueModule.WorkerOptionsInterface)
    .toConstantValue({ maxConcurrentJobs: 1 })
    .whenTargetNamed('TrelloWorker');

  kernel
    .bind<
      DataImportSubWorkerInterface<
        TrelloDataImportJobInterface,
        TrelloRootExternalDataInterface,
        TrelloRootInternalDataInterface
      >
    >(IntegrationModule.TrelloDataImportSubWorker)
    .to(TrelloDataImportRootWorker);

  kernel
    .bind<
      DataImportSubWorkerInterface<
        TrelloDataImportJobInterface,
        TrelloBoardListsExternalDataInterface,
        TrelloBoardListsInternalDataInterface
      >
    >(IntegrationModule.TrelloDataImportSubWorker)
    .to(TrelloDataImportBoardListsWorker);

  kernel
    .bind<
      DataImportSubWorkerInterface<
        TrelloDataImportJobInterface,
        TrelloBoardLabelsExternalDataInterface,
        TrelloBoardLabelsInternalDataInterface
      >
    >(IntegrationModule.TrelloDataImportSubWorker)
    .to(TrelloDataImportBoardLabelsWorker);

  kernel
    .bind<
      DataImportSubWorkerInterface<
        TrelloDataImportJobInterface,
        TrelloBoardCardsExternalDataInterface,
        TrelloBoardCardsInternalDataInterface
      >
    >(IntegrationModule.TrelloDataImportSubWorker)
    .to(TrelloDataImportBoardCardsWorker);

  kernel
    .bind(IntegrationModule.TrelloDataImportJobFactoryInterface)
    .to(TrelloDataImportJobFactory);

  kernel
    .bind<TrelloApiErrorHandlerInterface>(
      IntegrationModule.TrelloApiErrorHandlerInterface
    )
    .to(TrelloApiErrorHandler);

  kernel
    .bind<ExternalAPIRateLimitsServiceInterface>(
      IntegrationModule.ExternalAPIRateLimitsService
    )
    .to(ExternalAPIRateLimitsService)
    .inSingletonScope();
};
