

import { Id } from '../../common/identifier';
import { JobStatusDbRow } from '../../db/schema';
import { JobNamespace } from "../types";

export interface JobStatusProviderInterface {
  getOrCreateJobStatus(
    namespace: JobNamespace,
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): PromiseLike<JobStatusDbRow>;

  createJobStatus(
    namespace: JobNamespace,
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): PromiseLike<JobStatusDbRow>;
  
  getJobStatus(
    namespace: JobNamespace,
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): PromiseLike<JobStatusDbRow>;

  updateJobStatus(
    namespace: JobNamespace,
    payload: Partial<JobStatusDbRow>,
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): PromiseLike<void>;

  getUserInOrganizationJobStatuses(
    userId: Id,
    organizationId: Id,
    trx?: Transaction,
  ): PromiseLike<JobStatusDbRow[]>;

  incrementSpawnedJobs(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    incrementBy?: number,
    trx?: Transaction,
  ): PromiseLike<void>;

  incrementDoneJobs(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    trx?: Transaction,
  ): PromiseLike<void>;
}
