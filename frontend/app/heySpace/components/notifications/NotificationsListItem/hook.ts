import { SyntheticEvent, useCallback, useEffect } from 'react';

import { useHistory } from 'react-router';

import { UserTracker } from 'common/services';
import { useNotificationCenterContext } from 'components/notifications/NotificationsCenterIcon/NotificationCenterContext';
import { NotificationListItemInterface } from 'components/notifications/NotificationsListItem';
import { useDataPersister, useDataProvider } from 'components/notifications/NotificationsListItem/dataHooks';
import { i18n } from 'i18n';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

export type NotificationsListItemHookInterface = {
  notificationLink: string;
  creationTimestamp: number;
  isUnread: boolean;
  onArchiveNotification: (event: SyntheticEvent<HTMLButtonElement>) => void;
  onClick: VoidFunction;
  onReadNotification: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

export const useComponent = (props: NotificationListItemInterface): NotificationsListItemHookInterface => {
  const { onClose: onCloseNotificationsCenter } = useNotificationCenterContext();
  const history = useHistory();

  const dataProvider = useDataProvider(props);
  const dataPersister = useDataPersister(props);

  const onArchiveNotification = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      dataPersister.onArchiveNotification();
    },
    [props.notificationId, dataPersister.onArchiveNotification]
  );

  const onReadNotification = (event: SyntheticEvent<HTMLButtonElement>) => {
    dataPersister.onReadNotification();
  };

  const onPermissionDenied = useCallback(
    (objectName = 'project') => {
      dataPersister.onClickNotificationLinkFailure(
        {
          humanMessage: HumanMessage({
            kind: HumanMessageKind.warning,
            text: i18n.t(`You don't have necessary permision to access this {{objectName}}.`, { objectName }),
          }),
        },
        'space-permission-denied'
      );
    },
    [dataPersister.onClickNotificationLinkFailure]
  );

  const onClick = useCallback(() => {
    UserTracker.track(UserTrackerEvent.notificationItem, { action: 'clicked' });
    if (dataProvider.isUnread) {
      dataPersister.onReadNotification();
    }

    if (dataProvider.notificationLink) {
      if (!dataProvider.hasAccessToProject) {
        onPermissionDenied();

        return;
      }

      if (dataProvider.taskId) {
        if (dataProvider.hasAccessToTask) {
          dataPersister.onOpenCardDetailsModal(dataProvider.taskId);
        } else {
          onPermissionDenied('task');
        }
      } else {
        history.push(dataProvider.notificationLink);
      }
    }
    onCloseNotificationsCenter();
  }, [
    dataProvider.notificationLink,
    dataProvider.isUnread,
    dataProvider.hasAccessToProject,
    dataProvider.hasAccessToTask,
    dataProvider.taskId,
    onPermissionDenied,
    onCloseNotificationsCenter,
    dataPersister.onOpenCardDetailsModal,
    dataPersister.onReadNotification,
    onCloseNotificationsCenter,
  ]);

  useEffect(() => {
    props.measure();
  }, [dataProvider.projectName, dataProvider.listName, dataProvider.taskName]);

  useEffect(() => {
    props.measure();
  }, []);

  return {
    notificationLink: dataProvider.notificationLink,
    creationTimestamp: dataProvider.creationTimestamp,
    isUnread: dataProvider.isUnread,

    onArchiveNotification,
    onClick,
    onReadNotification,
  };
};
