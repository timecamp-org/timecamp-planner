import { ActivityActionCreator, ActivityType, OperationType } from '../types'
import * as UsersModelActions from '../../UsersModel/actions'
import * as NotificationsModelActions from '../../NotificationsModel/actions'
import { getNotificationRecordFromRestResponse } from '../../../../utils/fetchResultToRecord'
import isMobileApp from '../../../../utils/isMobileApp'
import { fromJS } from 'immutable'

const activityActionDescriptors: { [type in ActivityType]?: ActivityActionCreator } = {
  [ActivityType.ONLINE_STATUS]: (wrappedEntity) => UsersModelActions.onSetIsUserOnline(wrappedEntity.userId, wrappedEntity.isOnline),
  [ActivityType.NOTIFICATION]: (wrappedEntity) => {
    const notificationRecord = getNotificationRecordFromRestResponse({
      ...wrappedEntity.notification,
      ...wrappedEntity.inApp,
    })
    const externalNotificationData = fromJS(wrappedEntity.notification.data)
    if (wrappedEntity.operation === OperationType.INSERT) {
      if (!isMobileApp()) {
        document.dispatchEvent(new CustomEvent('newNotificationCreated', {
          detail: {
            notification: notificationRecord,
            externalData: externalNotificationData,
          },
        }))
      }
    }
    return NotificationsModelActions.onUpdateNotificationData(notificationRecord, wrappedEntity.notification.data)
  },
}

export default activityActionDescriptors
