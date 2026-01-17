import { CustomRelationColumnDbRow, CustomRelationDbRow } from "../../db/schema";

import { Id } from "../../common/identifier";

export interface CustomRelationProviderInterface {
  getRelationByName(extensionId: Id, relationName: string, trx?: Transaction): PromiseLike<CustomRelationDbRow>;

  getRelationsByExtensionId(extensionId: Id, trx?: Transaction): PromiseLike<CustomRelationDbRow[]>;

  getRelationColumns(
    relation: CustomRelationDbRow,
    trx?: Transaction,
  ): Promise<CustomRelationColumnDbRow[]>

  getRelationsColumns(relationIds: Id[], trx?: Transaction): PromiseLike<CustomRelationColumnDbRow[]>
}