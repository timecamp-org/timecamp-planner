import { injectable, unmanaged } from 'inversify'
import { DataImportSubWorkerInterface } from './interfaces/DataImportSubWorkerInterface'
import { JobStatusServiceInterface } from '../messageQueue/interfaces/JobStatusServiceInterface'
import {
  APIRateLimitDelay,
  DataImportJobInterface,
  FetchExternalDataResult,
  FetchExternalDataResultStatus,
  HandleRateLimitResult,
  HandleRateLimitStatus,
  WorkerHandleResult,
  WorkerHandleStatus,
} from './types'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { JobType, JobNamespace, MessageOptions } from '../messageQueue/types'
import { MessageQueuePublisherInterface } from '../messageQueue/interfaces/MessageQueuePublisherInterface'
import { QueueDescriptorInterface } from '../messageQueue/interfaces/QueueDescriptorInterface'
import { ExternalAPIRateLimitsServiceInterface } from './interfaces/ExternalAPIRateLimitsServiceInterface';

@injectable()
export abstract class AbstractDataImportSubWorker<T extends DataImportJobInterface<JobType>, TExternalData, TParsedData>
implements DataImportSubWorkerInterface<T, TExternalData, TParsedData> {
  constructor(
    @unmanaged() protected jobType: JobType,
    @unmanaged() protected jobNamespace: JobNamespace,
    @unmanaged() protected apiRateLimitDelay: APIRateLimitDelay,
    protected logger: LoggerInterface,
    protected jobStatusService: JobStatusServiceInterface,
    protected apiRateLimitsService: ExternalAPIRateLimitsServiceInterface,
    protected mqDelayedPublisher: MessageQueuePublisherInterface,
    protected delayedQueue: QueueDescriptorInterface,
    protected delayedQueueMessageOptionsFactory: (delay: number) => MessageOptions
  ) { }

  public async supports(job: T): Promise<boolean> {
    return job.type === this.jobType
  }

  public async handle(job: T): Promise<WorkerHandleResult> {
    const { organizationId, userId, extensionId, id } = job
    const jobDescriptor = `${this.jobNamespace}/${this.jobType}/${id}`
    try {
      this.logger.info(`Starting data import ${this.jobType} for user: ${userId} in org: ${organizationId} for extId: ${extensionId}`)

      // 1. HANDLE RATE LIMIT (if persisted)
      const { status: jobRateLimitStatus } = await this.getJobRateLimitStatus(job)
      if (jobRateLimitStatus === HandleRateLimitStatus.RATE_LIMIT_VIOLATED) {
        await this.spawnDelayedJob(job)
        return {
          status: WorkerHandleStatus.OK
        }
      }
      // 2. FETCH DATA STEP ( handle rate limit if 429)
      const { status: fetchDataStatus, result: externalData } = await this.fetchData(job)

      switch (fetchDataStatus) {
        case FetchExternalDataResultStatus.OK: {
          break;
        }
        case FetchExternalDataResultStatus.RATE_LIMIT_VIOLATED: {
          await this.spawnDelayedJob(job)
          return {
            status: WorkerHandleStatus.OK
          }
        }
        case FetchExternalDataResultStatus.UNAUTHORIZED: {
          return {
            status: WorkerHandleStatus.UNAUTHORIZED
          }
        }
      }

      // 3. COMPARE WITH CURRENT EXTERNAL <-> INTERNAL IDS MAP
      const filteredData = await this.filterOutExistingData(externalData, job)
      // 4. PARSE DATA BEFORE INSERTING
      const parsedData = await this.parseData(filteredData, job)
      // 5. INSERT DATA WITH TRANSACTION - [ entities, external/internal bindings ]
      await this.insertData(parsedData, job)
      // 6. SPAWN NEW JOBS
      const spawnedJobsCount = await this.spawnNewJobs(externalData, job)

      if (spawnedJobsCount > 0) {
        await this.jobStatusService.incrementSpawnedJobs(this.jobNamespace, userId, organizationId, spawnedJobsCount)
      }

      await this.jobStatusService.incrementDoneJobs(this.jobNamespace, userId, organizationId)
      this.logger.info(`Finished data import ${this.jobType} for user: ${userId} in org: ${organizationId} for extId: ${extensionId}`)

      return {
        status: WorkerHandleStatus.OK
      }
    } catch (error) {
      this.logger.error(`Job ${jobDescriptor} failed`, error)
      await this.jobStatusService.updateJobStatus(this.jobNamespace, { isFailed: true }, userId, organizationId)
      return {
        status: WorkerHandleStatus.FAILED,
        error
      }
    }
  }

  private getJobRateLimitStatus(job: T): HandleRateLimitResult {
    if (this.apiRateLimitsService.isJobRateLimited(job)) {
      return {
        status: HandleRateLimitStatus.RATE_LIMIT_VIOLATED,
      }
    } else {
      return {
        status: HandleRateLimitStatus.RATE_LIMIT_UNTOUCHED,
      }
    }
  }

  private async spawnDelayedJob(job: T): Promise<void> {
    await this.mqDelayedPublisher.publish(
      job,
      this.delayedQueue,
      this.delayedQueueMessageOptionsFactory(this.apiRateLimitDelay)
    )
  }

  public abstract fetchData(job: T): Promise<FetchExternalDataResult<TExternalData>>;

  public abstract filterOutExistingData(externalData: TExternalData, job: T): Promise<TExternalData>;

  public abstract parseData(externalData: TExternalData, job: T): TParsedData;

  public abstract insertData(parsedData: TParsedData, job: T): Promise<void>;

  public abstract spawnNewJobs(externalData: TExternalData, job: T): Promise<number>;

}
