import { createContext, FC, useContext } from 'react';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';

import { NotificationsCenterIconHookInterface, useComponent } from './hook';

interface NotificationCenterContextInterface {
  hook: NotificationsCenterIconHookInterface;
  setCurrentTab: (notificationCenterType: NotificationCenterType) => void;
  onClose: () => void;
  notificationCenterType: NotificationCenterType;
}

const NotificationCenterContext = createContext<NotificationCenterContextInterface>(
  {} as NotificationCenterContextInterface,
);

interface NotificationCenterContextProviderInterface {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterContextProvider: ReactFCWithChildren<NotificationCenterContextProviderInterface> = ({
  children,
  isOpen,
  onClose,
}) => {
  const [notificationCenterType, setCurrentTab] = useLocalStorage(
    'currentNotificationsTab',
    NotificationCenterType.ALL,
  );
  const hook = useComponent({ notificationCenterType, isOpen, onClose });

  return (
    <NotificationCenterContext.Provider value={{ hook, setCurrentTab, notificationCenterType, onClose: hook.onClose }}>
      {children}
    </NotificationCenterContext.Provider>
  );
};

export const NotificationCenterContextConsumer = NotificationCenterContext.Consumer;

export const useNotificationCenterContext = () => useContext(NotificationCenterContext);
