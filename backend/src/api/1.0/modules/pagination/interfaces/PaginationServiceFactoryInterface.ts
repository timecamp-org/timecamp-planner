import { PaginationServiceInterface } from './PaginationServiceInterface';
import { PaginatorOptions, PaginationToken, PageableQueryParams } from '../types';
import { Maybe } from '../../common/types';

export interface PaginationServiceFactoryInterface {

  getPaginationService(queryParams: PageableQueryParams): Maybe<PaginationServiceInterface<PaginationToken, PaginatorOptions>>
}