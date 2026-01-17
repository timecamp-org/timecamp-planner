import { useEffect } from 'react';

import { List } from 'immutable';

import usePrevious from 'common/hooks/usePrevious';
import { useSelector } from 'common/hooks/useSelector';
import { UserTracker } from 'common/services';
import { Id } from 'common/utils/identifier';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { useOrganizationProjects } from 'models/domain/ProjectsModel/hooks/useOrganizationProjects';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';

import { useDataPersister, useDataProvider } from './dataHooks';

export type OverwatchPageHookInterface = {
  isOverwatchLoading: boolean;
  currentOrganizationId: Id;
  viewIds: List<Id>;
  hasAccessToOverwatch: boolean;
  shouldRenderPlaceholder: boolean;
};

const useComponent = (): OverwatchPageHookInterface => {
  const {
    currentOrganizationId,
    isOverwatchViewLoading,
    userHasCreatedOverwatchView,
    isCreateOverwatchViewModalOpen,
    isOverwatchRequestRepeatable,
    isCreatingOverwatch,
    viewIds,
    shouldRenderPlaceholder,
  } = useDataProvider();
  const { onOpenCreateOverwatchViewModal, onFetchOverwatchViewSettings } = useDataPersister();

  const isOrganizationChanged = usePrevious<Id>(currentOrganizationId);

  useEffect(() => {
    if (isOverwatchRequestRepeatable) {
      onFetchOverwatchViewSettings(currentOrganizationId);
    }
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'Overwatch' });
  }, []);

  useOrganizationProjects();

  useEffect(() => {
    if (isOrganizationChanged) {
      onFetchOverwatchViewSettings(currentOrganizationId);
    }
  }, [currentOrganizationId, onFetchOverwatchViewSettings]);

  const hasAccessToOverwatch = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.OVERWATCH,
    })
  );

  return {
    isOverwatchLoading: isOverwatchViewLoading,
    currentOrganizationId,
    viewIds,
    hasAccessToOverwatch,
    shouldRenderPlaceholder,
  };
};

export default useComponent;
