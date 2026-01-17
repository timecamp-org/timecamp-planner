import { CronTabJobInterface } from '../cron/CronTabJobInterface'
import { inject, injectable } from 'inversify'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { CommonModule } from '../common/CommonModule'
import { PaymentModule } from './PaymentModule'
import { SubscriptionProviderInterface } from './interfaces/SubscriptionProviderInterface'

@injectable()
export class TrialExpiratorCronJob
implements CronTabJobInterface {
  public static readonly KEY = 'trial-expirator'

  constructor(
    @inject(PaymentModule.SubscriptionProviderInterface)
    private subscriptionProvider: SubscriptionProviderInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
  ) {

  }

  getJobKey(): string {
    return TrialExpiratorCronJob.KEY;
  }

  async run(logger: LoggerInterface): Promise<void> {
    try {
      const now = this.timeService.getCurrentTime()
      const trialSubscriptions = await this.subscriptionProvider.getExpiredInternalTrialSubscriptions(now)

      if (trialSubscriptions.length === 0) {
        logger.info('There are no internal trial subscriptions to terminate. Exiting...')
        return
      }

      logger.info(`Found ${trialSubscriptions.length} trial subscriptions to terminate...`)

      await this.subscriptionProvider.terminateExpiredInternalTrialSubscriptions(now)
    } catch (error) {
      logger.error(error)
    }
  }
}
