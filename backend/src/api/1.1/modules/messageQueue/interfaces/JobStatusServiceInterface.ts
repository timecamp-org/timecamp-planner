import { Id } from '../../common/identifier';
import { JobStatusDbRow } from '../../db/schema';
import { JobNamespace } from '../types';


export interface JobStatusServiceInterface {
  startNewJobIteration(
    namespace: JobNamespace,
    userId?: Id,
    organizationId?: Id,
    trx?: Transaction,
  ): PromiseLike<void>;

  incrementSpawnedJobs(
    namespace: JobNamespace,
    userId?: Id,
    organizationId?: Id,
    incrementBy?: number,
    trx?: Transaction,
  ): PromiseLike<void>;

  incrementDoneJobs(
    namespace: JobNamespace,
    userId?: Id,
    organizationId?: Id,
    trx?: Transaction,
  ): PromiseLike<void>;

  updateJobStatus(
    namespace: JobNamespace,
    payload: Partial<JobStatusDbRow>,
    userId?: Id,
    organizationId?: Id,
    trx?: Transaction,
  ): PromiseLike<void>;

  getUserInOrganizationJobStatuses(
    userId: Id,
    organizationId: Id,
  ): PromiseLike<JobStatusDbRow[]>;
}
