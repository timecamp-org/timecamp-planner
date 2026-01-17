import { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as FiltersModelActions from 'models/component/FiltersModel/actions';
import { selectFilter, selectFilterByProperty } from 'models/component/FiltersModel/selectors';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';
import {
  selectIsProjectWithIdExist,
  selectProjectBackground,
  selectProjectIdByObjectId,
  selectProjectIsGroupOrDirectChat,
} from 'models/domain/ProjectsModel/selectors';
import { onFetchSpaceOrConversationViewData } from 'models/domain/RequestModel/actions';
import { getConversationViewData, getProjectViewData } from 'models/domain/RequestModel/constants/requestTypes';
import { selectIsRequestNotFinishedInitially } from 'models/domain/RequestModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { makeFilterId } from '../../../../../common/models/component/FiltersModel/utils';
import { getRequestTypeWithParams } from '../../../../../common/models/domain/RequestModel/helpers';
import { TaskStatusFilterType } from '../../../../../common/models/domain/TasksModel/types';

export type DataProviderHook = {
  objectId: Id;
  projectId: Id;
  isProjectViewDataRequestSuccess: boolean;
  isProjectExist: boolean;
  isConversation: boolean;
  currentUserId: Id;
  entityType: EntityType;
  showArchived: boolean;
  filterId: Id;
  isFilterExists: boolean;
  background: string;
};

export function useDataProvider(taskFiltersTargetType: TaskFiltersTargetType): DataProviderHook {
  const { projectId: objectId } = useParams<{ projectId: string }>();
  const projectId = useSelector((state) => selectProjectIdByObjectId(state, { objectId }));
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const isConversation = useSelector((state) => selectProjectIsGroupOrDirectChat(state, { projectId }));
  const isProjectExist = useSelector((state) => selectIsProjectWithIdExist(state, { projectId }));
  const entityType = useSelector((state) => selectEntityType(state, { entityId: projectId }));
  const background = useSelector((state) => selectProjectBackground(state, { projectId }));

  const filterId = makeFilterId(currentUserId, taskFiltersTargetType, projectId);
  const showArchived =
    useSelector((state) => selectFilterByProperty(state, { filterId, property: 'status' })) ===
    TaskStatusFilterType.ARCHIVED;
  const requestType = getRequestTypeWithParams(isConversation ? getConversationViewData : getProjectViewData, {
    fetchArchived: showArchived,
  });

  const isProjectViewDataRequestSuccess = !useSelector((state) =>
    selectIsRequestNotFinishedInitially(state, {
      requestType,
      objectId: projectId,
    })
  );
  const isFilterExists = !!useSelector((state) => selectFilter(state, { filterId }));

  return {
    objectId,
    projectId,
    isProjectViewDataRequestSuccess,
    isProjectExist,
    isConversation,
    currentUserId,
    entityType,
    showArchived,
    filterId,
    isFilterExists,
    background,
  };
}

type DataPersisterHook = {
  onFetchSpaceOrConversationViewData: (filterId: Id) => void;
  onInitFilters: (filterId: Id) => void;
};

export function useDataPersister(): DataPersisterHook {
  const { projectId: objectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();

  return {
    onFetchSpaceOrConversationViewData: useCallback(
      (filterId: Id) => dispatch(onFetchSpaceOrConversationViewData(objectId, filterId)),
      [dispatch, objectId]
    ),
    onInitFilters: useCallback((filterId: Id) => dispatch(FiltersModelActions.onInit(filterId)), [dispatch]),
  };
}
