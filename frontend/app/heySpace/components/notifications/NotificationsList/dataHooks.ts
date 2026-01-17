import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import { selectNotificationIds } from 'models/domain/NotificationsModel/selectors';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectHasMoreToLoad } from 'models/domain/PaginationModel/selectors';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { selectIsRequestFinished, selectRequestIsLoading } from 'models/domain/RequestModel/selectors';

export type DataProviderInterface = {
  notificationIds: List<Id>;
  hasMoreToLoad: boolean;
  isLoading: boolean;
  isRequestInitiallyFinished: boolean;
};

export const useDataProvider = (notificationCenterType: NotificationCenterType): DataProviderInterface => {
  const currentOrganizationId = useSelector((state) => selectCurrentOrganizationId(state));
  const notificationType = getNotificationTypesByNotificationCenterType(notificationCenterType);
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getUserNotifications, { notificationType });

  const notificationIds = useSelector((state) => selectNotificationIds(state, { notificationCenterType }));
  const hasMoreToLoad = useSelector((state) =>
    selectHasMoreToLoad(state, { objectId: currentOrganizationId, requestType })
  );
  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, { objectId: currentOrganizationId, requestType })
  );
  const isRequestInitiallyFinished = useSelector((state) =>
    selectIsRequestFinished(state, { objectId: currentOrganizationId, requestType })
  );

  return {
    notificationIds,
    hasMoreToLoad,
    isLoading,
    isRequestInitiallyFinished,
  };
};

export type DataPersisterInterface = {
  onFetchNotifications: (limit: number) => void;
};

export const useDataPersister = (notificationCenterType: NotificationCenterType): DataPersisterInterface => {
  const dispatch = useDispatch();

  const onFetchNotifications = (limit: number) => {
    dispatch(NotificationsModelActions.onFetchNotifications(limit, false, false, notificationCenterType));
  };

  return {
    onFetchNotifications,
  };
};
