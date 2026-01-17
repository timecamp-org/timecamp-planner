import { FC } from 'react';

import UniversalPopover from 'commonComponents/UniversalPopover';
import { useTranslation } from 'i18n';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';

import { NotificationTabPanel } from './components/NotificationTabPanel';
import { renderArchiveAllConfirmationModal } from './components/renderers';
import { NotificationCenterContextConsumer, NotificationCenterContextProvider } from './NotificationCenterContext';
import styles from './styles.css';

export type NotificationsCenterIconInterface = {
  notificationCenterType: NotificationCenterType;
  className?: string;
};

export interface NotificationsCenterTooltipInterface {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NotificationsCenterTooltip: ReactFCWithChildren<NotificationsCenterTooltipInterface> = ({
  children,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <NotificationCenterContextProvider isOpen={isOpen} onClose={onClose}>
      <NotificationCenterContextConsumer>
        {({ hook }) => (
          <>
            <UniversalPopover
              isPopoverOpened={hook.isOpen}
              targetClassName={styles.Component}
              targetComponent={<div ref={hook.popoverTargetRef}>{children}</div>}
              popperComponent={<NotificationTabPanel />}
              popperContentWrapperClassName={styles.popperContent}
              popperPlacement="top-start"
              popperModifiers={{
                offset: {
                  offset: `0, 20`,
                },
              }}
              transitionDuration={0}
            />
            {renderArchiveAllConfirmationModal(hook, t)}
          </>
        )}
      </NotificationCenterContextConsumer>
    </NotificationCenterContextProvider>
  );
};
