import * as NotificationsModelConstants from './constants'
import { fromJS, List, Map } from 'immutable'

const emptyList = List()
const emptyMap = Map()

import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { NotificationsState, NotificationMethod } from './types'
import { Reducer } from 'react';
import { PayloadAction } from '../../../types';
import { Id } from 'common/utils/identifier'

const initialState: NotificationsState = fromJS({
  notificationsData: {},
  notificationsExternalData: {},
  notificationsSettings: {
    [NotificationMethod.PUSH]: false,
    [NotificationMethod.EMAIL]: false,
    [NotificationMethod.MOBILE]: false,
    [NotificationMethod.SOUND]: false,
  },
  unreadNotificationsCreationTimestamp: {},
  unreadNotificationsChronology: {},
  unreadNotificationsTypes: {},
  objectIdChatNotificationSettingsType: {},
  userLatestNotificationCenterDisplays: {},
})

const NotificationsModelReducer: Reducer<NotificationsState, PayloadAction> = (state = initialState, action): NotificationsState => {
  switch (action.type) {
    case NotificationsModelConstants.onSetIsNotificationArchivedSuccess: {
      const { notificationId, isArchived } = action.payload.data
      return state.setIn(['notificationsData', notificationId, 'isArchived'], isArchived)
    }

    case NotificationsModelConstants.onArchiveUserInOrganizationNotificationsSuccess: {
      const { notificationIds } = action.payload
      let newState = state

      notificationIds.forEach((notificationId: Id) => {
        newState = newState.setIn(['notificationsData', notificationId, 'isArchived'], true)
      })

      return newState
    }

    case NotificationsModelConstants.onUpdateNotificationData: {
      const { notification, externalData } = action.payload
      const currentStatus = state.setIn(['notificationsData', notification.id], notification)
      if (!notification.readAt) {
        return currentStatus
          .updateIn(
            ['unreadNotificationsChronology', notification.organizationId, notification.containerId],
            list => {
              if (!list) {
                return List([notification.id])
              }

              if (!list.includes(notification.id)) {
                return list.push(notification.id)
              }

              return list
            }
          )

          .setIn(['unreadNotificationsTypes', notification.id], notification.type)
          .setIn(['notificationsExternalData', notification.id], externalData)
          .setIn(['unreadNotificationsCreationTimestamp', notification.id], notification.creationTimestamp)
      } else {
        return currentStatus.updateIn(
          ['unreadNotificationsChronology', notification.organizationId, notification.containerId],
          list => (list ? list.filter(notificationId => notificationId !== notification.id) : emptyList),
        )
          .deleteIn(['unreadNotificationsTypes', notification.id])
      }

    }

    case NotificationsModelConstants.onBatchNotificationsData: {
      const { notificationsData, notificationsExternalData } = action.payload
      return state.set('notificationsData', state.get('notificationsData').merge(notificationsData))
        .set('notificationsExternalData', state.get('notificationsExternalData').merge(notificationsExternalData))
    }

    case NotificationsModelConstants.onResetUnreadNotificationsSuccess: {
      const { objectId, currentOrganizationId, notificationsData } = action.payload.data
      return state
        .setIn(['unreadNotificationsChronology', currentOrganizationId, objectId], emptyList)
        .set('notificationsData', state.get('notificationsData').merge(notificationsData))
    }

    case NotificationsModelConstants.onMarkAllAsReadSuccess: {
      const { currentOrganizationId, notificationsData, currentOrganizationUnreadNotificationsChronology } = action.payload.data
      return state
        .setIn(['unreadNotificationsChronology', currentOrganizationId], currentOrganizationUnreadNotificationsChronology)
        .set('notificationsData', state.get('notificationsData').merge(notificationsData))
    }

    case NotificationsModelConstants.onReadNotificationSuccess: {
      const { currentOrganizationId, notificationId, objectId, lastReadTime } = action.payload.data
      return state
        .updateIn(['unreadNotificationsChronology', currentOrganizationId, objectId], list => (list ? list.filter(id => id !== notificationId) : emptyList))
        .setIn(['notificationsData', notificationId, 'readAt'], lastReadTime)
    }

    case NotificationsModelConstants.onFetchUnreadNotificationsSuccess: {
      const {
        unreadNotificationsChronology,
        unreadNotificationsCreationTimestamp,
        unreadNotificationsTypes,
        notificationsExternalData
      } = action.payload.data
      return state
        .set('unreadNotificationsChronology', unreadNotificationsChronology)
        .set('unreadNotificationsTypes', state.get('unreadNotificationsTypes').mergeDeep(unreadNotificationsTypes))
        .set('unreadNotificationsCreationTimestamp', state.get('unreadNotificationsCreationTimestamp').mergeDeep(unreadNotificationsCreationTimestamp))
        .set('notificationsExternalData', state.get('notificationsExternalData').mergeDeep(notificationsExternalData))
    }

    case NotificationsModelConstants.onUpdateNotificationSettings: {
      const { notificationMethod, isEnabled } = action.payload
      return state.setIn(['notificationsSettings', notificationMethod], isEnabled)
    }

    case NotificationsModelConstants.onCreateNotificationsSettingsData: {
      return state.set('notificationsSettings', action.payload)
    }

    case NotificationsModelConstants.onUpdateChatNotificationSettings:
    case NotificationsModelConstants.onSetChatNotificationSettingsTypeSuccess: {
      return state.setIn(['objectIdChatNotificationSettingsType', action.payload.objectId], action.payload.chatNotificationSettingsType)
    }

    case NotificationsModelConstants.onFetchChatNotificationSettingsTypesSuccess: {
      let newState = state

      action.payload.forEach((setting) => {
        newState = newState.setIn(['objectIdChatNotificationSettingsType', setting.projectId], setting.chatNotificationSettingsType)
      })

      return newState
    }

    case NotificationsModelConstants.onSetUserLatestNotificationCenterDisplay: {
      const { userLatestNotificationCenterDisplays, organizationId } = action.payload

      return state
        .mergeIn(['userLatestNotificationCenterDisplays', organizationId], userLatestNotificationCenterDisplays)
    }

    case NotificationsModelConstants.onBatchUserLatestNotificationCenterDisplay: {
      const { userLatestNotificationCenterDisplays } = action.payload

      return state
        .set('userLatestNotificationCenterDisplays', userLatestNotificationCenterDisplays)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess: {
      const currentUnreadNotificationsChronology = state.get('unreadNotificationsChronology')
      const currentUnreadNotificationsTypes = state.get('unreadNotificationsTypes')
      const currentUnreadNotificationsCreationTimestamp = state.get('unreadNotificationsCreationTimestamp')
      const currentUserLatestNotificationCenterDisplays = state.get('userLatestNotificationCenterDisplays')
      return initialState
        .set('unreadNotificationsChronology', currentUnreadNotificationsChronology)
        .set('unreadNotificationsTypes', currentUnreadNotificationsTypes)
        .set('unreadNotificationsCreationTimestamp', currentUnreadNotificationsCreationTimestamp)
        .set('userLatestNotificationCenterDisplays', currentUserLatestNotificationCenterDisplays)
    }

    default:
      return state
  }
}

export default NotificationsModelReducer
