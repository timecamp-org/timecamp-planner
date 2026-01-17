import { Id } from '../../common/identifier';
import { ArchiveNotificationsJobInterface, NotificationType } from '../types'

export interface NotificationsJobFactoryInterface {
    createArchiveNotificationsJob(userId: Id, organizationId: Id, notificationTypesToArchive?: NotificationType[]): ArchiveNotificationsJobInterface;
}