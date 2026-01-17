import { Id } from '../../common/identifier';
import { TaskTimeEstimatesProviderInterface } from '../interfaces/TaskTimeEstimatesProviderInterface';

import { inject, injectable } from 'inversify';
import { first } from 'lodash';
import { CommonModule } from '../../common/CommonModule';
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { TaskTimeEstimateDbRow } from '../../db/schema';

@injectable()
export class TaskTimeEstimatesProvider implements TaskTimeEstimatesProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface
  ) {}

  async createEstimate(payload: Partial<TaskTimeEstimateDbRow>, trx?: Transaction): Promise<TaskTimeEstimateDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const results = await query.into(Table.TASK_TIME_ESTIMATE).insert(payload).returning('*');

    return first(results);
  }

  async updateEstimate(payload: Partial<TaskTimeEstimateDbRow>, trx?: Transaction): Promise<TaskTimeEstimateDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    const results = await query
      .table(Table.TASK_TIME_ESTIMATE)
      .update({ ...payload, updatedAt: this.timeService.getCurrentTime() })
      .where({ taskId: payload.taskId })
      .returning('*');

    return first(results);
  }

  async deleteEstimate(taskId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.from(Table.TASK_TIME_ESTIMATE).where({ taskId }).del();
  }

  async getEstimate(taskId: Id, trx?: Transaction): Promise<TaskTimeEstimateDbRow> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.from(Table.TASK_TIME_ESTIMATE).where({ taskId }).select('*').first();
  }

  async getEstimates(taskIds: Id[], trx?: Transaction<any, unknown[]>): Promise<TaskTimeEstimateDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx);

    return await query.from(Table.TASK_TIME_ESTIMATE).whereIn('taskId', taskIds).select('*');
  }
}
