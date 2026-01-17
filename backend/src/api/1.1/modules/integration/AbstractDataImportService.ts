import { injectable, inject } from 'inversify';
import { IntegrationServiceInterface } from './interfaces/IntegrationServiceInterface';
import { Id } from '../common/identifier';
import { IntegrationProviderInterface } from './interfaces/IntegrationProviderInterface';
import { IntegrationModule } from './IntegrationModule';
import { IntegrationStatus, IntegrationResult, IntegrationResultStatus } from './types';
import { DataImportProjectServiceInterface } from './dataImportEntityService/interfaces/DataImportProjectServiceInterface';
import { DataImportListServiceInterface } from './dataImportEntityService/interfaces/DataImportListServiceInterface';
import { DataImportTaskServiceInterface } from './dataImportEntityService/interfaces/DataImportTaskServiceInterface';
import { DataImportChecklistServiceInterface } from './dataImportEntityService/interfaces/DataImportChecklistServiceInterface';
import { DataImportTagServiceInterface } from './dataImportEntityService/interfaces/DataImportTagServiceInterface';
import { DataImportUserInProjectServiceInterface } from './dataImportEntityService/interfaces/DataImportUserInProjectServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';

@injectable()
export abstract class AbstractDataImportService implements IntegrationServiceInterface {
  constructor(
    @inject(IntegrationModule.IntegrationProviderInterface) 
    protected integrationProvider: IntegrationProviderInterface,
    @inject(IntegrationModule.DataImportProjectServiceInterface) 
    protected integrationProjectService: DataImportProjectServiceInterface,
    @inject(IntegrationModule.DataImportListServiceInterface) 
    protected integrationListService: DataImportListServiceInterface,
    @inject(IntegrationModule.DataImportTaskServiceInterface) 
    protected integrationTaskService: DataImportTaskServiceInterface,
    @inject(IntegrationModule.DataImportChecklistServiceInterface) 
    protected integrationChecklistService: DataImportChecklistServiceInterface,
    @inject(IntegrationModule.DataImportTagServiceInterface) 
    protected integrationTagService: DataImportTagServiceInterface,
    @inject(IntegrationModule.DataImportUserInProjectServiceInterface) 
    protected integrationUserInProjectService: DataImportUserInProjectServiceInterface,
    @inject(InfrastructureModule.LoggerInterface) 
    protected logger: LoggerInterface,
  ) {}

  async start(extensionId: Id, organizationId: Id, userId: Id): Promise<IntegrationResult> {
    try {
      const integrationStatus = await this.integrationProvider.getIntegrationStatus(extensionId, organizationId, userId)
      if (integrationStatus === IntegrationStatus.IN_PROGRESS) {
        return { status: IntegrationResultStatus.INTEGRATION_ALREADY_IN_PROGRESS }
      }

      await this.integrationProvider.setIntegrationStatus(extensionId, organizationId, userId, IntegrationStatus.IN_PROGRESS)
      await this.startRootJob(userId, organizationId, extensionId)

      return { status: IntegrationResultStatus.OK }
    } catch (error) {
      await this.integrationProvider.setIntegrationStatus(extensionId, organizationId, userId, IntegrationStatus.FAILURE)
      this.logger.error(error)
      throw error
    }
  }

  protected abstract startRootJob(userId: Id, organizationId: Id, extensionId: Id): Promise<void>
}
