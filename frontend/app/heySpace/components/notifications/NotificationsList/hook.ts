import { Ref, useEffect, useRef } from 'react';

import { List } from 'immutable';
import { CellMeasurerCache, List as VirtualizedList, OnScrollCallback } from 'react-virtualized';

import useRefreshData, { RefreshControllerOptions } from 'common/hooks/useRefreshData';
import { Id } from 'common/utils/identifier';
import { useNotificationCenterContext } from 'components/notifications/NotificationsCenterIcon/NotificationCenterContext';
import { useDataPersister, useDataProvider } from 'components/notifications/NotificationsList/dataHooks';
import * as NotificationModalActions from 'models/domain/NotificationsModel/actions';

const MINIMUM_RESULTS_TO_FETCH = 20;
const refreshDataParams: RefreshControllerOptions = {
  action: NotificationModalActions.onFetchNotifications,
  paramsToInject: [
    { key: 'limit', defaultValue: MINIMUM_RESULTS_TO_FETCH },
    { key: 'isArchived', defaultValue: false },
    { key: 'force', defaultValue: false },
    { key: 'notificationCenterType' },
  ],
};

export type NotificationsListHookInterface = {
  notificationIds: List<Id>;
  isLoading: boolean;
  onFetchNotifications: (loadNextPage: boolean, limit: number) => void;
  cache: CellMeasurerCache;

  onLoadMore: VoidFunction;
  onScroll: OnScrollCallback;
  listRef: Ref<VirtualizedList>;
};

export const useComponent = (): NotificationsListHookInterface => {
  const { notificationCenterType } = useNotificationCenterContext();
  useRefreshData({ notificationCenterType }, refreshDataParams);

  const listRef = useRef<VirtualizedList>(null);
  const previousScrollTop = useRef<number>(0);
  const cache = useRef<CellMeasurerCache>(
    new CellMeasurerCache({
      defaultHeight: 100,
      fixedWidth: true,
    })
  );

  const { notificationIds, hasMoreToLoad, isLoading, isRequestInitiallyFinished } =
    useDataProvider(notificationCenterType);

  const dataPersister = useDataPersister(notificationCenterType);

  const onFetchNotifications = () => {
    if (hasMoreToLoad && !isLoading) {
      dataPersister.onFetchNotifications(MINIMUM_RESULTS_TO_FETCH);
    }
  };

  const onLoadMore = () => onFetchNotifications();

  const onScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const isScrolledToBottom = scrollHeight === Math.round(clientHeight + scrollTop);
    if (isScrolledToBottom) {
      previousScrollTop.current = scrollTop;
      onLoadMore();
    }
  };

  useEffect(() => {
    if (!isRequestInitiallyFinished) {
      onFetchNotifications();
    }
    cache.current.clearAll();
  }, [notificationCenterType, isRequestInitiallyFinished]);

  useEffect(() => {
    if (isRequestInitiallyFinished && notificationIds.size < MINIMUM_RESULTS_TO_FETCH) {
      onLoadMore();
    }
  }, [notificationIds.size, onLoadMore, isRequestInitiallyFinished]);

  useEffect(() => {
    if (listRef.current && previousScrollTop.current) {
      listRef.current.scrollToPosition(previousScrollTop.current);
    }
  }, [notificationIds.size]);

  return {
    notificationIds,
    isLoading,
    onFetchNotifications,
    cache: cache.current,

    onLoadMore,
    onScroll,
    listRef,
  };
};
