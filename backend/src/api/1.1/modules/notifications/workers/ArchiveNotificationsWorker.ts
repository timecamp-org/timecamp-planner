
import { NotificationJobType, ArchiveNotificationsJobInterface } from '../types';
import { AbstractNotificationsSubWorker } from './AbstractNotificationsSubWorker';
import { inject } from 'inversify';
import { NotificationsModule } from '../NotificationsModule';
import { NotificationProviderInterface } from '../interfaces/NotificationProviderInterface';
import { NotificationServiceInterface } from '../interfaces/NotificationServiceInterface';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
import { MessageQueueModule } from '../../messageQueue/MessageQueueModule';
import { JobStatusServiceInterface } from '../../messageQueue/interfaces/JobStatusServiceInterface';
import { JobNamespace } from '../../messageQueue/types';

const MAX_NOTIFICATIONS_TO_ARCHIVE = 200

export class ArchiveNotificationsWorker extends AbstractNotificationsSubWorker {

  constructor(
        @inject(NotificationsModule.NotificationProviderInterface)
        private notificationsProvider: NotificationProviderInterface,
        @inject(NotificationsModule.NotificationServiceInterface)
        private notificationService: NotificationServiceInterface,
        @inject(InfrastructureModule.LoggerInterface)
        private logger: LoggerInterface,
        @inject(MessageQueueModule.JobStatusServiceInterface)
        private jobStatusService: JobStatusServiceInterface,
  ) {
    super(NotificationJobType.ARCHIVE_NOTIFICATION)
  }

  async handle(job: ArchiveNotificationsJobInterface): Promise<void> {
    const {
      organizationId,
      userId,
      notificationTypesToArchive,
    } = job
    try {
      const notificationIds = await this.notificationsProvider.getUserInOrganizationNotifications(userId, organizationId, MAX_NOTIFICATIONS_TO_ARCHIVE, notificationTypesToArchive)
      if (notificationIds.length === 0) {
        return this.logger.info('Nothing to archive. Leaving...')
      }
      this.logger.info(`Found ${notificationIds.length} to archive...`)

      await this.notificationsProvider.archiveNotifications(notificationIds)
      if (notificationIds.length >= MAX_NOTIFICATIONS_TO_ARCHIVE) {
        this.logger.info('There are more notifications to archive, spawning new job...')
        await this.notificationService.publishArchiveUserInOrganizationNotificationsJob(userId, organizationId)
      }
      await this.jobStatusService.incrementDoneJobs(JobNamespace.ARCHIVE_NOTIFICATIONS, userId, organizationId)
    } catch (error) {
      this.logger.error(error)
      await this.jobStatusService.updateJobStatus(JobNamespace.ARCHIVE_NOTIFICATIONS, { isFailed: true }, userId, organizationId)
      throw error
    }
  }


}
