import { CronTabJobInterface } from '../cron/CronTabJobInterface'
import { inject, injectable } from 'inversify'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { CommonModule } from '../common/CommonModule'
import { TaskProviderInterface } from './interfaces/TaskProviderInterface'
import { TasksModule } from './TasksModule'

import Table from '../db/Table';
import { TaskRecurrenceSettingsDbRow, TaskDbRow, TaskRecurrenceDependencyDbRow, TaskStatus } from '../db/schema';
import { Id } from 'aws-sdk/clients/kinesisanalytics';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { RecurrenceSettingsData, CopyTaskStatus } from './types';

import { IdGeneratorInterface } from '../common/identifier';
import { first } from 'lodash'
import { TaskServiceInterface } from './interfaces/TaskServiceInterface';
import {
  addDays,
  setDate,
  setMonth,
  addWeeks,
  addMonths,
  addYears,
  startOfMonth as getStartOfMonth,
  startOfWeek as getStartOfWeek,
  startOfDay as getStartOfDay,
  isToday,
  isBefore,
  getDate,
  differenceInDays as getDiffInDays,
} from 'date-fns'
import { PeriodType, Maybe, Position } from '../common/types';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { ListsModule } from '../lists/ListsModule';
import { OrderServiceInterface } from '../order/OrderServiceInterface';
import { OrderModule } from '../order/OrderModule';
import { OrderServiceFactoryInterface } from '../order/OrderServiceFactoryInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { EntityStatus } from '../common/enum';
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'

@injectable()
export class RecurringTasksCronJob
  implements CronTabJobInterface {
  public static readonly KEY = "recurring-task"

  protected orderService: OrderServiceInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,

    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,

    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,

    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,

    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,

    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,

    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,

    @inject(OrderModule.OrderServiceFactoryInterface)
    orderFactoryService: OrderServiceFactoryInterface,
    
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) {
    this.logger = logger;
    this.idGenerator = idGenerator;
    this.timeService = timeService;
    this.taskProvider = taskProvider;
    this.taskService = taskService;
    this.listProvider = listProvider;
    this.projectProvider = projectProvider;
    this.orderService = orderFactoryService.create<TaskDbRow>(Table.TASK, 'taskListId', 'order')
  }

  getJobKey(): string {
    return RecurringTasksCronJob.KEY;
  }

  async run(logger: LoggerInterface): Promise<void> {
    try {
      const recurrencySettings = await this.getActiveTasksRecurrencySettings()
      if (recurrencySettings.length === 0) {
        return logger.info('No recurring tasks. Exiting...')
      }

      for (const recurrence of recurrencySettings) {
        try {
          await this.handleTaskRecurrency(recurrence)
        } catch (error) {
          this.logger.error(error)
        }
      }

    } catch (error) {
      this.logger.error(error)
    }
  }

  async getActiveTasksRecurrencySettings(): Promise<TaskRecurrenceSettingsDbRow[]> {
    return await this.connection.getQueryBuilder()
      .select()
      .from(Table.TASK_RECURRENCE_SETTINGS)
      .whereRaw('next_recurrence_at::date = current_date')
  }

  async handleTaskRecurrency(taskRecurrency: TaskRecurrenceSettingsDbRow): Promise<void> {
    return await this.connection.getConnection().transaction(async (trx) => {
      this.logger.info(`[${taskRecurrency.taskId}] Started copying task from recurrence...`)

      const sourceTask = await this.taskProvider.getTaskById(taskRecurrency.taskId, trx);
      if (!sourceTask) {
        throw new Error(`[${sourceTask.id}] No source task to copy from`)
      }

      const recurrencySettings = taskRecurrency.value
      
      
      const targetTaskList = await this.listProvider.getList(recurrencySettings.targetTaskListId, trx)
      
      const targetProject = await this.projectProvider.getProject(sourceTask.projectId, trx)
      
      
      if (!targetTaskList || targetTaskList.isArchived || targetProject.isArchived || targetProject.status === EntityStatus.ARCHIVED) {
        this.logger.info(`[${sourceTask.id}] Task list not exists or is archived. Skip recurring and delete recurrence settings.`)
        return this.deleteRecurrencySettings(taskRecurrency.id, trx)
      }
      
      this.logger.info(`[${sourceTask.id}] Found new task destination. Preparing new task...`)
      const newTask = await this.prepareNewTask(sourceTask, taskRecurrency, trx)

      this.logger.info(`[${sourceTask.id}] Making actual copy...`)
      const copyTaskResult = await this.taskService.doCopyTask(trx, sourceTask.id, sourceTask.creatorId, sourceTask.name, newTask.order, newTask.id, newTask)

      if (copyTaskResult.status !== CopyTaskStatus.OK) {
        return this.logger.error(`[${sourceTask.id}] ${copyTaskResult.status}`)
      }

      const recurrencyDependency: Partial<TaskRecurrenceDependencyDbRow> = {
        recurrencySettingsId: taskRecurrency.id,
        taskId: sourceTask.id,
        targetTaskId: newTask.id,
      }
      this.logger.info(`[${sourceTask.id}] Adding next dependency...`)
      await this.addTaskRecurrencyDependency(recurrencyDependency, trx)
      this.logger.info(`[${sourceTask.id}] Updating recurrency to new date: ${taskRecurrency.nextRecurrenceAt}...`)
      await this.updateRecurrencySettings(taskRecurrency, trx)
    })
  }

  async prepareNewTask(sourceTask: TaskDbRow, taskRecurrency: TaskRecurrenceSettingsDbRow, trx: Transaction): Promise<Partial<TaskDbRow>> {
    const newTaskId = this.idGenerator.generateId()
    const dueDate = this.getUpdatedDueDate(taskRecurrency)
    const { targetTaskListId, position } = taskRecurrency.value

    let newOrder: number;

    switch (position) {
      case Position.TOP: {
        newOrder = 1
        break
      }
      case Position.BOTTOM: {
        const lastTasksOrderByListId = await this.taskService.getListsLastTasksOrder([targetTaskListId], trx)
        const lastTaskOrder = lastTasksOrderByListId[targetTaskListId]
        newOrder = this.orderService.getNextOrder(lastTaskOrder || 0)
        break
      }
    }

    return {
      ...sourceTask,
      isArchived: false,
      status: TaskStatus.INCOMPLETE,
      progress: 0,
      id: newTaskId,
      startDate: null,
      dueDate: dueDate,
      taskListId: targetTaskListId,
      order: newOrder,
    }
  }

  async addTaskRecurrencyDependency(
    taskRecurrencyDependency: Partial<TaskRecurrenceDependencyDbRow>,
    trx: Transaction
  ): Promise<TaskRecurrenceDependencyDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .insert(taskRecurrencyDependency)
      .into(Table.TASK_RECURRENCE_DEPENDENCY)
      .returning('*')
      .then(first) as TaskRecurrenceDependencyDbRow
  }

  async updateRecurrencySettings(recurrencySettings: TaskRecurrenceSettingsDbRow, trx: Transaction): Promise<void> {
    const nextRecurrenceAt = this.getNextRecurrenceAt(recurrencySettings.value)
    await this.connection.getQueryWithTransaction(trx)
      .update({ nextRecurrenceAt })
      .into(Table.TASK_RECURRENCE_SETTINGS)
      .where({ id: recurrencySettings.id })
  }

  async deleteRecurrencySettings(recurrenceId: Id, trx: Transaction): Promise<void> {
    await this.connection.getQueryWithTransaction(trx)
      .delete()
      .from(Table.TASK_RECURRENCE_SETTINGS)
      .where({ id: recurrenceId })
  }

  private getUpdatedDueDate(recurrencySettings: TaskRecurrenceSettingsDbRow): Maybe<Date> {
    const { updateDueDate, dueDateOffset, dueDateOffsetPeriod } = recurrencySettings.value
    const { nextRecurrenceAt } = recurrencySettings
    if (updateDueDate) {
      switch (dueDateOffsetPeriod) {
        case PeriodType.DAILY:
          return addDays(nextRecurrenceAt, dueDateOffset)
        case PeriodType.WEEKLY:
          return addWeeks(nextRecurrenceAt, dueDateOffset)
        case PeriodType.MONTHLY:
          return addMonths(nextRecurrenceAt, dueDateOffset)
        case PeriodType.YEARLY:
          return addYears(nextRecurrenceAt, dueDateOffset)
        default:
          return null
      }
    } else {
      return null
    }
  }

  private getNextRecurrenceAt(recurrencySettingsData: RecurrenceSettingsData): Maybe<Date> {
    const { periodType: period, interval, weekDays, dayOfMonth, month } = recurrencySettingsData
    const now = this.timeService.getCurrentTime()
    let nextRecurrenceAt: Date = null
    switch (period) {
      case PeriodType.DAILY: {
        const startOfDay = getStartOfDay(now)
        nextRecurrenceAt = addDays(startOfDay, interval)
        break
      }
      case PeriodType.WEEKLY: {
        if (weekDays.length === 0) {
          return null
        }
        nextRecurrenceAt = this.getClosestWeekDay(weekDays, interval)
        break
      }
      case PeriodType.MONTHLY:
        return this.getFirstAvailableMonthForDay(dayOfMonth)
      case PeriodType.YEARLY: {
        if (month === null) {
          return null
        }
        let date = now
        date = setMonth(date, month)
        date = setDate(date, dayOfMonth)

        if (isToday(date) || isBefore(date, now)) {
          date = addYears(date, interval)
        }
        nextRecurrenceAt = date
        break
      }
      default: return null
    }
    return getStartOfDay(nextRecurrenceAt)
  }

  private getClosestWeekDay(weekDays: number[], interval: number): Date {
    const now = this.timeService.getCurrentTime()
    let closestWeekDay = null
    weekDays.forEach(weekDay => {
      let date = now
      date = getStartOfWeek(date)
      date = addDays(date, weekDay)
      if (isToday(date) || isBefore(date, now)) {
        date = addWeeks(date, interval)
      }

      const prevDiffInDays = getDiffInDays(closestWeekDay, now)
      const diffInDays = getDiffInDays(date, now)
      if (diffInDays > -1 && (!closestWeekDay || diffInDays < prevDiffInDays)) {
        closestWeekDay = date
      }
      return closestWeekDay
    })

    return closestWeekDay
  }

  private getFirstAvailableMonthForDay(dayOfMonth: number): Date {
    const now = this.timeService.getCurrentTime()
    let date = now
    date = getStartOfMonth(date)
    let maybeDate = setDate(date, dayOfMonth)
    let resultDay = getDate(maybeDate)
    while (resultDay !== dayOfMonth || isToday(maybeDate) || isBefore(maybeDate, now)) {
      maybeDate = addMonths(date, 1)
      maybeDate = getStartOfMonth(maybeDate)
      maybeDate = setDate(maybeDate, dayOfMonth)
      resultDay = getDate(maybeDate)
    }
    return maybeDate
  }
}
