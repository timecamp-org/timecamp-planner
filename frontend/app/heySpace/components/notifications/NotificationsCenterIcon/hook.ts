import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import useElementOpen from 'common/hooks/useElementOpen';
import {
  NotificationsCenterIconInterface,
  useDataPersister,
  useDataProvider,
} from 'components/notifications/NotificationsCenterIcon/dataHooks';
import useOnPopoverClickOutside from 'hooks/useOnPopoverClickOutside';

export type NotificationsCenterIconHookInterface = {
  isArchiveAllConfirmationModalVisible: boolean;
  areThereUnreadNotifications: boolean;
  unreadNotificationsCount: number;
  popoverTargetRef: RefObject<HTMLDivElement>;

  isOpen: boolean;
  onSetIsOpen: (isOpen: boolean) => void;
  onClose: VoidFunction;
  onToggleOpen: VoidFunction;
  onClickNotificationCenterIcon: VoidFunction;

  onSetIsArchiveAllConfirmationModalVisible: (isVisible: boolean) => void;
  onOpenArchiveAllConfirmationModal: VoidFunction;
  onArchiveUserInOrganizationNotifications: VoidFunction;
};

export function useComponent(props: NotificationsCenterIconInterface): NotificationsCenterIconHookInterface {
  const [isArchiveAllConfirmationModalVisible, onSetIsArchiveAllConfirmationModalVisible] = useState(false);

  const { isOpen, onSetIsOpen, onClose, onToggleOpen } = useElementOpen(false);

  useEffect(() => {
    onSetIsOpen(props.isOpen);
  }, [props.isOpen, onSetIsOpen]);

  const onCloseTooltip = () => {
    onClose();
    props.onClose();
  };

  const { unreadNotificationsCount } = useDataProvider(props);

  const dataPersister = useDataPersister(props);

  const onOpenArchiveAllConfirmationModal = () => {
    onSetIsArchiveAllConfirmationModalVisible(true);
  };

  const onClickNotificationCenterIcon = useCallback(() => {
    onToggleOpen();
    if (!isOpen) {
      dataPersister.onSetUnreadNotificationsDisplay();
    }
  }, [isOpen, onToggleOpen, dataPersister.onSetUnreadNotificationsDisplay]);

  const popoverTargetRef: RefObject<HTMLDivElement> = useRef(null);
  useOnPopoverClickOutside(popoverTargetRef, onCloseTooltip);

  return {
    isArchiveAllConfirmationModalVisible,
    areThereUnreadNotifications: unreadNotificationsCount > 0,
    unreadNotificationsCount,
    popoverTargetRef,

    isOpen,
    onSetIsOpen,
    onClose: onCloseTooltip,
    onToggleOpen,
    onClickNotificationCenterIcon,

    onSetIsArchiveAllConfirmationModalVisible,
    onOpenArchiveAllConfirmationModal,
    onArchiveUserInOrganizationNotifications: dataPersister.onArchiveUserInOrganizationNotifications,
  };
}
