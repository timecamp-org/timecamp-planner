import { CronTabJobInterface } from '../cron/CronTabJobInterface'
import { inject, injectable } from 'inversify'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { CommonModule } from '../common/CommonModule'
import { UserStatusModule } from './UserStatusModule';
import { UserStatusProviderInterface } from './interfaces/UserStatusProviderInterface';

@injectable()
export class UserStatusResetCronJob
  implements CronTabJobInterface {
  public static readonly KEY = "user-status-reset"

  protected timeService: TimeServiceInterface;
  protected userStatusProvider: UserStatusProviderInterface;

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    timeService: TimeServiceInterface,
    @inject(UserStatusModule.UserStatusProviderInterface)
    userStatusProvider: UserStatusProviderInterface,
  ) {
    this.timeService = timeService
    this.userStatusProvider = userStatusProvider
  }

  getJobKey(): string {
    return UserStatusResetCronJob.KEY;
  }

  async run(logger: LoggerInterface): Promise<void> {
    try {
      const now = this.timeService.getCurrentTime();

      await logger.debug(`Starting. Fetching statues with resetAt until (${now})`);
      const userStatusIds = await this.userStatusProvider.getStatusIdsWithResetUntil(now);

      if (userStatusIds.length === 0) {
        logger.info(`No user statuses to reset. Returning.`);
        return;
      }

      logger.info(`Total of ${userStatusIds.length} user statuses viable for reset`);
      await this.userStatusProvider.deleteUserStatuses(userStatusIds);
    } catch (error) {
      logger.error(error)
    }
  }

}
