import { Id } from '../../common/identifier';
import { UnreadNotificationDbRow } from '../../db/schema';

export interface NotificationsProviderInterface {
  getUserUnreadNotifications(userId: Id, organizationId?: Id): PromiseLike<UnreadNotificationDbRow[]>;
}