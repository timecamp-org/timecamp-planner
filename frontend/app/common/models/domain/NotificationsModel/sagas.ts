import { timestampNow } from 'common/utils/epoch';
import { Map } from 'immutable';
import { cps, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { HeySpaceClient as client, localStorage, PushNotificationsClient, UserTracker } from '../../../services';
import DesktopAppController from '../../../utils/desktopAppController';
import generateId from '../../../utils/generate-pushid';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';
import { RequestStatus } from '../RequestModel/types';

import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import * as UsersModelSelectors from '../UsersModel/selectors/domain';
import * as NotificationsModelActions from './actions';
import * as NotificationsModelConstants from './constants';
import * as NotificationsModelSelectors from './selectors';

import { PayloadAction } from 'common/types';
import { Id } from 'common/utils/identifier';
import { removeIdFromList } from 'common/utils/immutableUtils';
import isMobileApp from 'common/utils/isMobileApp';
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import * as EntityModelSelectors from '../EntityModel/selectors';
import { onSetPageLastNext } from '../PaginationModel/actions';
import { selectPageLastNext } from '../PaginationModel/selectors';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { selectIsRequestRepeatable } from '../RequestModel/selectors';
import { parseUnreadNotifications } from './dataParsers';
import {
  DeviceType,
  NotificationCenterType,
  NotificationMethod,
  notificationMethodTrackingNames,
  UnreadNotification,
} from './types';

const emptyMap = Map();

export default [watchNotifications];

export function* watchNotifications() {
  yield takeLatest(NotificationsModelConstants.onInit, onInit);
  yield takeLatest(NotificationsModelConstants.onFetchNotifications, onFetchNotifications);
  yield takeLatest(NotificationsModelConstants.onFetchUnreadNotifications, onFetchUnreadNotifications);
  yield takeEvery(NotificationsModelConstants.onMutePushNotifications, onMutePushNotifications);
  yield takeEvery(NotificationsModelConstants.onUnmutePushNotifications, onUnmutePushNotifications);
  yield takeEvery(NotificationsModelConstants.onSetIsNotificationArchived, onSetIsNotificationArchived);
  yield takeEvery(NotificationsModelConstants.onResetUnreadNotifications, onResetUnreadNotifications);
  yield takeEvery(NotificationsModelConstants.onMarkAllAsRead, onMarkAllAsRead);
  yield takeEvery(NotificationsModelConstants.onReadNotification, onReadNotification);
  yield takeEvery(NotificationsModelConstants.onUpdateNotificationSettings, onUpdateNotificationSettings);
  yield takeEvery(NotificationsModelConstants.onGetCurrentDeviceId, onGetCurrentDeviceId);
  yield takeEvery(NotificationsModelConstants.onSetCurrentDeviceId, onSetCurrentDeviceId);
  yield takeEvery(NotificationsModelConstants.onFetchNotificationSettings, onFetchNotificationSettings);
  yield takeEvery(NotificationsModelConstants.onSetUnreadNotificationsDisplay, onSetUnreadNotificationsDisplay);
  yield takeEvery(NotificationsModelConstants.onSetChatNotificationSettingsType, onSetChatNotificationSettingsType);
  yield takeEvery(
    NotificationsModelConstants.onFetchUserLatestNotificationCenterDisplays,
    onFetchUserLatestNotificationCenterDisplays
  );
  yield takeLatest(
    NotificationsModelConstants.onFetchChatNotificationSettingsTypes,
    onFetchChatNotificationSettingsTypes
  );
  yield takeLatest(
    NotificationsModelConstants.onArchiveUserInOrganizationNotifications,
    onArchiveUserInOrganizationNotifications
  );
}

export function* onInit() {
  yield put(NotificationsModelActions.onFetchUnreadNotifications());
  yield put(
    NotificationsModelActions.onFetchUserLatestNotificationCenterDisplays(
      isMobileApp() ? [NotificationCenterType.ALL] : [NotificationCenterType.CHAT, NotificationCenterType.ACTION_BASED]
    )
  );
  if (!isMobileApp()) {
    yield put(NotificationsModelActions.onFetchNotificationSettings());
  }
}

export function* onFetchUserLatestNotificationCenterDisplays({ payload: { notificationCenterTypes } }: PayloadAction) {
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getUserLatestAllNotificationCenterDisplays, null, RequestStatus.LOADING)
    );
    const result = yield cps(client.restApiClient.getUserLatestAllNotificationCenterDisplays, {
      notificationCenterType: notificationCenterTypes,
    });

    let userLatestNotificationCenterDisplays = Map<Id, Map<NotificationCenterType, number>>({});

    Object.keys(result).map((organizationId) => {
      result[organizationId].forEach(({ notificationCenterType, displayedAt }) => {
        userLatestNotificationCenterDisplays = userLatestNotificationCenterDisplays.setIn(
          [organizationId, notificationCenterType],
          displayedAt
        );
      });
    });

    yield put(
      NotificationsModelActions.onBatchUserLatestNotificationCenterDisplay(userLatestNotificationCenterDisplays)
    );

    yield put(
      onSetRequestStatus(RequestTypesConstants.getUserLatestAllNotificationCenterDisplays, null, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error, { notificationCenterTypes });
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getUserLatestAllNotificationCenterDisplays,
        null,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onFetchNotifications({
  payload: { limit = 20, isArchived = false, force, notificationCenterType },
}: PayloadAction) {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  const notificationType = getNotificationTypesByNotificationCenterType(notificationCenterType);
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getUserNotifications, { notificationType });
  try {
    let page = yield select(selectPageLastNext, { requestType, objectId: currentOrganizationId });

    if (force) {
      page = null;
    } else if (page === null) {
      return;
    }

    yield put(onSetRequestStatus(requestType, currentOrganizationId, RequestStatus.LOADING));

    const queryParams = {
      limit,
      page,
      isArchived,
      notificationType: notificationCenterType ? notificationType : undefined,
    };

    const result = yield cps(client.restApiClient.getUserNotifications, currentOrganizationId, queryParams);
    if (result && result.data) {
      yield put(NotificationsModelActions.onBatchNotificationsData(result.data));
    } else {
      // ok
    }
    yield put(onSetPageLastNext(requestType, currentOrganizationId, result.page));
    yield put(onSetRequestStatus(requestType, currentOrganizationId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { limit });
    yield put(onSetRequestStatus(requestType, currentOrganizationId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchUnreadNotifications() {
  const userId = yield select(UsersModelSelectors.selectCurrentUserId);
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getUserAllUnreadNotifications, userId, RequestStatus.LOADING));

    const result: UnreadNotification[] = yield cps(client.restApiClient.getUserAllUnreadNotifications);
    const {
      unreadNotificationsTypes,
      unreadNotificationsChronology,
      unreadNotificationsCreationTimestamp,
      notificationsExternalData,
    } = parseUnreadNotifications(result);

    yield put(onSetRequestStatus(RequestTypesConstants.getUserAllUnreadNotifications, userId, RequestStatus.SUCCESS));
    yield put(
      NotificationsModelActions.onFetchUnreadNotificationsSuccess(
        makeActionResult({
          isOk: true,
          code: 'onFetchUnreadNotificationsSuccess',
          data: {
            unreadNotificationsTypes,
            unreadNotificationsChronology,
            unreadNotificationsCreationTimestamp,
            notificationsExternalData,
          },
        })
      )
    );
  } catch (error) {
    handleError(error, { userId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.getUserUnreadNotifications, userId, RequestStatus.FAILURE, error)
    );
  }
}

export function* onMutePushNotifications() {
  const deviceId = yield cps(localStorage.getItem, 'deviceId');
  try {
    const currentUserId = yield select(UsersModelSelectors.selectCurrentUserId);

    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserPushDevice, deviceId, RequestStatus.LOADING));

    if (currentUserId && deviceId) {
      // Call this only if we are authorized

      yield cps(client.restApiClient.deleteUserPushDevice, deviceId);
    } else {
      console.warn(
        `onMutePushNotifications: deviceId (${deviceId}) or currentUserId (${currentUserId}) are not defined`
      );
    }
    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserPushDevice, deviceId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserPushDevice, deviceId, RequestStatus.FAILURE, error));
  }
}

export function* onUnmutePushNotifications() {
  const currentUserId = yield select(UsersModelSelectors.selectCurrentUserId);
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserPushDevice, currentUserId, RequestStatus.LOADING));

    const currentDeviceId = yield cps(localStorage.getItem, 'deviceId');
    let deviceId;
    let deviceType;

    if (DesktopAppController.isDesktopApp()) {
      const generatedDesktopDeviceId = generateId();
      // We check for 'null' value incorrectly populated to localStorage
      deviceId = currentDeviceId !== 'null' ? currentDeviceId || generatedDesktopDeviceId : generatedDesktopDeviceId;
      deviceType = DeviceType.DESKTOP_APP;
    } else {
      const pushDeviceInfo = yield PushNotificationsClient.getDeviceInfo();
      if (pushDeviceInfo) {
        deviceId = pushDeviceInfo.deviceId;
        deviceType = pushDeviceInfo.deviceType;
      }
    }

    if (deviceId) {
      yield cps(localStorage.setItem, 'deviceId', deviceId);

      yield cps(client.restApiClient.updateUserPushDevice, deviceId, deviceType);
    } else {
      yield cps(localStorage.removeItem, 'deviceId');
      if (currentDeviceId) {
        yield cps(client.restApiClient.deleteUserPushDevice, currentDeviceId);
      }
    }

    yield put(onSetRequestStatus(RequestTypesConstants.updateUserPushDevice, currentUserId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateUserPushDevice, currentUserId, RequestStatus.FAILURE, error)
    );
  }
}

export function* onSetIsNotificationArchived({ payload: { notificationId, isArchived } }: PayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateNotification, notificationId, RequestStatus.LOADING));

    yield cps(client.restApiClient.updateNotification, notificationId, {
      isArchived,
      readAt: isArchived ? timestampNow() : null,
    });

    yield put(
      NotificationsModelActions.onSetIsNotificationArchivedSuccess(
        makeActionResult({
          code: 'onSetIsNotificationArchivedSuccess',
          isOk: 'true',
          data: {
            notificationId,
            isArchived,
          },
        })
      )
    );
    yield put(onSetRequestStatus(RequestTypesConstants.updateNotification, notificationId, RequestStatus.SUCCESS));
    if (isArchived) {
      UserTracker.track(UserTrackerEvent.notificationItem, { action: 'archived' });
    }
  } catch (error) {
    handleError(error, { notificationId, isArchived });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateNotification, notificationId, RequestStatus.FAILURE, error)
    );
  }
}

export function* onGetCurrentDeviceId() {
  try {
    const pushDeviceInfo = yield PushNotificationsClient.getDeviceInfo();
    const deviceId = pushDeviceInfo ? pushDeviceInfo.deviceId : null;
    if (deviceId) {
      yield cps(localStorage.setItem, 'deviceId', deviceId);
    } else {
      yield cps(localStorage.removeItem, 'deviceId');
    }
    return yield deviceId;
  } catch (error) {
    handleError(error);
    return yield null;
  }
}

export function* onSetCurrentDeviceId(action: PayloadAction) {
  const deviceId = action?.payload?.deviceId ?? null;
  try {
    if (deviceId) {
      yield cps(localStorage.setItem, 'deviceId', deviceId);
    } else {
      yield cps(localStorage.removeItem, 'deviceId');
    }
    return yield deviceId;
  } catch (error) {
    handleError(error);
    return yield null;
  }
}

function* onResetUnreadNotifications({ payload: { objectId } }: PayloadAction) {
  try {
    const lastReadTime = timestampNow();
    const currentOrganizationId = yield select(selectCurrentOrganizationId);
    yield put(
      onSetRequestStatus(RequestTypesConstants.readObjectUserUnreadNotifications, objectId, RequestStatus.LOADING)
    );
    const objectType = yield select(EntityModelSelectors.selectEntityType, { entityId: objectId });
    const objectNotificationIds = yield select(NotificationsModelSelectors.selectObjectChronology, { objectId });
    const notifications = yield select(NotificationsModelSelectors.selectUnreadNotifications);
    let notificationsData = emptyMap;
    notifications.forEach((notification) => {
      if (objectNotificationIds.includes(notification.id)) {
        notificationsData = notificationsData.set(notification.id, notification.set('readAt', lastReadTime));
      }
    });
    yield put(
      NotificationsModelActions.onResetUnreadNotificationsSuccess(
        makeActionResult({
          isOk: true,
          code: 'onResetUnreadNotificationsSuccess',
          data: {
            objectId,
            lastReadTime,
            currentOrganizationId,
            notificationsData,
          },
        })
      )
    );

    yield cps(
      client.restApiClient.readObjectUserUnreadNotifications,
      currentOrganizationId,
      objectType,
      objectId,
      lastReadTime
    );
    yield put(
      onSetRequestStatus(RequestTypesConstants.readObjectUserUnreadNotifications, objectId, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error, { objectId });
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.readObjectUserUnreadNotifications,
        objectId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

function* onMarkAllAsRead({ payload: { notificationCenterType } }: PayloadAction) {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    const lastReadTime = timestampNow();
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.readAllUserUnreadNotifications,
        currentOrganizationId,
        RequestStatus.LOADING
      )
    );
    const notificationTypes = notificationCenterType
      ? getNotificationTypesByNotificationCenterType(notificationCenterType)
      : [];

    const notifications =
      notificationTypes.length > 0
        ? yield select(NotificationsModelSelectors.selectUnreadNotificationsFilteredByNotificationTypes, {
            notificationTypes,
          })
        : yield select(NotificationsModelSelectors.selectUnreadNotifications);

    let currentOrganizationUnreadNotificationsChronology = yield select(
      NotificationsModelSelectors.selectUnreadNotificationsChronology
    );

    let notificationsData = emptyMap;
    notifications.forEach((notification) => {
      notificationsData = notificationsData.set(notification.id, notification.set('readAt', lastReadTime));
      currentOrganizationUnreadNotificationsChronology = currentOrganizationUnreadNotificationsChronology.update(
        notification.containerId,
        removeIdFromList(notification.id)
      );
    });

    yield put(
      NotificationsModelActions.onMarkAllAsReadSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMarkAllAsReadSuccess',
          data: {
            currentOrganizationId,
            notificationsData,
            currentOrganizationUnreadNotificationsChronology,
          },
        })
      )
    );

    yield cps(
      client.restApiClient.readAllUserUnreadNotifications,
      currentOrganizationId,
      lastReadTime,
      notificationTypes
    );
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.readAllUserUnreadNotifications,
        currentOrganizationId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.readAllUserUnreadNotifications,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

function* onReadNotification({ payload: { notificationId } }: PayloadAction) {
  try {
    const lastReadTime = timestampNow();
    yield put(onSetRequestStatus(RequestTypesConstants.updateNotification, notificationId, RequestStatus.LOADING));
    const currentOrganizationId = yield select(selectCurrentOrganizationId);
    const containerId = yield select(NotificationsModelSelectors.selectNotificationContainerId, { notificationId });

    yield put(
      NotificationsModelActions.onReadNotificationSuccess(
        makeActionResult({
          isOk: true,
          code: 'onReadNotificationSuccess',
          data: { currentOrganizationId, notificationId, containerId, lastReadTime },
        })
      )
    );

    yield cps(client.restApiClient.updateNotification, notificationId, { readAt: lastReadTime });
    yield put(onSetRequestStatus(RequestTypesConstants.updateNotification, notificationId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { notificationId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateNotification, notificationId, RequestStatus.FAILURE, error)
    );
  }
}

function* onSetUnreadNotificationsDisplay({ payload: { notificationCenterType } }: PayloadAction) {
  try {
    const lastDisplayTime = timestampNow();
    const organizationId = yield select(selectCurrentOrganizationId);
    const latestNotificationCenterDisplay = Map<NotificationCenterType, number>({
      [notificationCenterType]: lastDisplayTime,
    });

    yield put(
      NotificationsModelActions.onSetUserLatestNotificationCenterDisplay(
        latestNotificationCenterDisplay,
        organizationId
      )
    );

    yield cps(
      client.restApiClient.updateUserLatestNotificationCenterDisplayTime,
      organizationId,
      notificationCenterType,
      lastDisplayTime
    );
  } catch (error) {
    handleError(error, { notificationCenterType });
  }
}

function* onUpdateNotificationSettings({ payload: { notificationMethod, isEnabled } }: PayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateNotificationsSettings, organizationId, RequestStatus.LOADING)
    );

    yield cps(client.restApiClient.updateNotificationsSettings, organizationId, {
      [notificationMethod]: isEnabled,
    });

    if (notificationMethod === NotificationMethod.PUSH && isEnabled) {
      yield put(NotificationsModelActions.onUnmutePushNotifications());
    }

    UserTracker.track(UserTrackerEvent.settingChanged, {
      what: notificationMethodTrackingNames[notificationMethod],
      value: isEnabled ? 'on' : 'off',
    });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateNotificationsSettings, organizationId, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateNotificationsSettings,
        organizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

export function* onFetchNotificationSettings() {
  const organizationId = yield select(selectCurrentOrganizationId);
  const isRequestRepeatable = yield select(selectIsRequestRepeatable, {
    requestType: RequestTypesConstants.getNotificationsSettings,
    objectId: organizationId,
  });

  if (!isRequestRepeatable) {
    return;
  }

  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getNotificationsSettings, organizationId, RequestStatus.LOADING)
    );

    const result = yield cps(client.restApiClient.getNotificationsSettings, organizationId);

    if (result) {
      yield put(NotificationsModelActions.onCreateNotificationsSettingsData(result));
    }
    yield put(
      onSetRequestStatus(RequestTypesConstants.getNotificationsSettings, organizationId, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(RequestTypesConstants.getNotificationsSettings, organizationId, RequestStatus.FAILURE, error)
    );
  }
}

function* onSetChatNotificationSettingsType({ payload: { objectId, chatNotificationSettingsType } }: PayloadAction) {
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.setChatNotificationSettingsType, objectId, RequestStatus.LOADING)
    );
    yield put(
      NotificationsModelActions.onSetChatNotificationSettingsTypeSuccess(objectId, chatNotificationSettingsType)
    );

    yield cps(client.restApiClient.setChatNotificationSettingsType, objectId, chatNotificationSettingsType);
    yield put(
      onSetRequestStatus(RequestTypesConstants.setChatNotificationSettingsType, objectId, RequestStatus.SUCCESS)
    );
  } catch (error) {
    handleError(error, { objectId, chatNotificationSettingsType });
    yield put(
      onSetRequestStatus(RequestTypesConstants.setChatNotificationSettingsType, objectId, RequestStatus.FAILURE, error)
    );
  }
}

function* onFetchChatNotificationSettingsTypes() {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.fetchChatNotificationSettingsTypes,
        currentOrganizationId,
        RequestStatus.LOADING
      )
    );
    const chatNotificationSettingsTypes = yield cps(client.restApiClient.fetchChatNotificationSettingsTypes);
    yield put(NotificationsModelActions.onFetchChatNotificationSettingsTypesSuccess(chatNotificationSettingsTypes));
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.fetchChatNotificationSettingsTypes,
        currentOrganizationId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.fetchChatNotificationSettingsTypes,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error
      )
    );
  }
}

function* onArchiveUserInOrganizationNotifications({ payload: { notificationCenterType } }: PayloadAction) {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    const notificationsToArchiveTypes = getNotificationTypesByNotificationCenterType(notificationCenterType);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.archiveUserInOrganizationNotifications,
        currentOrganizationId,
        RequestStatus.LOADING
      )
    );

    const notificationIds = yield select(NotificationsModelSelectors.selectNotificationIds, { notificationCenterType });

    yield put(NotificationsModelActions.onArchiveUserInOrganizationNotificationsSuccess(notificationIds));

    yield cps(
      client.restApiClient.archiveUserInOrganizationNotifications,
      currentOrganizationId,
      notificationsToArchiveTypes
    );

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.archiveUserInOrganizationNotifications,
        currentOrganizationId,
        RequestStatus.SUCCESS
      )
    );
  } catch (error) {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.archiveUserInOrganizationNotifications,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error
      )
    );
    handleError(error, { notificationCenterType });
  }
}
