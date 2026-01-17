import { QueryModifier } from '../../services/types'
import { PageableQueryParams } from '../../api/1.0/modules/pagination/types'
import { Maybe } from '../../api/1.0/modules/common/types'
import { PaginatorInterface } from '../../api/1.0/modules/pagination/interfaces/PaginatorInterface'

export interface ResourceInterface<TResourceQueryParams, TContext, TResult> {

  getData(resourceQueryParams: TResourceQueryParams, context: TContext): PromiseLike<TResult>;

  getMetadata(resourceQueryParams: TResourceQueryParams, context: TContext): PromiseLike<Partial<TResult>>;

  getPaginator(queryParams: PageableQueryParams, context: TContext): Maybe<PaginatorInterface>

  getQueryDecorators(queryParams: TResourceQueryParams, context: TContext): QueryModifier[]
}