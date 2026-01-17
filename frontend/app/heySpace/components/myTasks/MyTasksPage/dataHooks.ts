import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { useSelector } from 'common/hooks/useSelector';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { generateConversationId } from 'common/utils/generateCombinedId';
import {
  selectCurrentOrganizationNonDirectProjectsData,
  selectProjectIdByConversationId,
} from 'models/domain/ProjectsModel/selectors';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { selectFilterByProperty } from 'models/component/FiltersModel/selectors';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { getConversationViewData, getViewSettings } from 'models/domain/RequestModel/constants/requestTypes';
import { selectIsRequestFinished, selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors';
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { Id } from 'common/utils/identifier';
import { onFetchConversationViewData } from 'models/domain/RequestModel/actions';
import { ConversationViewDataQueryParams } from 'models/domain/RequestModel/types';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import { List } from 'immutable';
import { ViewSettingsViewType, ViewContainerType } from 'models/domain/ViewSettingsModel/types';
import { onFetchViewSettings, onCreateBaseViewSettings } from 'models/domain/ViewSettingsModel/actions';
import { selectViewSettingsIdByTypeAndContainerId } from 'models/domain/ViewSettingsModel/selectors/domain';
import { OverwatchViewSettingsBody, defaultFilters } from 'models/domain/OverwatchModel/models';

export type DataProviderHook = {
  isLoading: boolean;
  isRequestRepeatable: boolean;
  filterId: Id;
  projectId: Id;
  currentUserId: Id;
  currentOrganizationId: Id;
  queryParams: ConversationViewDataQueryParams;
  isViewRequestFinished: boolean;
  isViewRequestRepeatable: boolean;
  viewId: Id;
  shouldRenderPlaceholder: boolean;
};

export function useDataProvider(): DataProviderHook {
  const currentUserId = useSelector(selectCurrentUserId);
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const selfConversationId = generateConversationId([currentUserId], currentOrganizationId);
  const projectId = useSelector((state) =>
    selectProjectIdByConversationId(state, { conversationId: selfConversationId })
  );
  const filterId = makeFilterId(currentUserId, TaskFiltersContainerType.MY_TASKS, currentOrganizationId);
  const showArchived =
    useSelector((state) => selectFilterByProperty(state, { filterId, property: 'status' })) ===
    TaskStatusFilterType.ARCHIVED;
  const queryParams = { fetchArchived: showArchived };
  const requestType = getRequestTypeWithParams(getConversationViewData, queryParams);
  const isLoading = useSelector((state) => !selectIsRequestFinished(state, { requestType, objectId: projectId }));
  const isRequestRepeatable = useSelector((state) =>
    selectIsRequestRepeatable(state, { requestType, objectId: projectId })
  );

  const isViewRequestFinished = useSelector((state) =>
    selectIsRequestFinished(state, {
      requestType: getViewSettings,
      objectId: [ViewSettingsViewType.MY_TASKS, currentOrganizationId],
    })
  );
  const isViewRequestRepeatable = useSelector((state) =>
    selectIsRequestRepeatable(state, {
      requestType: getViewSettings,
      objectId: [ViewSettingsViewType.MY_TASKS, currentOrganizationId],
    })
  );
  const viewId = useSelector((state) =>
    selectViewSettingsIdByTypeAndContainerId(state, {
      viewType: ViewSettingsViewType.MY_TASKS,
      containerId: currentOrganizationId,
      containerType: ViewContainerType.ORGANIZATION,
    })
  );

  const projects = useSelector(selectCurrentOrganizationNonDirectProjectsData);

  return {
    isLoading,
    currentOrganizationId,
    projectId,
    currentUserId,
    filterId,
    isRequestRepeatable,
    queryParams,
    isViewRequestFinished,
    isViewRequestRepeatable,
    viewId,
    shouldRenderPlaceholder: !projects.size,
  };
}

export type DataPersisterHook = {
  onFetchMyTasksData: (projectId: Id, currentUserId: Id, queryParams: ConversationViewDataQueryParams) => void;
  onCreateConversationIfDoesNotExist: (currentUserId: Id) => void;
  onFetchMyTasksViewSettings: (organizationId: Id) => void;
  onCreateViewSettings: (organizationId: Id) => void;
};

export function useDataPersister(): DataPersisterHook {
  const dispatch = useDispatch();
  return {
    onFetchMyTasksData: useCallback(
      (projectId: Id, currentUserId: Id, queryParams: ConversationViewDataQueryParams) =>
        dispatch(onFetchConversationViewData(projectId, currentUserId, queryParams)),
      [dispatch]
    ),
    onCreateConversationIfDoesNotExist: useCallback(
      (currentUserId: Id) => dispatch(ProjectsModelActions.onCreateConversationIfDoesNotExist(List([currentUserId]))),
      [dispatch]
    ),
    onFetchMyTasksViewSettings: useCallback(
      (organizationId: Id) => {
        dispatch(onFetchViewSettings(ViewSettingsViewType.MY_TASKS, ViewContainerType.ORGANIZATION, organizationId));
      },
      [dispatch]
    ),

    onCreateViewSettings: useCallback(
      (organizationId: Id) => {
        const myTasksViewSettingsBody = OverwatchViewSettingsBody({ filters: defaultFilters });
        dispatch(
          onCreateBaseViewSettings(
            ViewSettingsViewType.MY_TASKS,
            ViewContainerType.ORGANIZATION,
            organizationId,
            myTasksViewSettingsBody
          )
        );
      },
      [dispatch]
    ),
  };
}
