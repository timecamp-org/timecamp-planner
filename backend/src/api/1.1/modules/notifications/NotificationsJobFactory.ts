import { NotificationsJobFactoryInterface } from './interfaces/NotificationsJobFactoryInterface';
import {
    ArchiveNotificationsJobInterface,
    NotificationJobType,
    NotificationsJobInterface,
    NotificationType
} from './types'
import { Id, IdGeneratorInterface } from '../common/identifier';
import { injectable, inject } from 'inversify';
import { CommonModule } from '../common/CommonModule';

@injectable()
export class NotificationsJobFactory implements NotificationsJobFactoryInterface {

    constructor(
        @inject(CommonModule.IdGeneratorInterface)
        private idGenerator: IdGeneratorInterface<Id>
    ){}

    private createBaseJob(type: NotificationJobType): NotificationsJobInterface {
        return {
            id: this.idGenerator.generateId(),
            type,
        }
    }

    createArchiveNotificationsJob(userId: Id, organizationId: Id, notificationTypesToArchive?: NotificationType[]): ArchiveNotificationsJobInterface {
        const baseJob = this.createBaseJob(NotificationJobType.ARCHIVE_NOTIFICATION)
        return {
            ...baseJob,
            userId,
            organizationId,
            notificationTypesToArchive,
        }
    }

}