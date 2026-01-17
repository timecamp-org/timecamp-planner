import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import * as PersonalProjectStructureModelActions from 'models/domain/PersonalProjectStructureModel/actions';
import { selectSortedProjectGroupIds } from 'models/domain/PersonalProjectStructureModel/selectors';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import {
  getOrganizationProjectsWithUnreadMessagesQueryParams,
  organizationProjectsWithUnreadMessagesRequestType,
} from 'models/domain/ProjectsModel/requestQueryParams';
import {
  fetchChatNotificationSettingsTypes,
  getPersonalProjectStructure,
} from 'models/domain/RequestModel/constants/requestTypes';
import {
  selectIsRequestRepeatable,
  selectRequestIsLoadingInitially,
} from 'models/domain/RequestModel/selectors';

export type DataProviderHookInterface = {
  projectGroupIds: List<Id>;
  isRequestFinished: boolean;
  isOrganizationProjectsRequestRepeatable: boolean;
  isNotificationSettingsRequestRepeatable: boolean;
  isProjectStructureRequestRepeatable: boolean;
  currentOrganizationId: Id;
};

export const useDataProvider = () => {
  const currentOrganizationId = useSelector((state) =>
    selectCurrentOrganizationId(state)
  );
  return {
    projectGroupIds: useSelector(selectSortedProjectGroupIds),
    isRequestFinished: !useSelector((state) =>
      selectRequestIsLoadingInitially(state, {
        requestType: organizationProjectsWithUnreadMessagesRequestType,
        objectId: currentOrganizationId,
      })
    ),
    isOrganizationProjectsRequestRepeatable: useSelector((state) =>
      selectIsRequestRepeatable(state, {
        requestType: organizationProjectsWithUnreadMessagesRequestType,
        objectId: currentOrganizationId,
      })
    ),
    isNotificationSettingsRequestRepeatable: useSelector((state) =>
      selectIsRequestRepeatable(state, {
        requestType: fetchChatNotificationSettingsTypes,
        objectId: currentOrganizationId,
      })
    ),
    isProjectStructureRequestRepeatable: useSelector((state) =>
      selectIsRequestRepeatable(state, {
        requestType: getPersonalProjectStructure,
        objectId: currentOrganizationId,
      })
    ),
    currentOrganizationId,
  };
};

export type DataPersisterHookInterface = {
  onFetchChatNotificationSettingsTypes: VoidFunction;
  onFetchOrganizationProjects: VoidFunction;
  onFetchPersonalProjectStructure: VoidFunction;
};

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  const onFetchChatNotificationSettingsTypes = useCallback(
    () =>
      dispatch(
        NotificationsModelActions.onFetchChatNotificationSettingsTypes()
      ),
    [dispatch]
  );

  const onFetchOrganizationProjects = useCallback(
    () =>
      dispatch(
        ProjectsModelActions.onGetOrganizationProjects(
          getOrganizationProjectsWithUnreadMessagesQueryParams
        )
      ),
    [dispatch]
  );

  const onFetchPersonalProjectStructure = useCallback(
    () =>
      dispatch(
        PersonalProjectStructureModelActions.onFetchPersonalProjectStructure()
      ),
    [dispatch]
  );

  return {
    onFetchChatNotificationSettingsTypes,
    onFetchOrganizationProjects,
    onFetchPersonalProjectStructure,
  };
};
