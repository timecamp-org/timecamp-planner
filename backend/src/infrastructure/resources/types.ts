export interface ResourceQueryParams {
  page?: string,
  since?: number,
  before?: number,
  limit?: number,
  metadata?: string | string[],
  fields?: string,
}

export enum BaseQueryFieldValue {
  ALL = 'all'
}