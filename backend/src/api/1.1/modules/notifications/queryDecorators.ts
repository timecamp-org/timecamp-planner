import { QueryModifier } from '../../../../services/types'
import { Id } from '../common/identifier'
import {
  EXCLUDED_NOTIFICATION_TYPES,
  NotificationType,
  UserOrganizationNotificationsResourceQueryParams
} from './types'

import { get, isNil } from 'lodash'
import { BaseQueryFieldValue } from '../../../../infrastructure/resources/types'
import Table from '../db/Table'
import { parseCommaSeparatedQueryField } from '../../../../utils'

export const notificationsRecipientsWithoutUsersModifier: (projectPeopleIds: Id[]) => QueryModifier = (projectPeopleIds: Id[]) => q => q
  .whereNotIn('recipientId', projectPeopleIds);

export const notificationsRecipientModifier: (userId: Id) => QueryModifier = (userId: Id) => q => q
  .where('recipientId', userId);

export const getUserOrganizationNotificationsQueryDecorator =
  (queryParams: UserOrganizationNotificationsResourceQueryParams) =>
    (decoratedQuery: QueryInterface): QueryBuilder => {

      const isArchived = get(queryParams, 'isArchived')
      const notificationTypesToInclude = parseCommaSeparatedQueryField<NotificationType | BaseQueryFieldValue>(queryParams, 'notificationType', BaseQueryFieldValue.ALL)
      const notificationTypesToExclude = parseCommaSeparatedQueryField<NotificationType | BaseQueryFieldValue>(queryParams, 'excludedNotificationType', EXCLUDED_NOTIFICATION_TYPES)
      const includeAllNotificationTypes = notificationTypesToInclude.includes(BaseQueryFieldValue.ALL)

      if (!isNil(isArchived)) {
        decoratedQuery
          .join(Table.NOTIFICATION_IN_APP, `${Table.NOTIFICATION_IN_APP}.notificationId`, `${Table.NOTIFICATION}.id`)
          .andWhere(`${Table.NOTIFICATION_IN_APP}.isArchived`, isArchived)

      }

      return decoratedQuery
        .andWhere(function () {
          if (!includeAllNotificationTypes) {
            this.whereIn(`${Table.NOTIFICATION}.notificationType`, notificationTypesToInclude)
          }
          if (notificationTypesToExclude.length > 0) {
            this.whereNotIn(`${Table.NOTIFICATION}.notificationType`, notificationTypesToExclude)
          }
        })

    }