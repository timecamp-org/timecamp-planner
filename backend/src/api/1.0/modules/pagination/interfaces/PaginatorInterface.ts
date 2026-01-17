
import { PaginatedResults } from '../types';
import { Maybe } from '../../common/types'

export interface PaginatorInterface {
  execute<T>(query: QueryBuilder) : Promise<PaginatedResults<T>>;
  decorate(qb: QueryBuilder) : QueryBuilder;

  getPageToken?<T>(queryResult: T[]): Maybe<string>;
}