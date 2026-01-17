import * as C from './constants'
import { NotificationExternalData, NotificationsSettings } from './models'
import { Map } from 'immutable'
import { getNotificationRecordFromRestResponse } from '../../../utils/fetchResultToRecord'
import { action } from 'typesafe-actions'
import {
  ChatNotificationSettingsType,
  NotificationCenterType,
  NotificationExternalDataInterface,
  NotificationInApp,
  NotificationInterface,
  NotificationMethod,
  NotificationsData,
  NotificationSettingsInterface,
  NotificationsExternalData,
} from './types'
import { Id } from '../../../utils/identifier'
import { ActionResultInterface } from '../ActionResultModel'

const emptyMap = Map()

export const onInit = () => action(C.onInit)

export const onUpdateNotificationData = (notification: NotificationInterface, externalData: NotificationExternalDataInterface) =>
  action(C.onUpdateNotificationData, { notification, externalData: new NotificationExternalData(externalData) })

export const onBatchNotificationsData = (notificationEntities: NotificationInApp[]) => {
  let notificationsData = emptyMap as NotificationsData
  let notificationsExternalData = emptyMap as NotificationsExternalData
  notificationEntities.forEach(entity => {
    let notificationRecord = getNotificationRecordFromRestResponse(entity)
    notificationsData = notificationsData.set(entity.id, notificationRecord)
    notificationsExternalData = notificationsExternalData.set(entity.id, new NotificationExternalData(entity.data))
  })
  return action(C.onBatchNotificationsData, { notificationsData, notificationsExternalData })
}

export const onSetIsNotificationArchived = (notificationId: Id, isArchived: boolean) =>
  action(C.onSetIsNotificationArchived, { notificationId, isArchived })

export const onSetIsNotificationArchivedSuccess = (actionResult: ActionResultInterface) =>
  action(C.onSetIsNotificationArchivedSuccess, actionResult)

export const onFetchNotifications = (
  limit: number,
  isArchived = false,
  force = false,
  notificationCenterType: NotificationCenterType,
) =>
  action(
    C.onFetchNotifications,
    { limit, isArchived, force, notificationCenterType }
  )

export const onFetchUnreadNotifications = (loadNextPage = {}) =>
  action(C.onFetchUnreadNotifications, { loadNextPage })

export const onFetchUnreadNotificationsSuccess = (actionResult: ActionResultInterface) =>
  action(C.onFetchUnreadNotificationsSuccess, actionResult)

export const onMutePushNotifications = () =>
  action(C.onMutePushNotifications)

export const onUnmutePushNotifications = () =>
  action(C.onUnmutePushNotifications)

export const onSetCurrentDeviceId = (deviceId: Id) =>
  action(C.onSetCurrentDeviceId, deviceId)

export const onGetCurrentDeviceId = () =>
  action(C.onGetCurrentDeviceId)

export const onResetUnreadNotifications = (objectId: Id) =>
  action(C.onResetUnreadNotifications, { objectId })

export const onResetUnreadNotificationsSuccess = (actionResult: ActionResultInterface) =>
  action(C.onResetUnreadNotificationsSuccess, actionResult)

export const onMarkAllAsRead = (notificationCenterType: NotificationCenterType) =>
  action(C.onMarkAllAsRead, { notificationCenterType })

export const onMarkAllAsReadSuccess = (actionResult: ActionResultInterface) =>
  action(C.onMarkAllAsReadSuccess, actionResult)

export const onReadNotification = (notificationId: Id) =>
  action(C.onReadNotification, { notificationId })

export const onReadNotificationSuccess = (actionResult: ActionResultInterface) =>
  action(C.onReadNotificationSuccess, actionResult)

export const onUpdateNotificationSettings = (notificationMethod: NotificationMethod, isEnabled: boolean) =>
  action(C.onUpdateNotificationSettings, { notificationMethod, isEnabled })

export const onCreateNotificationsSettingsData = (notificationsSettings: NotificationSettingsInterface) =>
  action(C.onCreateNotificationsSettingsData, restNotificationsSettingsToRecord(notificationsSettings))

function restNotificationsSettingsToRecord(restNotificationsSettings) {
  return new NotificationsSettings(restNotificationsSettings)
}

export const onSetUnreadNotificationsDisplay = (notificationCenterType: NotificationCenterType) =>
  action(C.onSetUnreadNotificationsDisplay, { notificationCenterType })

export const onSetChatNotificationSettingsType = (objectId: Id, chatNotificationSettingsType: ChatNotificationSettingsType) =>
  action(C.onSetChatNotificationSettingsType, { objectId, chatNotificationSettingsType })

export const onSetChatNotificationSettingsTypeSuccess = (objectId: Id, chatNotificationSettingsType: ChatNotificationSettingsType) =>
  action(C.onSetChatNotificationSettingsTypeSuccess, { objectId, chatNotificationSettingsType })

export const onUpdateChatNotificationSettings = (objectId: Id, chatNotificationSettingsType: ChatNotificationSettingsType) =>
  action(C.onUpdateChatNotificationSettings, { objectId, chatNotificationSettingsType })

export const onFetchChatNotificationSettingsTypes = () =>
  action(C.onFetchChatNotificationSettingsTypes)

export const onFetchNotificationSettings = () =>
  action(C.onFetchNotificationSettings)

export const onFetchChatNotificationSettingsTypesSuccess = (chatNotificationSettingsTypes: Record<Id, ChatNotificationSettingsType>) =>
  action(C.onFetchChatNotificationSettingsTypesSuccess, chatNotificationSettingsTypes)

export const onArchiveUserInOrganizationNotifications = (notificationCenterType: NotificationCenterType) =>
  action(C.onArchiveUserInOrganizationNotifications, { notificationCenterType })

export const onArchiveUserInOrganizationNotificationsSuccess = (notificationIds: Id[]) =>
  action(C.onArchiveUserInOrganizationNotificationsSuccess, { notificationIds })

export const onFetchUserLatestNotificationCenterDisplays = (notificationCenterTypes: NotificationCenterType[] = [NotificationCenterType.ACTION_BASED, NotificationCenterType.CHAT]) =>
  action(C.onFetchUserLatestNotificationCenterDisplays, { notificationCenterTypes })

export const onSetUserLatestNotificationCenterDisplay = (
  userLatestNotificationCenterDisplays: Map<NotificationCenterType, number>,
  organizationId: Id,
) =>
  action(C.onSetUserLatestNotificationCenterDisplay, { userLatestNotificationCenterDisplays, organizationId })


export const onBatchUserLatestNotificationCenterDisplay = (
  userLatestNotificationCenterDisplays: Map<Id, Map<NotificationCenterType, number>>
) => action(C.onBatchUserLatestNotificationCenterDisplay, { userLatestNotificationCenterDisplays })
