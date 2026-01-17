import { Request, Response } from 'express';
import { LoggerInterface } from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { ExtensionQueryParams, UpdateExtensionStatusInWorkspaceResultStatus } from '../modules/extensions/types';
import { ExtensionServiceInterface } from '../modules/extensions/interfaces/ExtensionServiceInterface';
import { inject, injectable } from 'inversify';
import { ExtensionsModule } from '../modules/extensions/ExtensionsModule';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';

@injectable()
export class ExtensionController {
  protected logger: LoggerInterface;
  protected extensionService: ExtensionServiceInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface) extensionService: ExtensionServiceInterface
  ) {
    this.logger = logger;
    this.extensionService = extensionService;
  }

  public async getWorkspaceExtensions(req: Request, res: Response) {
    const organizationId = req.params.organizationId;
    const queryParams = req.query as unknown as ExtensionQueryParams;
    const workspaceExtensions = await this.extensionService.getWorkspaceExtensions(organizationId, queryParams);
    return res.send(workspaceExtensions);
  }

  public async updateExtensionStatusInWorkspace(req: Request, res: Response) {
    const { organizationId, extensionId } = req.params;
    const { status } = req.body;
    const enableExtensionResult = await this.extensionService.updateExtensionStatusInWorkspace(
      extensionId,
      organizationId,
      status
    );

    switch (enableExtensionResult.status) {
      case UpdateExtensionStatusInWorkspaceResultStatus.OK:
        return res.send();
      case UpdateExtensionStatusInWorkspaceResultStatus.EXTENSION_NOT_FOUND:
        return res.send(ErrorDefinitions[Type.EXTENSION_NOT_FOUND]);
      default:
        return res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
