import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider'
import { UserDisplayedNotificationsProviderInterface } from '../interfaces/UserDisplayedNotificationsProviderInterface'
import { Id } from '../../common/identifier'
import { UserLatestNotificationsDisplayDbRow, UserLatestNotificationsDisplayFullDbRow } from '../../db/schema'

import Table from '../../db/Table'
import { Dict } from '../../common/types'
import { groupBy } from 'lodash'

export class UserDisplayedNotificationsProvider extends AbstractPostgresProvider implements UserDisplayedNotificationsProviderInterface {

  async getUserInOrganizationLatestNotificationsDisplay(userInOrganizationId: Id, notificationCenterTypeIds: Id[], trx?: Transaction): Promise<UserLatestNotificationsDisplayFullDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .select(`${Table.USER_LATEST_NOTIFICATIONS_DISPLAY}.*`, `${Table.DICT_NOTIFICATION_CENTER_TYPE}.value as notificationCenterType`)
      .from(Table.USER_LATEST_NOTIFICATIONS_DISPLAY)
      .join(Table.DICT_NOTIFICATION_CENTER_TYPE, `${Table.DICT_NOTIFICATION_CENTER_TYPE}.id`, `${Table.USER_LATEST_NOTIFICATIONS_DISPLAY}.notificationCenterTypeId`)
      .whereIn('notificationCenterTypeId', notificationCenterTypeIds)
      .andWhere({ userInOrganizationId })
  }

  async getUserLatestAllNotificationsDisplay(userId: Id, notificationCenterTypeIds: Id[], trx?: Transaction): Promise<Dict<UserLatestNotificationsDisplayFullDbRow[]>> {
    const query = this.connection.getQueryWithTransaction(trx)

    const userLatestNotificationDisplays = await query
      .select(
        `${Table.USER_LATEST_NOTIFICATIONS_DISPLAY}.*`,
        `${Table.DICT_NOTIFICATION_CENTER_TYPE}.value as notificationCenterType`,
        `${Table.USER_IN_ORGANIZATION}.organizationId`
      )
      .from(Table.USER_LATEST_NOTIFICATIONS_DISPLAY)
      .join(Table.DICT_NOTIFICATION_CENTER_TYPE, `${Table.DICT_NOTIFICATION_CENTER_TYPE}.id`, `${Table.USER_LATEST_NOTIFICATIONS_DISPLAY}.notificationCenterTypeId`)
      .join(Table.USER_IN_ORGANIZATION, `${Table.USER_LATEST_NOTIFICATIONS_DISPLAY}.userInOrganizationId`, `${Table.USER_IN_ORGANIZATION}.id`)
      .whereIn('notificationCenterTypeId', notificationCenterTypeIds)
      .andWhere(`${Table.USER_IN_ORGANIZATION}.userId`, userId)

    return groupBy(userLatestNotificationDisplays, 'organizationId')
  }

  async updateUserLatestNotificationsDisplayTimestamp(userInOrganizationId, notificationCenterTypeId: Id, displayedAt: Date, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .update({ displayedAt })
      .table(Table.USER_LATEST_NOTIFICATIONS_DISPLAY)
      .where({
        userInOrganizationId,
        notificationCenterTypeId,
      })
  }

  async createUserLatestNotificationsDisplayTimestamp(userLatestNotificationsDisplayDbRow: UserLatestNotificationsDisplayDbRow, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    await query
      .insert(userLatestNotificationsDisplayDbRow)
      .into(Table.USER_LATEST_NOTIFICATIONS_DISPLAY)
  }

}