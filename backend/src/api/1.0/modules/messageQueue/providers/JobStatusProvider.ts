import { JobStatusProviderInterface } from '../interfaces/JobStatusProviderInterface';
import Table from '../../db/Table';

import { injectable, inject } from 'inversify';
import { Id } from '../../common/identifier';
import { JobStatusDbRow } from '../../db/schema';
import { first } from 'lodash'
import { CommonModule } from '../../common/CommonModule';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import { JobNamespace } from '../types';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';

@injectable()
export class JobStatusProvider implements JobStatusProviderInterface {

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getOrCreateJobStatus(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): Promise<JobStatusDbRow> {
    const jobStatus = await this.getJobStatus(namespace, userId, organizationId, trx)
    if (!jobStatus) {
      return await this.createJobStatus(namespace, userId, organizationId, trx)
    }
    return jobStatus
  }

  async getJobStatus(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): Promise<JobStatusDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .where({
        namespace,
        userId,
        organizationId,
      })
      .from(Table.JOBS_JOB_STATUS)
      .first()
  }

  async createJobStatus(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): Promise<JobStatusDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .insert({
        namespace,
        userId,
        organizationId
      })
      .into(Table.JOBS_JOB_STATUS)
      .returning('*')
      .then(first) as JobStatusDbRow
  }
  
  async updateJobStatus(
    namespace: JobNamespace, 
    payload: Partial<JobStatusDbRow>,
    userId: Id,
    organizationId: Id,
    trx?: Transaction
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await this.getOrCreateJobStatus(namespace, userId, organizationId, trx)
    await query
      .from(Table.JOBS_JOB_STATUS)
      .update({
        ...payload,
        updatedAt: this.timeService.getCurrentTime()
      })
      .where({
        namespace,
        userId,
        organizationId
      })
  }

  async getUserInOrganizationJobStatuses(
    userId: Id,
    organizationId: Id,
    trx?: Transaction,
  ): Promise<JobStatusDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .where({
        userId,
        organizationId,
      })
      .from(Table.JOBS_JOB_STATUS)
  }

  async incrementSpawnedJobs(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    incrementBy?: number,
    trx?: Transaction,
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.JOBS_JOB_STATUS)
      .increment('jobs_spawned', incrementBy)
      .where({
        namespace,
        userId,
        organizationId
      })
  }

  async incrementDoneJobs(
    namespace: JobNamespace, 
    userId: Id,
    organizationId: Id,
    trx?: Transaction,
  ): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.JOBS_JOB_STATUS)
      .increment('jobs_done', 1)
      .where({
        namespace,
        userId,
        organizationId
      })
  }

}
