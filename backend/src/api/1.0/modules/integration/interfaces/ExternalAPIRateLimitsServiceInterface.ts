import { APIRateLimitDelay, DataImportJobInterface } from '../types'

export interface ExternalAPIRateLimitsServiceInterface {
  setIntegrationRateLimitDelay<T>(job: DataImportJobInterface<T>, apiRateLimitDelay: APIRateLimitDelay): void
  isJobRateLimited<T>(job: DataImportJobInterface<T>): boolean
}