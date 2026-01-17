import { ExtensionProviderInterface } from "../interfaces/ExtensionProviderInterface";
import { injectable } from "inversify";

import { ExtensionDbRow } from "../../db/schema";
import Table from "../../db/Table";
import { Id } from "../../common/identifier";
import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";

@injectable()
export class ExtensionProvider
  extends AbstractPostgresProvider
  implements ExtensionProviderInterface {

  async getExtensionByNamespace(namespace: string, trx?: Transaction): Promise<ExtensionDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION)
      .where({ namespace })
      .first()
      ;
  }

  async getExtensionsByNamespaces(namespaces: string[], trx?: Transaction): Promise<ExtensionDbRow[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION)
      .whereIn('namespace', namespaces)
      ;
  }

  async getExtensionById(id: Id, trx?: Transaction): Promise<ExtensionDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION)
      .where({ id })
      .first()
      ;
  }

  async getExtensionsByIds(ids: Id[], trx?: Transaction): Promise<ExtensionDbRow[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.EXTENSION)
      .whereIn('id', ids)
      ;
  }

  async getExtensions(): Promise<ExtensionDbRow[]> {
    const qb = this.connection.getQueryBuilder();
    return await qb
      .from(Table.EXTENSION)
  }
}