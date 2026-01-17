import { injectable } from "inversify";
import { WorkspaceExtensionProviderInterface } from "../interfaces/WorkspaceExtensionProviderInterface";
import { Id } from "../../common/identifier";
import { ExtensionDbRow, ExtensionInOrganizationDbRow } from "../../db/schema";
import Table from "../../db/Table";
import { EntityStatus } from "../../common/enum";
import { AbstractPostgresProvider } from "../../postgresDataProvider/AbstractPostgresProvider";

@injectable()
export class WorkspaceExtensionProvider
  extends AbstractPostgresProvider
  implements WorkspaceExtensionProviderInterface {

  async getExtensionInWorkspace(extensionId: Id, organizationId: Id): Promise<ExtensionInOrganizationDbRow> {
    const qb = this.connection.getQueryBuilder();
    return await qb
      .from(Table.EXTENSION_IN_ORGANIZATION)
      .where({ extensionId, organizationId })
      .first()
      ;
  }

  async getWorkspaceExtensions(organizationId: Id, extensions: ExtensionDbRow[]): Promise<ExtensionInOrganizationDbRow[]> {
    const qb = this.connection.getQueryBuilder();

    return await qb
      .from(Table.EXTENSION_IN_ORGANIZATION)
      .where({ organizationId })
  }

  async updateExtensionStatusInWorkspace(extensionId: Id, organizationId: Id, status: EntityStatus): Promise<void> {
    const qb = this.connection.getConnection()

    const params = {
      table: Table.EXTENSION_IN_ORGANIZATION,

      extensionId: qb.raw('?', extensionId),
      organizationId: qb.raw('?', organizationId),
      status: qb.raw('?', status),
    }
    await qb.raw(
      `INSERT INTO :table: (extension_id, organization_id, status) ` +
      `VALUES (:extensionId:, :organizationId:, :status:) ` +
      `ON CONFLICT (extension_id, organization_id) DO UPDATE SET ` +
      `status = :status:`
      ,
      params
    )
  }

}