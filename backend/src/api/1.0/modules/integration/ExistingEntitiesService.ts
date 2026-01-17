import { ExistingEntitiesServiceInterface } from "./interfaces/ExistingEntitiesServiceInterface";
import { injectable, inject } from "inversify";
import { Id } from "../common/identifier";
import { ExtensionsModule } from "../extensions/ExtensionsModule";
import { ExtensionServiceInterface } from "../extensions/interfaces/ExtensionServiceInterface";
import { GetExtensionsDataStatus } from "../extensions/types";
import { CustomFieldServiceInterface } from "../extensions/interfaces/CustomFieldServiceInterface";
import { Schema } from "../db/Table";
import { EntityInternalIdByExternalId, ExternalEntityType } from "./types";


const entitiesPropertyNames = {
  [ExternalEntityType.TASK]: {
    externalEntityDbPropertyName: 'external_task_id',
    externalEntityPropertyName: 'externalTaskId',
    internalEntityPropertyName: 'taskId',
  },
  [ExternalEntityType.LIST]: {
    externalEntityDbPropertyName: 'external_task_list_id',
    externalEntityPropertyName: 'externalTaskListId',
    internalEntityPropertyName: 'taskListId',
  },
  [ExternalEntityType.PROJECT]: {
    externalEntityDbPropertyName: 'external_project_id',
    externalEntityPropertyName: 'externalProjectId',
    internalEntityPropertyName: 'projectId',
  },
  [ExternalEntityType.TAG]: {
    externalEntityDbPropertyName: 'external_tag_id',
    externalEntityPropertyName: 'externalTagId',
    internalEntityPropertyName: 'tagId',
  },
}

@injectable()
export class ExistingEntitiesService implements ExistingEntitiesServiceInterface {

  protected extensionService: ExtensionServiceInterface;
  protected customFieldService: CustomFieldServiceInterface;

  constructor(
    @inject(ExtensionsModule.ExtensionServiceInterface) extensionService: ExtensionServiceInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface) customFieldService: CustomFieldServiceInterface,
  ) {
    this.extensionService = extensionService
    this.customFieldService = customFieldService
  }

  async getExistingEntityData(organizationId: Id, extensionId: Id, entityType: ExternalEntityType, trx?: Transaction): Promise<EntityInternalIdByExternalId> {
    const extension = await this.extensionService.getExtensionById(extensionId, trx)
    const extensionDataResult = await this.customFieldService.getExtensionsData([extensionId], { organizationId: [organizationId] }, trx)
    if (extensionDataResult.status !== GetExtensionsDataStatus.OK) {
      throw new Error('Getting existing extension data failed')
    }

    const entityInternalIdByExternalId = {}
    const { externalEntityDbPropertyName, externalEntityPropertyName, internalEntityPropertyName } = entitiesPropertyNames[entityType]
    const existingEntityData = extensionDataResult.values[`${Schema.EXTENSION_DATA_SCHEMA}.${extension.namespace}_${externalEntityDbPropertyName}`]

    existingEntityData.forEach(existingEntityData => {
      const internalEntityId = existingEntityData[internalEntityPropertyName]
      const externalEntityId = existingEntityData[externalEntityPropertyName]
      entityInternalIdByExternalId[externalEntityId] = internalEntityId
    })

    return entityInternalIdByExternalId
  }

  async saveEntityExternalIdInternalIds(
    organizationId: Id,
    extensionId: Id,
    entityType: ExternalEntityType,
    entityInternalIdByExternalId: EntityInternalIdByExternalId,
    trx: Transaction,
  ): Promise<void> {
    const { externalEntityPropertyName, externalEntityDbPropertyName, internalEntityPropertyName } = entitiesPropertyNames[entityType]
    const extension = await this.extensionService.getExtensionById(extensionId, trx)
    const externalEntityIdDbRows = Object.keys(entityInternalIdByExternalId).map(externalId => ({
      organizationId,
      [externalEntityPropertyName]: externalId,
      [internalEntityPropertyName]: entityInternalIdByExternalId[externalId],
    }))

    if (externalEntityIdDbRows.length > 0) {
      await this.customFieldService.updateRelation(
        extension.namespace,
        externalEntityDbPropertyName,
        externalEntityIdDbRows,
        trx,
      )
    }
  }

}
