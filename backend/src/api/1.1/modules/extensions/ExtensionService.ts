import { ExtensionServiceInterface } from './interfaces/ExtensionServiceInterface'
import { CustomRelationDbRow, CustomRelationColumnDbRow, ExtensionDbRow, ExtensionInOrganizationDbRow } from '../db/schema'
import { Id } from '../common/identifier'
import { inject, injectable } from 'inversify'
import {
  WorkspaceExtension,
  UpdateExtensionStatusInWorkspaceResult,
  ExtensionQueryParams,
  WorkspaceExtensionContext,
  UpdateExtensionStatusInWorkspaceResultStatus,
  WorkspaceExtensionResourceData,
} from './types';
import { EntityStatus } from '../common/enum';

import { ExtensionsModule } from './ExtensionsModule';
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface';
import { ExtensionProviderInterface } from './interfaces/ExtensionProviderInterface';
import { WorkspaceExtensionProviderInterface } from './interfaces/WorkspaceExtensionProviderInterface';
import { CustomRelationProviderInterface } from './interfaces/CustomRelationProviderInterface';

@injectable()
export class ExtensionService
implements ExtensionServiceInterface {

  constructor(
    @inject(ExtensionsModule.ExtensionProviderInterface)
      private extensionProvider: ExtensionProviderInterface,
    @inject(ExtensionsModule.WorkspaceExtensionProviderInterface)
      private workspaceExtensionProvider: WorkspaceExtensionProviderInterface,
    @inject(ExtensionsModule.CustomRelationProviderInterface)
      private customRelationProvider: CustomRelationProviderInterface,
    @inject(ExtensionsModule.WorkspaceExtensionResource)
      private resource: ResourceInterface<ExtensionQueryParams, WorkspaceExtensionContext, WorkspaceExtensionResourceData>,
  ) { }

  async getExtensionByNamespace(namespace: string, trx?: Transaction): Promise<ExtensionDbRow> {
    return this.extensionProvider.getExtensionByNamespace(namespace, trx)
  }

  async getExtensionById(id: Id, trx?: Transaction): Promise<ExtensionDbRow> {
    return this.extensionProvider.getExtensionById(id, trx)
  }

  async getExtensionsByIds(ids: Id[], trx?: Transaction): Promise<ExtensionDbRow[]> {
    return this.extensionProvider.getExtensionsByIds(ids, trx)
  }

  async getRelationByName(extensionId: Id, relationName: string, trx?: Transaction): Promise<CustomRelationDbRow> {
    return this.customRelationProvider.getRelationByName(extensionId, relationName, trx)
  }

  async getRelationsByExtensionId(extensionId: Id, trx?: Transaction): Promise<CustomRelationDbRow[]> {
    return this.customRelationProvider.getRelationsByExtensionId(extensionId, trx)
  }

  async getRelationColumns(
    relation: CustomRelationDbRow,
    trx?: Transaction
  ): Promise<CustomRelationColumnDbRow[]> {
    return this.customRelationProvider.getRelationColumns(relation, trx)
  }

  async getRelationsColumns(relationIds: Id[], trx?: Transaction): Promise<CustomRelationColumnDbRow[]> {
    return this.customRelationProvider.getRelationsColumns(relationIds, trx)
  }

  async getExtensionInWorkspace(extensionId: Id, organizationId: Id): Promise<ExtensionInOrganizationDbRow> {
    return this.workspaceExtensionProvider.getExtensionInWorkspace(extensionId, organizationId)
  }

  async getWorkspaceExtensions(organizationId: Id, queryParams?: ExtensionQueryParams): Promise<WorkspaceExtension[]> {
    const { extensions } = await this.resource.getData(queryParams, { organizationId });
    return extensions;
  }

  async getExtensions(): Promise<ExtensionDbRow[]> {
    return this.extensionProvider.getExtensions()
  }

  async updateExtensionStatusInWorkspace(extensionId: Id, organizationId: Id, status: EntityStatus): Promise<UpdateExtensionStatusInWorkspaceResult> {

    const extension = await this.extensionProvider.getExtensionById(extensionId)

    if (!extension) {
      return { status: UpdateExtensionStatusInWorkspaceResultStatus.EXTENSION_NOT_FOUND }
    }

    await this.workspaceExtensionProvider.updateExtensionStatusInWorkspace(
      extensionId,
      organizationId,
      status,
    )

    return { status: UpdateExtensionStatusInWorkspaceResultStatus.OK }
  }
}
