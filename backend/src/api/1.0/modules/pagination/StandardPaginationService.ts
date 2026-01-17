import { NamingConvention } from '../../../../utils'
import ConventionConverter = NamingConvention.ConventionConverter
import { EncodedPaginationToken, PaginationServiceOptions, StandardPaginationToken, StandardPaginatorOptions } from './types';
import { injectable, inject } from 'inversify';
import { DbModule } from '../db/DbModule';
import { PaginationModule } from './PaginationModule';
import { PaginatorInterface } from './interfaces/PaginatorInterface';
import { StandardPaginator } from './paginators/StandardPaginator';
import { AbstractPaginationService } from './AbstractPaginationService';
import { CommonModule } from '../common/CommonModule';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';

@injectable()
export class StandardPaginationService
  extends AbstractPaginationService<StandardPaginationToken, StandardPaginatorOptions> {

  constructor(
    @inject(DbModule.NamingConverter) 
    private dbNamingConvention: ConventionConverter,
    @inject(PaginationModule.PaginationServiceOptions) 
    protected options: PaginationServiceOptions,
    @inject(CommonModule.JsonSerializerInterface) 
    jsonSerializer: JsonSerializerInterface,
  ) {
    super(jsonSerializer, options)
    this.options = options
  }

  public getPaginator(paginationToken: EncodedPaginationToken, paginatorOptions: StandardPaginatorOptions): PaginatorInterface {
    const { limit, columns } = paginatorOptions
    const defaultLimit = limit || this.options.defaultLimit;
    const token = paginationToken
      ? this.parsePaginationToken(paginationToken)
      : {
        limit: defaultLimit
      }
      ;

    if (limit) {
      token.limit = limit
    }

    if (token.limit) {
      token.limit = Math.min(token.limit, this.options.maxLimit)
    }

    return new StandardPaginator(this, this.dbNamingConvention, token, columns);
  }
}