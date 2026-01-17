import createRouteFromNotification from './createRouteFromNotification'
import handleError from 'common/utils/handleError'
import { NotificationExternalData } from '../../common/models/domain/NotificationsModel/models'
import { RawNotificationInApp } from '../../common/models/domain/NotificationsModel/types'
import { AppEventEmitter } from 'common/services'
import { AppEventType } from 'common/types';
import { NavigationService } from 'common/services'
import RouteName from "../components/AppNavigation/routeNames";
import { AUTH_FLOW_ROUTES } from "../components/AppNavigation/constants";

export default function (notification: RawNotificationInApp) {
  if (!notification) {
    return
  }
  let notificationData: any = {}

  if (notification.data) {
    try {
      notificationData = {
        notificationType: notification.notificationType,
        ...JSON.parse(notification.data),
      }
    } catch (error) {
      notificationData = notification.data
    }
  }

  const { notificationType, ...data } = notificationData
  try {
    const route = createRouteFromNotification({
      notificationType: parseInt(notificationType),
      notificationData: new NotificationExternalData(data),
    })

    if (route) {
      if (route.taskId) {
        if (AUTH_FLOW_ROUTES.includes(NavigationService.getCurrentRouteName())) {
          NavigationService.navigate(RouteName.PROJECT, { projectId: route.projectId })
        }
        NavigationService.resetAdvanced([
          {
            routeName: RouteName.PROJECT,
            params: {
              projectId: route.projectId,
            }
          },
          {
            routeName: route.routeName,
            params: { ...route },
          }
        ], 1)
        if (route.openCardComments) {
          AppEventEmitter.emit(AppEventType.OPEN_CARD_COMMENTS)
        }
      } else {
        NavigationService.navigate(route.routeName, { ...route })
      }
    }
  } catch (error) {
    handleError(error)
  }
}
