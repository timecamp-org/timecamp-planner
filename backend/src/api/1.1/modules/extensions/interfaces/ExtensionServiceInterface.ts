import { CustomRelationDbRow, CustomRelationColumnDbRow, ExtensionDbRow, ExtensionInOrganizationDbRow } from '../../db/schema'
import { Id } from '../../common/identifier'
import {
  WorkspaceExtension,
  UpdateExtensionStatusInWorkspaceResult,
  ExtensionQueryParams,
} from '../types';
import { EntityStatus } from '../../common/enum';


export interface ExtensionServiceInterface {
  getExtensionByNamespace(namespace: string, trx?: Transaction): PromiseLike<ExtensionDbRow>;

  getExtensionById(id: Id, trx?: Transaction): PromiseLike<ExtensionDbRow>;

  getRelationByName(extensionId: Id, relationName: string, trx?: Transaction): PromiseLike<CustomRelationDbRow>;

  getExtensionsByIds(ids: Id[], trx?: Transaction): PromiseLike<ExtensionDbRow[]>;

  getRelationsByExtensionId(extensionId: Id, trx?: Transaction): PromiseLike<CustomRelationDbRow[]>;

  getRelationColumns(
    relation: CustomRelationDbRow,
    trx?: Transaction,
  ): PromiseLike<CustomRelationColumnDbRow[]>

  getRelationsColumns(relationIds: Id[], trx?: Transaction): PromiseLike<CustomRelationColumnDbRow[]>

  getExtensions(): PromiseLike<ExtensionDbRow[]>;

  getExtensionInWorkspace(extensionId: Id, organizationId: Id): PromiseLike<ExtensionInOrganizationDbRow>;

  getWorkspaceExtensions(organizationId: Id, queryParams?: ExtensionQueryParams): PromiseLike<WorkspaceExtension[]>;

  updateExtensionStatusInWorkspace(extensionId: Id, organizationId: Id, status: EntityStatus): PromiseLike<UpdateExtensionStatusInWorkspaceResult>;
}
