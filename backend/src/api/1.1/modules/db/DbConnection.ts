import { ConnectionInterface } from './ConnectionInterface'
import { inject, injectable } from 'inversify'
import { DbModule } from './DbModule'

import { Knex } from 'knex'

@injectable()
export class DbConnection implements ConnectionInterface
{
  constructor(
    @inject(DbModule.ConnectionInstance) 
    private connection: Knex<any, unknown[]>,
  ) { }

  getConnection<TRecord extends {} = any, TResult = any[]>(): Knex<TRecord, TResult> {
    return this.connection as Knex<TRecord, TResult>
  }

  getQueryBuilder<TRecord extends {} = any, TResult = any[]>(): QueryBuilder<TRecord, TResult> {
    const connection = this.getConnection<TRecord, TResult>()
    return connection.queryBuilder<TRecord, TResult>()
  }

  getQueryWithTransaction<TRecord extends {} = any, TResult = any[]>(trx: Transaction): QueryBuilder<TRecord, TResult> {
    const queryBuilder = this.getQueryBuilder() as QueryBuilder<TRecord, TResult>
    return trx ? queryBuilder.transacting(trx) : queryBuilder
  }
}