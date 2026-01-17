import React, { memo } from 'react';

import { Id } from 'common/utils/identifier';
import { NotificationIconHookInterface, useComponent } from 'components/notifications/NotificationIcon/hook';
import { NotificationType } from 'models/domain/NotificationsModel/types';
import commonStyles from 'styles/common.css';

import PersonIcon from '../../person/PersonIcon';

import styles from './styles.css';

const avatarSize = 7 * parseInt(commonStyles.gridCellSize, 10);

export type NotificationIconInterface = {
  notificationId: Id;
};

export const NotificationIcon: React.FC<NotificationIconInterface> = (props) => {
  const hook = useComponent(props);

  return (
    <div className={styles.Component}>
      {hook.shouldRenderPersonIcon ? renderPersonIcon(hook) : renderMascotIcon(hook)}
    </div>
  );
};

function renderPersonIcon(hook: NotificationIconHookInterface) {
  return (
    <PersonIcon
      userId={hook.actingUserId}
      wrapperClassName={styles.personIcon}
      showOnlineIndicator={false}
      width={avatarSize}
      height={avatarSize}
    />
  );
}

function renderMascotIcon(hook: NotificationIconHookInterface) {
  return <div className={getMascotClassName(hook)} />;
}

function getMascotClassName(hook: NotificationIconHookInterface) {
  switch (hook.notificationType) {
    case NotificationType.INVITATION_JOINED:
      return styles.invitationMascot;
    default:
      return styles.botMascot;
  }
}

export default memo(NotificationIcon);
