import React, { CSSProperties, memo } from 'react';

import { IconButton } from '@mui/material';

import { Id } from 'common/utils/identifier';
import { Check } from 'commonComponents/Icons/fontawesome/Check';
import { TrashCan } from 'commonComponents/Icons/fontawesome/TrashCan';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation/component';
import { NotificationsListItemHookInterface, useComponent } from 'components/notifications/NotificationsListItem/hook';
import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import { i18n, useTranslation } from 'i18n';

import DateOutput from '../../date/DateOutput';
import TimeOutput from '../../time/TimeOutput';
import NotificationIcon from '../NotificationIcon';
import NotificationText from '../NotificationText';

import styles from './styles.css';

export type NotificationListItemInterface = {
  className?: string;
  style: CSSProperties;
  notificationId: Id;

  measure: VoidFunction;
};

const NotificationListItem: React.FC<NotificationListItemInterface> = (props) => {
  const hook = useComponent(props);
  const { t } = useTranslation();

  return (
    <div
      className={`
        ${props.className ? props.className : styles.Component} 
        ${hook.isUnread ? styles.unreadBackground : ''}
      `}
      style={props.style}
      onClick={hook.onClick}
    >
      <div className={styles.left}>
        <NotificationIcon notificationId={props.notificationId} />
        <div className={styles.content}>
          <NotificationText notificationId={props.notificationId} className={styles.notificationText} t={t} />
          {renderDate(hook)}
        </div>
      </div>
      <StopClickEventPropagation>
        <div className={styles.right}>
          <IconButton onClick={hook.onArchiveNotification}>
            <TrashCan size="sm" />
          </IconButton>
          <IconButton onClick={hook.onReadNotification}>
            <Check size="sm" />
          </IconButton>
        </div>
      </StopClickEventPropagation>
    </div>
  );
};

function renderDate(hook: NotificationsListItemHookInterface) {
  let date;
  if (isToday(hook.creationTimestamp)) {
    date = <div className={styles.date}>{i18n.t('Today')}</div>;
  } else if (isYesterday(hook.creationTimestamp)) {
    date = <div className={styles.date}>{i18n.t('Yesterday')}</div>;
  } else {
    date = <DateOutput className={styles.date} format={'MMM D'} timestamp={hook.creationTimestamp} />;
  }
  return (
    <div className={styles.dateWrapper}>
      {date}
      <span className={styles.date}>{i18n.t('at')}</span>
      <TimeOutput
        // @ts-ignore
        className={styles.date}
        format={'h:mm A'}
        timestamp={hook.creationTimestamp}
      />
    </div>
  );
}

export default memo(NotificationListItem);
