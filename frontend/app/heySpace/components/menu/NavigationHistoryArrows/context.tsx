import React, { createContext, useEffect } from 'react';
import { useParams } from 'react-router';
import queryString from 'query-string';
import usePrevious from 'common/hooks/usePrevious';
import { NavigationStackItemInterface } from 'models/domain/RouterModel/types';
import { List } from 'immutable';
import { createUrlFromRoute } from 'models/domain/RouterModel/helpers';
import { useLocation } from 'react-router-dom';
import { useDataPersister, useDataProvider } from './dataHooks';
import generateId from 'common/utils/generate-pushid';

const emptyList = List<NavigationStackItemInterface>();

export type NavigationHistoryContextInterface = {
  appHistoryStack: List<NavigationStackItemInterface>;
};

export const NavigationHistoryContext = createContext<NavigationHistoryContextInterface>({
  appHistoryStack: emptyList,
});

export const NavigationHistoryProvider: ReactFCWithChildren = ({ children }) => {
  const params = useParams<NavigationStackItemInterface>();
  const location = useLocation<{ selfControlled: boolean }>();

  const { organizationId, lastRoute } = useDataProvider();
  const { onPushRoute } = useDataPersister();

  const querySearch = queryString.extract(window.location.href);
  const { taskId } = queryString.parse(querySearch) as { taskId: string };

  const navigationStackItem: NavigationStackItemInterface = {
    id: generateId(),
    ...params,
    taskId,
  };

  const currentUrl = createUrlFromRoute(navigationStackItem);
  const prevUrl = usePrevious<string>(currentUrl);

  const prevRouteUrl = createUrlFromRoute(lastRoute);

  useEffect(() => {
    if (
      currentUrl !== prevUrl &&
      currentUrl !== prevRouteUrl &&
      !location.state?.selfControlled &&
      params.projectPanelType
    ) {
      onPushRoute(navigationStackItem, organizationId);
    }
  }, [currentUrl, prevUrl, navigationStackItem, prevRouteUrl, location.state, organizationId, onPushRoute]);

  return <>{children}</>;
};
