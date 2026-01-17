import { TaskDbRow } from '../../db/schema'
import { Id } from '../../common/identifier';
import { TasksAssigneeIdsMap, UserLatestVisitedTaskData } from '../types'

import { QueryModifier } from '../../../../../services/types';

export interface TaskProviderInterface
{
  getTaskById(id: Id, trx?: Transaction): PromiseLike<TaskDbRow>;

  getTasksByIds(tasksIds: Id[], trx?: Transaction, queryDecorators?: QueryModifier[]): PromiseLike<TaskDbRow[]>;
  
  getTasksWithDueDateBetween(between: Date, and: Date) : PromiseLike<TaskDbRow[]>

  getTaskAssigneeIds(taskId: Id, trx?: Transaction) : PromiseLike<Id[]>;

  getTasksAssigneeIds(taskIds: Id[]): PromiseLike<TasksAssigneeIdsMap>

  getUserTasksWithDueOrStartDates(userId: Id, organizationId: Id) : PromiseLike<TaskDbRow[]>;

  getUserLatestVisitedTasks(userId: Id, organizationId: Id, count: number): PromiseLike<UserLatestVisitedTaskData[]>

  setUserLatestTaskVisitDate(userId: Id, taskId: Id, visitedAt: Date): PromiseLike<void>

  getTasksIdsWhereAsignees(asigneesIds: Id[], trx?: Transaction): PromiseLike<Id[]>;

  insertTasks(tasks: TaskDbRow[], trx?: Transaction): Promise<TaskDbRow[]>;

  insertTask(task: Partial<TaskDbRow>, trx?: Transaction): Promise<TaskDbRow>;
  
  setUserLatestTaskVisitDate(userId: Id, taskId: Id, visitedAt: Date): Promise<void>;

  getFirstVisibleTaskIdInList(taskListId: Id): PromiseLike<Id>;
}
