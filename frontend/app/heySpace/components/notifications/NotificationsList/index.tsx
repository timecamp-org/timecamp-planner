import React from 'react';

import { AutoSizer, CellMeasurer } from 'react-virtualized';
import { List as VirtualizedList } from 'react-virtualized/dist/es/List';

import LoadingDots from 'commonComponents/LoadingDots';
import { useComponent } from 'components/notifications/NotificationsList/hook';
import { useTranslation } from 'i18n';

import EmptyNotificationsList from '../EmptyNotificationsList';
import NotificationsListItem from '../NotificationsListItem';
import NotificationsLoading from '../NotificationsLoading';

import styles from './styles.css';

export type NotificationsListInterface = {
  className?: string;
};

const NotificationsList: React.FC<NotificationsListInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent();

  return (
    <div className={props.className ? props.className : styles.Component}>
      {hook.notificationIds.isEmpty() ? (
        renderCaseEmpty()
      ) : (
        <AutoSizer>
          {({ width, height }) => (
            <VirtualizedList
              height={height}
              width={width}
              deferredMeasurementCache={hook.cache}
              rowHeight={hook.cache.rowHeight}
              rowRenderer={renderRow}
              rowCount={hook.notificationIds.size}
              onScroll={hook.onScroll}
              ref={hook.listRef}
              overscanRowCount={3}
            />
          )}
        </AutoSizer>
      )}
      {hook.isLoading && !hook.notificationIds.isEmpty() ? bottomLoaderRenderer() : null}
    </div>
  );

  function renderRow({ index, key, parent, style }) {
    const notificationId = hook.notificationIds.get(index);

    return (
      <CellMeasurer cache={hook.cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        {({ measure }) => (
          <NotificationsListItem key={notificationId} style={style} notificationId={notificationId} measure={measure} />
        )}
      </CellMeasurer>
    );
  }

  function bottomLoaderRenderer() {
    return <NotificationsLoading className={styles.loading} message={t('Loading notifications')} />;
  }

  function renderCaseEmpty() {
    if (hook.isLoading) {
      return (
        <div className={styles.loaderWrapper}>
          <LoadingDots className={styles.loadingDots} />
        </div>
      );
    } else {
      return (
        <EmptyNotificationsList
          className={styles.emptyNotifications}
          title={t('Nothing here yet')}
          message={t('Your notifications will show up here.')}
        />
      );
    }
  }
};

export default NotificationsList;
