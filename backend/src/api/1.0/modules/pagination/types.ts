export type EncodedPaginationToken = string;

export interface StandardPaginationToken
{
  limit?: number,
  last?: any[]
}

export interface StandardPaginatorOptions
{
  limit?: number,
  columns: string[]
}

export interface TimeRangePaginationToken
{
  since?: number,
  before?: number,
}

export interface TimeRangePaginatorOptions
{
  since?: number,
  before?: number,
  fromColumn?: string,
  toColumn?: string,
}

export type PaginationToken = StandardPaginationToken | TimeRangePaginationToken

export type PaginatorOptions = StandardPaginatorOptions | TimeRangePaginatorOptions

export interface PaginatedResults<T> {
  results: T[],
  nextPage?: EncodedPaginationToken
}

export interface PaginationServiceOptions {
  defaultLimit: number,
  maxLimit: number,
}

export type ComparatorType = <T>(a: T, b: T) => number

export interface PageableQueryParams {
  page?: string,
  since?: number,
  before?: number,
  limit?: number,
}