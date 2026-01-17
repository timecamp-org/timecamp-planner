import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { PaginationModule } from './PaginationModule'
import { StandardPaginationService } from './StandardPaginationService';
import { PaginationServiceInterface } from './interfaces/PaginationServiceInterface';
import { PaginationServiceOptions, StandardPaginationToken, TimeRangePaginationToken, StandardPaginatorOptions, TimeRangePaginatorOptions } from './types';
import { TimeRangePaginationService } from './TimeRangePaginationService';
import { PaginationServiceFactoryInterface } from './interfaces/PaginationServiceFactoryInterface';
import { PaginationServiceFactory } from './PaginationServiceFactory';

export const paginationModule: ModuleLoaderType = kernel => {
  kernel
    .bind<PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>>(PaginationModule.StandardPaginationService)
    .to(StandardPaginationService);

  kernel
    .bind<PaginationServiceInterface<TimeRangePaginationToken, TimeRangePaginatorOptions>>(PaginationModule.TimeRangePaginationService)
    .to(TimeRangePaginationService);

  kernel
    .bind<PaginationServiceFactoryInterface>(PaginationModule.PaginationServiceFactoryInterface)
    .to(PaginationServiceFactory);

  kernel
    .bind<PaginationServiceOptions>(PaginationModule.PaginationServiceOptions)
    .toConstantValue({
      defaultLimit: 50,
      maxLimit: 100,
    });
}
