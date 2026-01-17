import { TimeRangePaginationToken, PaginatedResults } from '../types';

import { PaginatorInterface } from '../interfaces/PaginatorInterface';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import ConventionConverter = NamingConvention.ConventionConverter
import { NamingConvention } from '../../../../../utils';

export class TimeRangePaginator implements PaginatorInterface {
  constructor(
    private timeService: TimeServiceInterface,
    private dbNamingConvention: ConventionConverter,
    protected token: TimeRangePaginationToken,
    private fromColumn: string,
    private toColumn: string,
  ) { }

  async execute<T>(query: QueryBuilder): Promise<PaginatedResults<T>> {
    query = this.decorate(query);
    const results = await query;

    return {
      results,
    }
  }

  public decorate(qb: QueryBuilder): QueryBuilder {
    const queryClone = qb.clone();

    const converter = this.dbNamingConvention.convertIdentifier.bind(this.dbNamingConvention)
    const since = this.timeService.getTimeFromEpoch(parseInt(`${this.token.since}`))
    const before = this.timeService.getTimeFromEpoch(parseInt(`${this.token.before}`))
    const fromColumn = converter(this.fromColumn)
    const toColumn = converter(this.toColumn)

    queryClone.whereNot(query => {
      if (this.token.before) {
        query
          .whereRaw('?? >= ?', [fromColumn, before])
      }
      if (this.token.since) {
        query
          .andWhereRaw('?? <= ?', [toColumn, since])
      }
    })

    return queryClone
  }
}
