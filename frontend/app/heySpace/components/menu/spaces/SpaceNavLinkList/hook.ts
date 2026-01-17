import { useEffect, useCallback } from 'react';

import { List } from 'immutable';
import { useParams } from 'react-router';

import useLazyList from 'common/hooks/useLazyList';
import usePrevious from 'common/hooks/usePrevious';
import { Id } from 'common/utils/identifier';
import { getOrganizationProjectsWithUnreadMessagesQueryParams } from 'models/domain/ProjectsModel/requestQueryParams';

import useRefreshData from '../../../../../common/hooks/useRefreshData';
import * as ProjectsModelActions from '../../../../../common/models/domain/ProjectsModel/actions';

import { useDataPersister, useDataProvider } from './dataHooks';

export type SpaceNavLinkListHookInterface = {
  spaceList: List<Id>;
  isEmptySpacesVisible: boolean;
  isRequestFinished: boolean;
  isSelected: (spaceId: Id) => boolean;
};

const refreshControllerOptions = {
  action: ProjectsModelActions.onGetOrganizationProjects,
  paramsToInject: [
    {
      key: 'params',
      defaultValue: getOrganizationProjectsWithUnreadMessagesQueryParams,
    },
  ],
};

export default function useComponent(): SpaceNavLinkListHookInterface {
  useRefreshData({}, refreshControllerOptions);

  const {
    spaceList,
    currentOrganizationId,
    isRequestFinished,
    isNotificationSettingsRequestRepeatable,
    isOrganizationProjectsRequestRepeatable,
  } = useDataProvider();
  const { onFetchChatNotificationSettingsTypes, onFetchOrganizationProjects } =
    useDataPersister();

  const prevCurrentOrganizationId = usePrevious(currentOrganizationId);

  const isEmptySpacesVisible = spaceList.size === 0 && isRequestFinished;

  const { projectId: currentProjectId } = useParams<{ projectId: string }>();

  const isSelected = useCallback(
    (spaceId: Id) => spaceId === currentProjectId,
    [currentProjectId]
  );

  useEffect(() => {
    if (prevCurrentOrganizationId !== currentOrganizationId) {
      if (isNotificationSettingsRequestRepeatable) {
        onFetchChatNotificationSettingsTypes();
      }
      if (isOrganizationProjectsRequestRepeatable) {
        onFetchOrganizationProjects();
      }
    }
  }, [
    currentOrganizationId,
    prevCurrentOrganizationId,
    isNotificationSettingsRequestRepeatable,
    isOrganizationProjectsRequestRepeatable,
    onFetchOrganizationProjects,
    onFetchChatNotificationSettingsTypes,
  ]);

  const { slicedItemIds } = useLazyList<Id>(
    spaceList,
    currentOrganizationId,
    5
  );

  return {
    spaceList: slicedItemIds,
    isEmptySpacesVisible,
    isRequestFinished,
    isSelected,
  };
}
