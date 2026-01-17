import { PaginatedResults, StandardPaginationToken, StandardPaginatorOptions } from '../types';
import { PaginationServiceInterface } from '../interfaces/PaginationServiceInterface';

import ConventionConverter = NamingConvention.ConventionConverter
import { NamingConvention } from '../../../../../utils';
import { PaginatorInterface } from '../interfaces/PaginatorInterface';
import { Maybe } from '../../common/types'

export class StandardPaginator implements PaginatorInterface
{
  constructor(
    private service : PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,
    private dbNamingConvention: ConventionConverter,
    protected token: StandardPaginationToken, 
    private columns: string[]
  ) {
  }

  async execute<T>(query: QueryBuilder) : Promise<PaginatedResults<T>> {
    query = this.decorate(query);
    const results = await query;

    const nextPage = this.getPageToken(results)
    
    return {
      results,
      nextPage
    }
  }

  public getPageToken<T>(queryResult: T[]): Maybe<string> {
    const resultCount = queryResult.length;
    const hasMore = (resultCount === this.token.limit + 1);
    let nextPage = null;

    if (hasMore) {
      // This result row is only used to determine if there are more result.
      queryResult.pop();

      const lastRow = queryResult[resultCount - 2];

      const last = this.columns
        .map(columnName => lastRow[columnName]);


      nextPage = this.service.encodeToken({
        last,
        limit: this.token.limit
      });
    }

    return nextPage
  }

  public decorate(qb: QueryBuilder) : QueryBuilder {
    const clone = qb.clone();
    const columnCount = this.columns.length;
    const columnNames = this.columns.map(this.dbNamingConvention.convertIdentifier.bind(this.dbNamingConvention));
    const questionMarks = Array(columnCount).fill('?').join(', ');
    clone.limit(this.token.limit + 1);
    if (this.token.last) {
      clone.whereRaw(
        `(${columnNames.join(', ')}) < (${questionMarks})`,
        this.token.last
      );
    }

    for (const column of this.columns) {
      clone.orderBy(column, 'desc');
    }

    return clone;
  }
}
