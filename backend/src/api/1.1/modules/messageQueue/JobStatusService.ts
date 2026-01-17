import { JobStatusServiceInterface } from './interfaces/JobStatusServiceInterface';
import { Id } from '../common/identifier';
import { injectable, inject } from 'inversify';
import { MessageQueueModule } from './MessageQueueModule';
import { JobStatusProviderInterface } from './interfaces/JobStatusProviderInterface';
import { JobStatusDbRow } from '../db/schema';
import { JobNamespace } from './types';


@injectable()
export class JobStatusService implements JobStatusServiceInterface {

  constructor(
    @inject(MessageQueueModule.JobStatusProviderInterface)
    private jobStatusProvider: JobStatusProviderInterface
  ) { }

  async startNewJobIteration(
    namespace: JobNamespace, 
    userId: Id, 
    organizationId: Id, 
    trx?: Transaction
  ): Promise<void> {
    const jobStatus = await this.jobStatusProvider.getOrCreateJobStatus(namespace, userId, organizationId, trx)
    return await this.jobStatusProvider.updateJobStatus(
      namespace,
      {
        jobsSpawned: 0,
        jobsDone: 0,
        isFailed: false,
        iterationCount: jobStatus.iterationCount + 1
      },
      userId,
      organizationId,
      trx,
    )
  }

  async incrementSpawnedJobs(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    incrementBy?: number,
    trx?: Transaction,
  ): Promise<void> {
    await this.jobStatusProvider.incrementSpawnedJobs(namespace, userId, organizationId, incrementBy || 1, trx)
  }  
  
  async incrementDoneJobs(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): Promise<void> {
    this.jobStatusProvider.incrementDoneJobs(namespace, userId, organizationId, trx)
  } 

  async updateJobStatus(
    namespace: JobNamespace,
    payload: Partial<JobStatusDbRow>,
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ) {
    return await this.jobStatusProvider.updateJobStatus(namespace, payload, userId, organizationId, trx)
  }

  async getUserInOrganizationJobStatuses(userId: Id, organizationId: Id): Promise<JobStatusDbRow[]> {
    return this.jobStatusProvider.getUserInOrganizationJobStatuses(userId, organizationId)
  }

}
