/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MouseEventHandler } from 'react';

import UniversalModal from 'commonComponents/UniversalModal';
import NewNotifications from 'components/notifications/NewNotifications';
import { TranslateFunction } from 'i18n/types';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';

import { NotificationsCenterIconHookInterface } from '../hook';
import styles from '../styles.css';

export function renderNotificationList(
  hook: NotificationsCenterIconHookInterface,
  notificationCenterType: NotificationCenterType
) {
  return (
    <NewNotifications
      notificationCenterType={notificationCenterType}
      className={styles.notificationList}
      onOpenArchiveAllConfirmationModal={hook.onOpenArchiveAllConfirmationModal}
    />
  );
}

export function renderArchiveAllConfirmationModal(hook: NotificationsCenterIconHookInterface, t: TranslateFunction) {
  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <div onClick={onClick}>
      <UniversalModal
        isModalOpen={hook.isArchiveAllConfirmationModalVisible}
        cancelButtonCaption={t('Cancel')}
        onSetIsModalOpen={hook.onSetIsArchiveAllConfirmationModalVisible}
        shouldFocusOnOpen={false}
        onModalSave={hook.onArchiveUserInOrganizationNotifications}
        className={styles.archiveAllModal}
        saveButtonCaption={t('Archive all')}
        header={t('ARCHIVE ALL')}
      >
        {t('Are you sure you want to archive all notifications? This cannot be undone.')}
      </UniversalModal>
    </div>
  );
}
