import { Knex } from 'knex'
export interface ConnectionInterface
{
  getConnection<TRecord extends {} = any, TResult = any[]>() : Knex<TRecord, TResult>
  getQueryBuilder() : QueryBuilder
  getQueryWithTransaction<TRecord extends {} = any, TResult = any[]>(trx: Transaction) : QueryBuilder<TRecord, TResult>
}