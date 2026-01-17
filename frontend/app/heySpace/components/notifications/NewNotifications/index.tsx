import React from 'react';

import { IconButton, Tooltip } from '@mui/material';

import { doNothing } from 'common/utils';
import { Check } from 'commonComponents/Icons/fontawesome/Check';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import { NewNotificationsHookInterface, useComponent } from 'components/notifications/NewNotifications/hook';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';

import NotificationsList from '../NotificationsList';

import styles from './styles.css';

export type NewNotificationsInterface = {
  className?: string;
  notificationCenterType: NotificationCenterType;
  onOpenArchiveAllConfirmationModal?: VoidFunction;
};

const defaultProps = {
  onOpenArchiveAllConfirmationModal: doNothing,
};

const NewNotifications: React.FC<NewNotificationsInterface> = (props) => {
  const hook = useComponent(props.notificationCenterType);
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.header}>{hook.areThereUnarchivedNotifications && renderRightButtons(hook, props, t)}</div>
      <NotificationsList className={styles.notificationList} />
    </div>
  );
};

function renderRightButtons(
  hook: NewNotificationsHookInterface,
  props: NewNotificationsInterface,
  t: TranslateFunction
) {
  return (
    <div className={styles.rightButtons}>
      <Tooltip title={t('Archive all')} arrow placement="top">
        <IconButton onClick={props.onOpenArchiveAllConfirmationModal}>
          <TrashCan size="sm" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('Mark all as read')} arrow placement="top" sx={{ size: '16px' }}>
        <IconButton onClick={hook.onMarkAllAsRead}>
          <Check size="sm" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

NewNotifications.defaultProps = defaultProps;

export default NewNotifications;
