import { injectable } from 'inversify'
import { Id } from '../../common/identifier'

import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider'
import { UserOrganizationNotificationsProviderInterface } from '../interfaces/UserOrganizationNotificationsProviderInterface'
import { QueryModifier } from '../../../../../services/types'
import Table from '../../db/Table'
import { Maybe } from '../../common/types'
import { NotificationDbRow } from '../../db/schema'

@injectable()
export class UserOrganizationNotificationsProvider extends AbstractPostgresProvider implements UserOrganizationNotificationsProviderInterface {

  async getUserOrganizationNotifications(
    userId: Id,
    organizationId: Id,
    queryDecorators: Maybe<QueryModifier[]> = [],
    columnNames?: string[],
    trx?: Transaction
  ): Promise<NotificationDbRow[]> {
    let notificationsQuery = this.connection.getQueryWithTransaction(trx)

    notificationsQuery
      .select(columnNames || '*')
      .from(Table.NOTIFICATION)
      .where(`${Table.NOTIFICATION}.recipient_id`, userId)
      .where(function () {
        this
          .where(`${Table.NOTIFICATION}.organization_id`, organizationId)
          .orWhereNull(`${Table.NOTIFICATION}.organization_id`)
      })

    for (const decorateQuery of queryDecorators) {
      if (decorateQuery) {
        notificationsQuery = decorateQuery(notificationsQuery)
      }
    }

    return await notificationsQuery
  }


}