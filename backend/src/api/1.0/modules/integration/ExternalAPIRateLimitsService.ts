import { inject, injectable } from 'inversify'
import { ExternalAPIRateLimitsServiceInterface } from './interfaces/ExternalAPIRateLimitsServiceInterface'
import { CommonModule } from '../common/CommonModule'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { APIRateLimitDelay, DataImportJobInterface, IntegrationRateLimitDelay } from './types'
import { Maybe } from '../common/types'

@injectable()
export class ExternalAPIRateLimitsService implements ExternalAPIRateLimitsServiceInterface {
  private integrationRateLimitDelay: IntegrationRateLimitDelay = {}

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface
  ) {}

  public isJobRateLimited<T>(job: DataImportJobInterface<T>): boolean {
    const jobDescriptor = this.getJobDescriptor(job)
    const whenJobIsAllowed = this.getJobIntegrationDelay(jobDescriptor)

    if (!whenJobIsAllowed) {
      return false
    } else {
      const dateNow = this.timeService.getCurrentTime()
      if (this.timeService.isDate1AfterDate2(dateNow, whenJobIsAllowed)) {
        delete this.integrationRateLimitDelay[jobDescriptor]
        return false
      } else {
        return true
      }
    }
  }

  public setIntegrationRateLimitDelay<T>(job: DataImportJobInterface<T>, apiRateLimitDelay: APIRateLimitDelay) {
    const whenJobIsAllowed = this.timeService.getNowPlusNMilliseconds(apiRateLimitDelay)
    const jobDescriptor = this.getJobDescriptor<T>(job)
    this.integrationRateLimitDelay[jobDescriptor] = whenJobIsAllowed
  }

  private getJobIntegrationDelay(jobDescriptor: string): Maybe<Date> {
    return this.integrationRateLimitDelay[jobDescriptor]
  }

  private getJobDescriptor<T>(job: DataImportJobInterface<T>): string {
    return `${job.extensionId}/${job.organizationId}/${job.userId}`
  }
}