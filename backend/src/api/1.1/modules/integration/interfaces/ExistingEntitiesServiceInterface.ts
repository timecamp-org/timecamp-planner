import { Id } from "../../common/identifier";
import { ExternalEntityType, EntityInternalIdByExternalId } from "../types";


export interface ExistingEntitiesServiceInterface {

  getExistingEntityData(organizationId: Id, extensionId: Id, entityType: ExternalEntityType, trx?: Transaction): Promise<EntityInternalIdByExternalId>

  saveEntityExternalIdInternalIds(
    organizationId: Id,
    extensionId: Id,
    entityType: ExternalEntityType,
    entityInternalIdByExternalId: EntityInternalIdByExternalId,
    trx: Transaction,
  ): Promise<void> 

}
