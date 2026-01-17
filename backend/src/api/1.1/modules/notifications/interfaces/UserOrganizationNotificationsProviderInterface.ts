import { QueryModifier } from '../../../../../services/types'
import { Id } from '../../common/identifier'

import { Maybe } from '../../common/types'
import { NotificationDbRow } from '../../db/schema'

export interface UserOrganizationNotificationsProviderInterface {
  getUserOrganizationNotifications(
    userId: Id,
    organizationId: Id,
    queryDecorators: Maybe<QueryModifier[]>,
    columnNames?: string[],
    trx?: Transaction
  ): PromiseLike<NotificationDbRow[]>
}