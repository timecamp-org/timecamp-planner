import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types'
import { getProjectViewData } from 'common/models/domain/RequestModel/constants/requestTypes';
import { getRequestTypeWithParams } from 'common/models/domain/RequestModel/helpers';
import { Id } from 'common/utils/identifier'
import { List, Map } from 'immutable';
import { makeFilterId } from 'common/models/component/FiltersModel/utils';
import { onFetchProjectViewData } from 'models/domain/RequestModel/actions'
import { onSetProjectLastOpenedPanel } from '../../../utils/lastOpenedPanelController'
import { ProjectPanelType } from 'common/models/domain/ProjectsSettingsModel/types';
import { ProjectViewDataQueryParams } from 'common/models/domain/ProjectsModel/types';
import { selectCurrentUserId } from 'common/models/domain/UsersModel/selectors/domain';
import { selectFilterByProperty } from 'common/models/component/FiltersModel/selectors';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors'
import { selectIsRequestRepeatable, selectRequestIsLoading } from 'models/domain/RequestModel/selectors'
import { SortOrder, TaskFiltersTargetType } from 'common/models/component/FiltersModel/types';
import { TaskSortKey, TaskStatusFilterType } from 'common/models/domain/TasksModel/types';
import { useSelector } from 'common/hooks/useSelector'
import {
  selectFilteredAllTasksAssignedToUser,
  selectFilteredAndSortedProjectTaskIds,
} from 'common/models/domain/TasksModel/selectors';
import { selectConversationIdByProjectId, selectDirectChatPartner } from 'common/models/domain/ProjectsModel/selectors';

export type DataProviderHook = {
  isLoading: boolean;
  taskIds: List<Id>;
  filterId: Id;
  isProjectViewDataRequestRepeatable: boolean;
  fetchArchived: boolean;
  isTaskListEnabled: boolean;
};

const defaultSortBy = Map({ [TaskSortKey.PROGRESS]: SortOrder.ASC });

export function useDataProvider(spaceId: Id, isConversation: boolean): DataProviderHook {
  const currentUserId = useSelector(selectCurrentUserId);
  const filterId = makeFilterId(currentUserId, TaskFiltersTargetType.TASK_LIST, spaceId);
  const conversationId = useSelector((state) => selectConversationIdByProjectId(state, { projectId: spaceId }));
  const userId = useSelector((state) => selectDirectChatPartner(state, { conversationId }));

  const taskIds = useSelector((state) =>
    isConversation
      ? selectFilteredAllTasksAssignedToUser(state, {
          filterId,
          userId,
          defaultSortBy,
        })
      : selectFilteredAndSortedProjectTaskIds(state, {
          projectId: spaceId,
          filterId,
        })
  );

  const fetchArchived =
    useSelector((state) => selectFilterByProperty(state, { filterId, property: 'status' })) ===
    TaskStatusFilterType.ARCHIVED;

  const projectDataRequestType = getRequestTypeWithParams(getProjectViewData, {
    fetchArchived,
  });

  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, {
      requestType: projectDataRequestType,
      objectId: spaceId,
    })
  );

  const isProjectViewDataRequestRepeatable = useSelector((state) =>
    selectIsRequestRepeatable(state, {
      requestType: projectDataRequestType,
      objectId: spaceId,
    })
  );

  const isTaskListEnabled = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.SPACE_TASK_LIST,
    })
  );

  return {
    isProjectViewDataRequestRepeatable,
    isLoading,
    taskIds,
    filterId,
    fetchArchived,
    isTaskListEnabled,
  };
}

export type DataPersisterHook = {
  onFetchProjectViewData: (queryParams: ProjectViewDataQueryParams) => void;
  onUpdateLastPanelType: VoidFunction;
};

export function useDataPersister(spaceId: Id): DataPersisterHook {
  const dispatch = useDispatch();
  return {
    onFetchProjectViewData: useCallback(
      (queryParams: ProjectViewDataQueryParams) => {
        dispatch(onFetchProjectViewData(spaceId, queryParams));
      },
      [dispatch, spaceId]
    ),
    onUpdateLastPanelType: useCallback(() => {
      onSetProjectLastOpenedPanel(spaceId, ProjectPanelType.LIST);
    }, [spaceId]),
  };
}
