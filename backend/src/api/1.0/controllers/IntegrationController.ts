import { Request, Response } from 'express';
import { LoggerInterface } from '../../../infrastructure/logger'
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';
import { IntegrationServiceFactoryInterface } from '../modules/integration/interfaces/IntegrationServiceFactoryInterface';
import { IntegrationProviderInterface } from '../modules/integration/interfaces/IntegrationProviderInterface';
import { IntegrationModule } from '../modules/integration/IntegrationModule';
import { IntegrationStatus } from '../modules/integration/types';

@injectable()
export class IntegrationController {
  protected logger: LoggerInterface;
  protected integrationServiceFactory: IntegrationServiceFactoryInterface;
  protected integrationProvider: IntegrationProviderInterface;


  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(IntegrationModule.IntegrationServiceFactoryInterface) integrationServiceFactory: IntegrationServiceFactoryInterface,
    @inject(IntegrationModule.IntegrationProviderInterface) integrationProvider: IntegrationProviderInterface,
  ) {
    this.logger = logger
    this.integrationServiceFactory = integrationServiceFactory
    this.integrationProvider = integrationProvider
  }

  public async runAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId
      const { extensionId, organizationId } = req.params;

      const integrationStatus = await this.integrationProvider.getIntegrationStatus(extensionId, organizationId, currentUserId)
      if (integrationStatus === IntegrationStatus.IN_PROGRESS) {
        return res.send(ErrorDefinitions[Type.INTEGRATION_ALREADY_IN_PROGRESS])
      }

      const integrationService = await this.integrationServiceFactory.create(extensionId)
      if (!integrationService) {
        return res.send(ErrorDefinitions[Type.INTEGRATION_NOT_IMPLEMENTED])
      }

      integrationService.start(extensionId, organizationId, currentUserId)
      return res.send()
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async getIntegrationsAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId
      const organizationId = req.params.organizationId;
      const integrations = await this.integrationProvider.getUserIntegrations(organizationId, currentUserId);
      return res.send(integrations)
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  public async confirmIntegrationsStatusAction(req: Request, res: Response) {
    try {
      const currentUserId = req.heyspace.authResult.userId
      const organizationId = req.params.organizationId;
      const { extensionIds } = req.body;
      await this.integrationProvider.confirmIntegrationsStatus(organizationId, currentUserId, extensionIds);
      return res.send()
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

}
