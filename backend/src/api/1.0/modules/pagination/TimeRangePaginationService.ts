import {
  EncodedPaginationToken,
  PaginationServiceOptions,
  TimeRangePaginationToken,
  TimeRangePaginatorOptions
} from './types';
import { NamingConvention } from '../../../../utils'
import ConventionConverter = NamingConvention.ConventionConverter
import { injectable, inject } from 'inversify';
import { PaginationModule } from './PaginationModule';
import { PaginatorInterface } from './interfaces/PaginatorInterface';
import { AbstractPaginationService } from './AbstractPaginationService';
import { CommonModule } from '../common/CommonModule';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';
import { TimeRangePaginator } from './paginators/TimeRangePaginator';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { DbModule } from '../db/DbModule';

@injectable()
export class TimeRangePaginationService
  extends AbstractPaginationService<TimeRangePaginationToken, TimeRangePaginatorOptions> {

  constructor(
    @inject(PaginationModule.PaginationServiceOptions)
    protected options: PaginationServiceOptions,
    @inject(DbModule.NamingConverter)
    private dbNamingConvention: ConventionConverter,
    @inject(CommonModule.JsonSerializerInterface)
    jsonSerializer: JsonSerializerInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
  ) {
    super(jsonSerializer, options)
    this.options = options
  }

  public getPaginator(paginationToken: EncodedPaginationToken, paginatorOptions: TimeRangePaginatorOptions): PaginatorInterface {
    const { since, before, fromColumn, toColumn } = paginatorOptions
    let token = paginationToken
      ? this.parsePaginationToken(paginationToken)
      : {}
      ;

    if (since || before) {
      token = { since, before }
    }

    return new TimeRangePaginator(this.timeService, this.dbNamingConvention, token, fromColumn, toColumn);
  }
}