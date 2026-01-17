import { NotificationType } from 'models/domain/NotificationsModel/types'
import { Id } from 'common/utils/identifier'
import { AnyDict } from 'common/types'
import { useSelector } from 'common/hooks/useSelector'
import { selectNotificationType, selectNotificationActorId } from 'models/domain/NotificationsModel/selectors'
import { useMemo } from 'react'

export type NotificationIconHookInterface = {
  notificationType: NotificationType,
  actingUserId: Id,
  shouldRenderPersonIcon: boolean,
}

export const useComponent = ({ notificationId }: AnyDict): NotificationIconHookInterface => {
  const notificationType = useSelector(state => selectNotificationType(state, { notificationId }))
  const actingUserId = useSelector(state => selectNotificationActorId(state, { notificationId }))

  const shouldRenderPersonIcon = useMemo(() => actingUserId && notificationType !== NotificationType.INVITATION_JOINED, [notificationType, actingUserId])

  return {
    notificationType,
    actingUserId,
    shouldRenderPersonIcon,
  }
}
