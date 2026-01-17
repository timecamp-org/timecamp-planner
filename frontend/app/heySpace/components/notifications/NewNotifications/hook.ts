import { useDataPersister, useDataProvider } from 'components/notifications/NewNotifications/dataHooks';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';

export type NewNotificationsHookInterface = {
  areThereUnarchivedNotifications: boolean;
  isLoading: boolean;

  onMarkAllAsRead: VoidFunction;
};

export const useComponent = (notificationCenterType: NotificationCenterType): NewNotificationsHookInterface => {
  const { areThereUnarchivedNotifications, isLoading } = useDataProvider(notificationCenterType);

  const { onMarkAllAsRead } = useDataPersister(notificationCenterType);

  return {
    areThereUnarchivedNotifications,
    isLoading,
    onMarkAllAsRead,
  };
};
