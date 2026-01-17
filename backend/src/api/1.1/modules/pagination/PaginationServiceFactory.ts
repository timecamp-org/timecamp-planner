import { PaginationServiceFactoryInterface } from './interfaces/PaginationServiceFactoryInterface';
import { injectable, inject } from 'inversify';
import { PaginationModule } from './PaginationModule';
import { PaginationServiceInterface } from './interfaces/PaginationServiceInterface';
import {
  StandardPaginationToken,
  StandardPaginatorOptions,
  TimeRangePaginatorOptions,
  TimeRangePaginationToken,
  PageableQueryParams,
  PaginationToken,
  PaginatorOptions
} from './types';

@injectable()
export class PaginationServiceFactory implements PaginationServiceFactoryInterface {
  constructor(
    @inject(PaginationModule.StandardPaginationService)
    private standardPaginationService: PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,
    @inject(PaginationModule.TimeRangePaginationService)
    private timeRangePaginationService: PaginationServiceInterface<TimeRangePaginationToken, TimeRangePaginatorOptions>,
  ) { }

  getPaginationService(queryParams: PageableQueryParams): PaginationServiceInterface<PaginationToken, PaginatorOptions> {
    const { since, before, limit, page } = queryParams

    if (since || before) {
      return this.timeRangePaginationService
    }

    if (limit || page) {
      return this.standardPaginationService
    }

    return null
  }


}