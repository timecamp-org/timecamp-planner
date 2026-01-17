import { Id } from '../../common/identifier'
import { UserLatestNotificationsDisplayDbRow, UserLatestNotificationsDisplayFullDbRow } from '../../db/schema'

import { Dict } from '../../common/types'

export interface UserDisplayedNotificationsProviderInterface {
  getUserInOrganizationLatestNotificationsDisplay(userInOrganizationId: Id, notificationCenterTypeIds: Id[], trx?: Transaction): PromiseLike<UserLatestNotificationsDisplayFullDbRow[]>

  getUserLatestAllNotificationsDisplay(userId: Id, notificationCenterTypeIds: Id[], trx?: Transaction): PromiseLike<Dict<UserLatestNotificationsDisplayFullDbRow[]>>

  updateUserLatestNotificationsDisplayTimestamp(userInOrganizationId: Id, notificationCenterTypeId: Id, displayedAt: Date, trx?: Transaction): PromiseLike<number>

  createUserLatestNotificationsDisplayTimestamp(userLatestNotificationsDisplayDbRow: UserLatestNotificationsDisplayDbRow, trx?: Transaction): PromiseLike<void>
}