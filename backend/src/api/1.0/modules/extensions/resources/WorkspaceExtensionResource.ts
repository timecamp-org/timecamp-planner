import { AbstractResource } from '../../../../../infrastructure/resources/AbstractResource';
import {
  ExtensionQueryParams,
  WorkspaceExtensionContext,
  WorkspaceExtensionResourceData,
  ExtensionNamespace
} from '../types';
import { inject, injectable } from 'inversify';
import { PageableQueryParams, TimeRangePaginatorOptions } from '../../pagination/types'
import { AnyDict } from '../../common/types';
import { ExtensionsModule } from '../ExtensionsModule';
import { WorkspaceExtensionProviderInterface } from '../interfaces/WorkspaceExtensionProviderInterface';
import { PaginationModule } from '../../pagination/PaginationModule';
import { PaginationServiceFactoryInterface } from '../../pagination/interfaces/PaginationServiceFactoryInterface';
import { ExtensionProviderInterface } from '../interfaces/ExtensionProviderInterface';
import { get, keyBy } from 'lodash';
import { ExtensionDbRow } from '../../db/schema';
import { EntityStatus } from '../../common/enum';
import { parseCommaSeparatedQueryField } from '../../../../../utils';
import { QueryModifier } from '../../../../../services/types'

@injectable()
export class WorkspaceExtensionResource extends AbstractResource<ExtensionQueryParams, WorkspaceExtensionContext, WorkspaceExtensionResourceData> {
  constructor(
    @inject(ExtensionsModule.WorkspaceExtensionProviderInterface)
    private workspaceExtensionProvider: WorkspaceExtensionProviderInterface,
    @inject(ExtensionsModule.ExtensionProviderInterface)
    private extensionProvider: ExtensionProviderInterface,
    @inject(PaginationModule.PaginationServiceFactoryInterface)
    paginationServiceFactory: PaginationServiceFactoryInterface,
  ) {
    super(paginationServiceFactory)
  }

  async getData(queryParams: ExtensionQueryParams, context: WorkspaceExtensionContext): Promise<WorkspaceExtensionResourceData> {
    const extensionNamespaces = parseCommaSeparatedQueryField<ExtensionNamespace>(queryParams, 'namespaces', null)

    let extensions;
    if (extensionNamespaces && extensionNamespaces.length > 0) {
      extensions = await this.extensionProvider.getExtensionsByNamespaces(extensionNamespaces)
    } else {
      extensions = await this.extensionProvider.getExtensions()
    }

    const extensionsInOrganization = await this.workspaceExtensionProvider.getWorkspaceExtensions(context.organizationId, extensions)

    const extensionsInWorkspaceMap = keyBy(extensionsInOrganization, 'extensionId')

    const workspaceExtensions = extensions.map((extension: ExtensionDbRow) => {
      return {
        ...extension,
        status: get(extensionsInWorkspaceMap, `${extension.id}.status`) || EntityStatus.DELETED,
      }
    })

    return {
      extensions: workspaceExtensions
    }
  }

  public getPaginatorOptions(queryParams: ExtensionQueryParams): TimeRangePaginatorOptions {
    return null
  }

  protected getMetadataPromiseForField(field: string, context: WorkspaceExtensionContext): PromiseLike<AnyDict> {
    return null
  }

  public getQueryDecorators(queryParams: PageableQueryParams, context: WorkspaceExtensionContext): QueryModifier[] {
    return null
  }
}