import { ResourceInterface } from './ResourceInterface';
import { PromisesMap, AnyDict, Maybe } from '../../api/1.0/modules/common/types';
import { injectable } from 'inversify';
import promiseAllProperties from '../../utils/promiseAllProperties';
import { QueryModifier } from '../../services/types';
import { PaginationServiceFactoryInterface } from '../../api/1.0/modules/pagination/interfaces/PaginationServiceFactoryInterface';
import { PageableQueryParams, PaginatorOptions } from '../../api/1.0/modules/pagination/types';
import { ResourceQueryParams } from './types';
import { PaginatorInterface } from '../../api/1.0/modules/pagination/interfaces/PaginatorInterface'

@injectable()
export abstract class AbstractResource<
  TResourceQueryParams extends ResourceQueryParams, TContext, TResult
  >
implements ResourceInterface<TResourceQueryParams, TContext, TResult> {

  constructor(
    private paginationServiceFactory: PaginationServiceFactoryInterface,
  ) { }

  abstract getData(queryParams: TResourceQueryParams, context: TContext): Promise<TResult>

  async getMetadata(
    resourceQueryParams: TResourceQueryParams,
    context: TContext,
  ): Promise<Partial<TResult>> {
    const resouceMetadataPromises = this.buildResourceMetadata(resourceQueryParams, context)
    return await promiseAllProperties<Partial<TResult>>(resouceMetadataPromises)
  }

  private buildResourceMetadata(
    resourceQueryParams: TResourceQueryParams,
    context: TContext,
  ): PromisesMap<Partial<TResult>> {
    let metadataFields: string[] = []
    if (resourceQueryParams.metadata) {
      metadataFields = Array.isArray(resourceQueryParams.metadata) ? resourceQueryParams.metadata : resourceQueryParams.metadata.split(',')
    }
    const promiseMap: PromisesMap<Partial<TResult>> = {}

    for (const field of metadataFields) {
      const promise = this.getMetadataPromiseForField(field, context)
      if (promise) {
        promiseMap[field] = promise
      }
    }

    return promiseMap
  }

  protected getColumnNames(queryParams: TResourceQueryParams): Maybe<string[]> {
    const { fields } = queryParams
    if (fields) {
      return fields.split(',')
    }
  }

  protected abstract getMetadataPromiseForField(field: string, context: TContext): PromiseLike<AnyDict>;

  protected abstract getPaginatorOptions(queryParams: PageableQueryParams): PaginatorOptions;

  public getPaginator(queryParams: PageableQueryParams, context: TContext): Maybe<PaginatorInterface> {
    const { page } = queryParams
    const paginationService = this.paginationServiceFactory.getPaginationService(queryParams)

    if (!paginationService) {
      return null
    }
    return paginationService.getPaginator(page, this.getPaginatorOptions(queryParams))
  }

  abstract getQueryDecorators(queryParams: PageableQueryParams, context: TContext): QueryModifier[]
}