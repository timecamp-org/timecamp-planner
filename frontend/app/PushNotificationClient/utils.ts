import queryString from 'query-string'
import createLinkFromNotification from '../common/utils/notifications/createLinkFromNotification'
import { PushNotification, PushNotificationMessage } from './types'
import { Id } from '../common/utils/identifier'
import { NotificationExternalDataInterface } from '../common/models/domain/NotificationsModel/types'
import { NotificationExternalData } from '../common/models/domain/NotificationsModel/models'
import handleError from '../common/utils/handleError'
import { ProjectPanelType } from '../common/models/domain/ProjectsSettingsModel/types'

export function canShowForegroundMobileNotification(notification: PushNotification): boolean {
  if (!notification) {
    return true
  }
  const { notificationType, data } = notification
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    const { NavigationService } = require('../common/services')
    const createRouteFromNotification = require('../HeySpaceMobile/utils/createRouteFromNotification').default
    const route = createRouteFromNotification({
      notificationType: parseInt(notificationType),
      notificationData: new NotificationExternalData(data),
    })
    
    const currentRoute = NavigationService.getCurrentRoute()
    if (!currentRoute || !currentRoute.params) {
      handleError(new Error('Cannot get current route in canShowForegroundMobileNotification'), { routeFromNotification: route })
      // if currentRoute name failed show notification anyway
      return true
    }

    const {
      taskId,
      projectId,
      conversationId,
      routeName: currentRouteName,
    } = currentRoute.params
    
    if (isNotificationTaskIdChanged(taskId, data)) {
      return true
    }
    return currentRouteName !== route?.routeName || (projectId !== data.projectId && conversationId !== data.conversationId)
  } else {
    return false
  }
}

export function canShowForegroundWebNotification(notification: PushNotification): boolean {
  if (!notification.data) {
    return true
  }
  const { notificationType, data } = notification

  const link = createLinkFromNotification({
    notificationType: parseInt(notificationType),
    notificationData: new NotificationExternalData(data),
  })
  const { taskId } = queryString.parse(window.location.search)

  if (
    (typeof taskId === 'string' && isNotificationTaskIdChanged(taskId, data)) 
    || !link
  ) {
    return true
  }

  const currentPathName = window.location.pathname

  const [, , currentObjectId, currentProjectPanelType] = currentPathName.split('/')
  const [, , linkObjectId, linkProjectPanelType] = link.split('/')

  if (currentProjectPanelType === ProjectPanelType.CHAT && linkProjectPanelType === ProjectPanelType.CHAT) {
    return currentObjectId !== linkObjectId
  }

  return currentPathName !== link
}

function isNotificationTaskIdChanged(currentTaskId: Id, incomingNotification: NotificationExternalDataInterface) {
  return (currentTaskId && !incomingNotification.taskId) ||
    (currentTaskId && incomingNotification.taskId && currentTaskId !== incomingNotification.taskId)
}

export function getPushNotificationFromRawMessage(message: PushNotificationMessage): PushNotification | null {
  if (!message) {
    return null
  }

  const parsedData = parseNotificationData(message.data)
  if (!message.notificationType || !message.containerId || !message.actorId || !message.title || !message.body) {
    return null
  }

  return {
    actorId: message.actorId,
    body: message.body,
    containerId: message.containerId,
    data: parsedData,
    notificationType: message.notificationType,
    title: message.title,
    topic: message.topic || '',
    notificationId: message.notificationId,
  }
}

function parseNotificationData(data: NotificationExternalDataInterface | string | null | undefined): NotificationExternalDataInterface | null {
  if (!data) {
    return null
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  }
  return data
}
