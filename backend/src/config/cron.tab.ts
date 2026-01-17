import { interfaces } from 'inversify';
import { CronScheduleInterface } from '../api/1.1/modules/cron/CronScheduleInterface';
import { EveryNthHour } from '../api/1.1/modules/cron/schedules/EveryNthHour';
import { EveryNthMinute } from '../api/1.1/modules/cron/schedules/EveryNthMinute';
import { NotificationsModule } from '../api/1.1/modules/notifications/NotificationsModule';
import { OrganizationsModule } from '../api/1.1/modules/organizations/OrganizationsModule';
import { TasksModule } from '../api/1.1/modules/tasks/TasksModule';
import { UserStatusModule } from '../api/1.1/modules/userStatus/UserStatusModule';

const cronTabConfig: { job: interfaces.ServiceIdentifier<any>; schedule: CronScheduleInterface }[] = [
  {
    job: NotificationsModule.DueDateReminderCronJob,
    schedule: new EveryNthMinute(1),
  },
  {
    job: UserStatusModule.UserStatusResetCronJob,
    schedule: new EveryNthMinute(1),
  },
  {
    job: OrganizationsModule.InvitationEmailReminderCronJob,
    schedule: new EveryNthHour(5),
  },
  {
    job: TasksModule.RecurringTasksCronJob,
    schedule: new EveryNthHour(6),
  },
];

export default cronTabConfig;
