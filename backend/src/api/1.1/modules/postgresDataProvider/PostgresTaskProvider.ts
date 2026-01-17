import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface'
import { TaskDbRow, TaskRole } from '../db/schema'
import { injectable } from 'inversify'
import Table from '../db/Table'
import { AbstractPostgresProvider } from './AbstractPostgresProvider'
import { Id } from '../common/identifier'
import { TasksAssigneeIdsMap, UserLatestVisitedTaskData } from '../tasks/types'

import { EntityStatus } from '../common/enum'

import { first } from 'lodash'
import { QueryModifier } from '../../../../services/types'

@injectable()
export class PostgresTaskProvider
  extends AbstractPostgresProvider
  implements TaskProviderInterface {
  protected static readonly Column = {
    DUE_DATE: 'dueDate'
  };

  async getTaskById(id: Id, trx?: Transaction): Promise<TaskDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .first()
      .where('id', id)
      .from(Table.TASK)
  }

  async getTasksByIds(tasksIds: Id[], trx?: Transaction, queryDecorators?: QueryModifier[]): Promise<TaskDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    let tasksQuery = query
      .select(`${Table.TASK}.*`)
      .from(Table.TASK)
      .whereIn(`${Table.TASK}.id`, tasksIds)

    if (queryDecorators) {
      for (const decorateQuery of queryDecorators) {
        if (decorateQuery) {
          tasksQuery = decorateQuery(tasksQuery)
        }
      }
    }

    return await tasksQuery
  }

  async getTasksWithDueDateBetween(between: Date, and: Date): Promise<TaskDbRow[]> {
    //todo add db index on due date
    const qb = this.connection.getQueryBuilder();
    return await qb.from(Table.TASK)
      .whereBetween(PostgresTaskProvider.Column.DUE_DATE, [between, and]);
  }

  async getTaskAssigneeIds(taskId: Id, trx?: Transaction): Promise<Id[]> {
    const result = await this.connection.getQueryWithTransaction(trx)
      .select()
      .from(Table.USER_IN_TASK)
      .where({ taskId: taskId, role: TaskRole.ASSIGNEE });

    return result.map(row => row.userId)
  }

  async getTasksAssigneeIds(taskIds: Id[]): Promise<TasksAssigneeIdsMap> {
    const result = await this.connection.getQueryBuilder()
      .select('userId', 'taskId')
      .from(Table.USER_IN_TASK)
      .whereIn('taskId', taskIds)
      .andWhere({ role: TaskRole.ASSIGNEE })

    return result.reduce((acc, userInTask) => {
      const { userId, taskId } = userInTask
      if (acc.taskId) {
        acc[taskId].push(userId)
      } else {
        acc[taskId] = [userId]
      }

      return acc
    }, {})
  }

  async getUserTasksWithDueOrStartDates(userId: Id, organizationId: Id): Promise<TaskDbRow[]> {
    return await this.connection.getQueryBuilder()
      .select(`${Table.TASK}.*`)
      .from(Table.TASK)
      .join(Table.USER_IN_TASK, `${Table.TASK}.id`, `${Table.USER_IN_TASK}.taskId`)
      .join(Table.PROJECT, `${Table.TASK}.projectId`, `${Table.PROJECT}.id`)
      .join(Table.TASK_LIST, `${Table.TASK}.taskListId`, `${Table.TASK_LIST}.id`)
      .where({ userId })
      .andWhere({
        [`${Table.PROJECT}.organizationId`]: organizationId,
        [`${Table.TASK}.isArchived`]: false,
        [`${Table.TASK_LIST}.isArchived`]: false,
        [`${Table.PROJECT}.isArchived`]: false,
        [`${Table.PROJECT}.status`]: EntityStatus.EXISTS,
      })
      .andWhere(function () {
        this
          .whereNotNull(`${Table.TASK}.startDate`)
          .orWhereNotNull(`${Table.TASK}.dueDate`)
      })
  }

  async getUserLatestVisitedTasks(userId: Id, organizationId: Id, count: number): Promise<UserLatestVisitedTaskData[]> {
    return await this.connection.getQueryBuilder()
      .select(`${Table.TASK}.*`, `${Table.TASK_LATEST_VISIT}.latestVisitedAt`)
      .from(Table.TASK_LATEST_VISIT)
      .join(Table.TASK, `${Table.TASK_LATEST_VISIT}.taskId`, `${Table.TASK}.id`)
      .join(Table.PROJECT, `${Table.TASK}.projectId`, `${Table.PROJECT}.id`)
      .join(Table.USER_IN_PROJECT, `${Table.TASK}.projectId`, `${Table.USER_IN_PROJECT}.projectId`)
      .where({
        [`${Table.TASK_LATEST_VISIT}.userId`]: userId,
        [`${Table.PROJECT}.organizationId`]: organizationId,
        [`${Table.PROJECT}.status`]: EntityStatus.EXISTS,
        [`${Table.TASK}.isArchived`]: false,
      })
      .andWhere(function () {
        this.where(`${Table.USER_IN_PROJECT}.userId`, '=', userId)
        this.orWhere(`${Table.PROJECT}.isPrivate`, '=', false)
      })
      .groupBy(`${Table.TASK}.id`, `${Table.TASK_LATEST_VISIT}.latestVisitedAt`)
      .orderBy(`${Table.TASK_LATEST_VISIT}.latestVisitedAt`, 'desc')
      .limit(count)
  }

  async setUserLatestTaskVisitDate(userId: Id, taskId: Id, visitedAt: Date): Promise<void> {
    const connection = this.connection.getConnection()
    const queryParams = {
      table: Table.TASK_LATEST_VISIT,

      userId: connection.raw('?', userId),
      taskId: connection.raw('?', taskId),
      latestVisitedAt: connection.raw('?', visitedAt),
    }

    const query = 'INSERT INTO :table: '
      + '(user_id, task_id, latest_visited_at) VALUES '
      + '(:userId:, :taskId:, :latestVisitedAt:) '
      + 'ON CONFLICT (user_id, task_id) DO UPDATE SET '
      + 'latest_visited_at = :latestVisitedAt:'

    await connection.raw(query, queryParams)
  }

  async getTasksIdsWhereAsignees(asigneesIds: Id[], trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.USER_IN_TASK)
      .whereIn('userId', asigneesIds)
      .where('role', TaskRole.ASSIGNEE)
      .pluck('task_id')
  }

  async insertTasks(tasks: TaskDbRow[], trx?: Transaction): Promise<TaskDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .insert(tasks)
      .into(Table.TASK)
      .returning('*')
  }

  async insertTask(task: Partial<TaskDbRow>, trx?: Transaction): Promise<TaskDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .insert(task)
      .into(Table.TASK)
      .returning('*')
      .then(first) as TaskDbRow
  }

  async getFirstVisibleTaskIdInList(taskListId: Id): Promise<Id> {
    return await this.connection.getQueryBuilder()
      .select('id')
      .from(Table.TASK)
      .where({ taskListId, isArchived: false })
      .orderBy('order')
      .first()
      .then((result: TaskDbRow) => result ? result.id : null)
  }
}
