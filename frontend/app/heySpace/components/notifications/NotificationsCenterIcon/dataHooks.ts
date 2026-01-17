import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import { selectAllUnreadNotificationsSinceLastDisplayCount } from 'models/domain/NotificationsModel/selectors';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils';

export interface DataProviderHookInterface {
  unreadNotificationsCount: number;
}

export interface NotificationsCenterIconInterface {
  notificationCenterType: NotificationCenterType;
  isOpen: boolean;
  onClose: () => void;
}

export const useDataProvider = ({
  notificationCenterType,
}: NotificationsCenterIconInterface): DataProviderHookInterface => {
  const includedNotificationTypes = getNotificationTypesByNotificationCenterType(notificationCenterType);

  const unreadNotificationsCount = useSelector((state) =>
    selectAllUnreadNotificationsSinceLastDisplayCount(state, { includedNotificationTypes })
  );

  return {
    unreadNotificationsCount,
  };
};

export interface DataPersisterHookInterface {
  onSetUnreadNotificationsDisplay: VoidFunction;
  onArchiveUserInOrganizationNotifications: VoidFunction;
}

export const useDataPersister = ({
  notificationCenterType,
}: NotificationsCenterIconInterface): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  const onSetUnreadNotificationsDisplay = () =>
    dispatch(NotificationsModelActions.onSetUnreadNotificationsDisplay(notificationCenterType));

  const onArchiveUserInOrganizationNotifications = () =>
    dispatch(NotificationsModelActions.onArchiveUserInOrganizationNotifications(notificationCenterType));

  return {
    onSetUnreadNotificationsDisplay,
    onArchiveUserInOrganizationNotifications,
  };
};
