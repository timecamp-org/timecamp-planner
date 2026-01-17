import { useEffect } from 'react';

import { useSelector } from 'react-redux';

import usePrevious from 'common/hooks/usePrevious';
import useRefreshData from 'common/hooks/useRefreshData';
import { Id } from 'common/utils/identifier';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { useOrganizationProjects } from 'models/domain/ProjectsModel/hooks/useOrganizationProjects';
import { onFetchConversationViewData } from 'models/domain/RequestModel/actions';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';

import { useDataProvider, useDataPersister } from './dataHooks';

export type MyTasksPageHookInterface = {
  hasAccessToMyTasks: boolean;
  isLoading: boolean;
  filterId: Id;
  selfConversationProjectId: Id;
  shouldRenderPlaceholder: boolean;
};

const useComponent = (): MyTasksPageHookInterface => {
  const {
    projectId,
    filterId,
    isLoading,
    isRequestRepeatable,
    currentUserId,
    queryParams,
    currentOrganizationId,
    isViewRequestFinished,
    isViewRequestRepeatable,
    viewId,
    shouldRenderPlaceholder,
  } = useDataProvider();

  const { onFetchMyTasksData, onCreateConversationIfDoesNotExist, onCreateViewSettings, onFetchMyTasksViewSettings } =
    useDataPersister();

  const isPreviousRequestRepeatable = usePrevious(isRequestRepeatable);
  const prevProjectId = usePrevious(projectId);
  const prevOrganizationId = usePrevious(currentOrganizationId);

  const refreshControllerOptions = {
    action: onFetchConversationViewData,
    paramsToInject: [
      { key: 'projectId', defaultValue: projectId },
      { key: 'userId', defaultValue: currentUserId },
      { key: 'queryParams', defaultValue: queryParams },
    ],
  };
  useOrganizationProjects();
  useRefreshData({}, refreshControllerOptions);

  useEffect(() => {
    if (
      projectId &&
      ((projectId !== prevProjectId && isRequestRepeatable) || (!isPreviousRequestRepeatable && isRequestRepeatable))
    ) {
      onFetchMyTasksData(projectId, currentUserId, queryParams);
    }
  }, [
    isRequestRepeatable,
    isPreviousRequestRepeatable,
    projectId,
    prevProjectId,
    queryParams.fetchArchived,
    onFetchMyTasksData,
    currentUserId,
    queryParams,
  ]);

  useEffect(() => {
    if (!projectId) {
      onCreateConversationIfDoesNotExist(currentUserId);
    }
  }, [projectId, currentUserId, onCreateConversationIfDoesNotExist]);

  const hasAccessToMyTasks = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.MY_TASKS,
    })
  );

  useEffect(() => {
    if (currentOrganizationId !== prevOrganizationId && isViewRequestRepeatable) {
      onFetchMyTasksViewSettings(currentOrganizationId);
    }
  }, [isViewRequestRepeatable, currentOrganizationId, prevOrganizationId, onFetchMyTasksViewSettings]);

  useEffect(() => {
    if (isViewRequestFinished && !viewId) {
      onCreateViewSettings(currentOrganizationId);
    }
  }, [isViewRequestFinished, viewId, currentOrganizationId, onCreateViewSettings]);

  return {
    hasAccessToMyTasks,
    isLoading,
    filterId,
    selfConversationProjectId: projectId,
    shouldRenderPlaceholder,
  };
};

export default useComponent;
