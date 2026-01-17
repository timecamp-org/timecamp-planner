import { IntegrationServiceFactoryInterface } from "./interfaces/IntegrationServiceFactoryInterface";
import { injectable, inject } from "inversify";
import { IntegrationServiceInterface } from "./interfaces/IntegrationServiceInterface";
import { IntegrationModule } from "./IntegrationModule";
import { Id } from "../common/identifier";
import { ExtensionsModule } from "../extensions/ExtensionsModule";
import { ExtensionServiceInterface } from "../extensions/interfaces/ExtensionServiceInterface";
import { ExtensionNamespace } from "../extensions/types";

@injectable()
export class IntegrationServiceFactory implements IntegrationServiceFactoryInterface {

  protected trelloIntegrationService: IntegrationServiceInterface;
  protected extensionService: ExtensionServiceInterface;

  constructor(
    @inject(IntegrationModule.TrelloDataImportService) trelloIntegrationService: IntegrationServiceInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface) extensionService: ExtensionServiceInterface,
  ) {
    this.trelloIntegrationService = trelloIntegrationService
    this.extensionService = extensionService
  }

  async create(extensionId: Id): Promise<IntegrationServiceInterface> {
    const extension = await this.extensionService.getExtensionById(extensionId)
    if (!extension) {
      throw new Error('Extension not found')
    }

    switch (extension.namespace) {
      case ExtensionNamespace.TRELLO_DATA_IMPORT: {
        return this.trelloIntegrationService
      }
      default: {
        return null
      }
    }
  }

}
