import { injectable } from "inversify";
import { CustomRelationColumnDbRow, CustomRelationDbRow } from "../../db/schema";

import Table from "../../db/Table";
import { Id } from "../../common/identifier";
import { CustomRelationProviderInterface } from "../interfaces/CustomRelationProviderInterface";
import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";

@injectable()
export class CustomRelationProvider
  extends AbstractPostgresProvider
  implements CustomRelationProviderInterface {

  async getRelationByName(extensionId: Id, relationName: string, trx?: Transaction): Promise<CustomRelationDbRow> {
    const relation = await this.connection.getQueryWithTransaction(trx)
      .from(Table.EXTENSION_CUSTOM_RELATION)
      .where({
        extensionId,
        name: relationName
      })
      .first()
    ;
    return relation;
  }

  async getRelationsByExtensionId(extensionId: Id, trx?: Transaction): Promise<CustomRelationDbRow[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .from(Table.EXTENSION_CUSTOM_RELATION)
      .where({
        extensionId,
      })
      ;
  }

  async getRelationColumns(
    relation: CustomRelationDbRow,
    trx?: Transaction
  ): Promise<CustomRelationColumnDbRow[]> {
    // Fetch all columns from database
    const qb = this.connection.getQueryWithTransaction(trx);
    const definedColumns: CustomRelationColumnDbRow[] = await qb
      .from(Table.EXTENSION_CUSTOM_RELATION_FIELD)
      .where({
        relationId: relation.id
      })
    ;
    return definedColumns;
  }

  async getRelationsColumns(relationIds: Id[], trx?: Transaction): Promise<CustomRelationColumnDbRow[]> {
    const qb = this.connection.getQueryWithTransaction(trx);
    const definedColumns: CustomRelationColumnDbRow[] = await qb
      .from(Table.EXTENSION_CUSTOM_RELATION_FIELD)
      .whereIn('relationId', relationIds)
      ;
    return definedColumns;
  }

}