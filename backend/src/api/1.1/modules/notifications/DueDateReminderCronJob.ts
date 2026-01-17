import { CronTabJobInterface } from '../cron/CronTabJobInterface';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { NotificationProviderInterface } from './interfaces/NotificationProviderInterface';
import { CommonModule } from '../common/CommonModule';
import { NotificationsModule } from './NotificationsModule';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { TasksModule } from '../tasks/TasksModule';
import { TaskDbRow } from '../db/schema';
import { keyBy } from 'lodash';
import { NotificationFactoryInterface } from './interfaces/NotificationFactoryInterface';

/**
 * Due dates in tasks are set to 12:00 (noon) local user time (according to user's
 * agent). This is somewhat by accident but for now we will utilize this fact
 * to send emails in times related to user's timezone.
 *
 * We should send reminder at 9:00 the day before due date.
 * So we should send emails for tasks that's due date is
 * in 24+3 hours.
 */
@injectable()
export class DueDateReminderCronJob implements CronTabJobInterface {
  public static readonly KEY = 'due-date-reminder';

  /**
   * Each job run grabs tasks with due date BETWEEN now  AND now + period
   * to process.
   */
  protected remindPeriodHrs = 27;

  /**
   * We should not spam with reminders. This setting controls how long to wait between sending next
   * reminder.
   */
  protected muteTimeHrs = 27;

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,

    @inject(NotificationsModule.NotificationFactoryInterface)
    private notificationFactory: NotificationFactoryInterface,

    @inject(NotificationsModule.NotificationProviderInterface)
    private notificationProvider: NotificationProviderInterface,

    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface
  ) {}

  getJobKey(): string {
    return DueDateReminderCronJob.KEY;
  }

  async run(logger: LoggerInterface): Promise<void> {
    const now = this.timeService.getCurrentTime();
    const dueDateTo = new Date(now.getTime() + this.remindPeriodHrs * 3600000);

    logger.info(
      `Starting. Fetching tasks with due date (${now} -- ${dueDateTo})`
    );
    const tasks = await this.taskProvider.getTasksWithDueDateBetween(
      now,
      dueDateTo
    );

    if (tasks.length === 0) {
      logger.info('No tasks with viable due date. Returning.');
      return;
    }

    logger.info(
      `Total of ${tasks.length} tasks viable for processing. Excluding tasks with notifications already sent.`
    );

    const tasksToSendReminders = await this.filterTaskToSend(tasks, logger);
    if (tasksToSendReminders.length === 0) {
      logger.info('All reminders already sent -- nothing to do.');
      return;
    }
    logger.info(`Sending ${tasksToSendReminders.length} reminders`);

    await Promise.all(
      tasksToSendReminders.map(this.sendReminderForTask.bind(this))
    );
  }

  private async filterTaskToSend(
    tasks: TaskDbRow[],
    logger: LoggerInterface
  ): Promise<TaskDbRow[]> {
    const taskIds = tasks.map((t) => t.id);
    const tasksById = keyBy(tasks, 'id');
    const now = this.timeService.getCurrentTime();
    const muteWindow = new Date(now.getTime() - this.muteTimeHrs * 3600000);

    const sentReminders =
      await this.notificationProvider.getSentDueDateRemindersForTasks(
        taskIds,
        muteWindow,
        now
      );

    logger.info(
      `Found ${sentReminders.length} reminders during muteWindow: ${muteWindow} - ${now}`
    );

    const sentRemindersByTaskId = keyBy(sentReminders, 'containerId');
    const taskIdsToSend = taskIds.filter((id) => !sentRemindersByTaskId[id]);

    return taskIdsToSend
      .map((taskId) => tasksById[taskId] || null)
      .filter((task: TaskDbRow) => !!task);
  }

  protected async sendReminderForTask(task: TaskDbRow): Promise<void> {
    const recipientIds = await this.taskProvider.getTaskAssigneeIds(task.id);
    await this.notificationFactory.createDueDateNotification(
      task,
      recipientIds
    );
  }
}
