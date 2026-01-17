import { TrelloApiErrorHandlerInterface } from './interfaces/TrelloApiErrorHandlerInterface';
import { FetchExternalDataResultStatus, APIRateLimitDelay, FetchExternalDataResult } from '../types';
import { TrelloDataImportJobInterface, TrelloError } from './types'
import { injectable, inject } from 'inversify';
import { HttpStatus } from '../../../../../infrastructure/enum';
import { IntegrationModule } from '../IntegrationModule';
import { ExternalAPIRateLimitsServiceInterface } from '../interfaces/ExternalAPIRateLimitsServiceInterface';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';

@injectable()
export class TrelloApiErrorHandler implements TrelloApiErrorHandlerInterface {
  constructor(
    @inject(IntegrationModule.ExternalAPIRateLimitsService)
    protected apiRateLimitsService: ExternalAPIRateLimitsServiceInterface,
    @inject(InfrastructureModule.LoggerInterface)
    protected logger: LoggerInterface,
  ) { }

  handleError<T>(job: TrelloDataImportJobInterface, error: TrelloError): FetchExternalDataResult<T> {
    this.logger.error(error)
    switch (error.statusCode) {
      case HttpStatus.TOO_MANY_REQUESTS: {
        this.apiRateLimitsService.setIntegrationRateLimitDelay(job, APIRateLimitDelay.TRELLO)
        return {
          status: FetchExternalDataResultStatus.RATE_LIMIT_VIOLATED,
        }
      }
      case HttpStatus.UNAUTHORIZED: {
        return {
          status: FetchExternalDataResultStatus.UNAUTHORIZED,
        }
      }
      default: {
        throw error
      }
    }
  }
}
