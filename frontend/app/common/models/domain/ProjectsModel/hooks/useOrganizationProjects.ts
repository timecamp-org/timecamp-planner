import { useEffect, useCallback } from 'react';
import { fetchChatNotificationSettingsTypes } from 'models/domain/RequestModel/constants/requestTypes';
import { selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors';
import {
  getOrganizationProjectsWithUnreadMessagesQueryParams,
  organizationProjectsWithUnreadMessagesRequestType,
} from 'models/domain/ProjectsModel/requestQueryParams';
import { useSelector, useDispatch } from 'react-redux';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

export function useOrganizationProjects() {
  const currentOrganizationId = useSelector(selectCurrentOrganizationId);
  const isOrganizationProjectsRequestRepeatable = useSelector((state) =>
    selectIsRequestRepeatable(state, {
      requestType: organizationProjectsWithUnreadMessagesRequestType,
      objectId: currentOrganizationId,
    })
  );
  const isNotificationSettingsRequestRepeatable = useSelector((state) =>
    selectIsRequestRepeatable(state, {
      requestType: fetchChatNotificationSettingsTypes,
      objectId: currentOrganizationId,
    })
  );
  const dispatch = useDispatch();

  const onFetchChatNotificationSettingsTypes = useCallback(
    () => dispatch(NotificationsModelActions.onFetchChatNotificationSettingsTypes()),
    [dispatch]
  );

  const onFetchOrganizationProjects = useCallback(
    () =>
      dispatch(ProjectsModelActions.onGetOrganizationProjects(getOrganizationProjectsWithUnreadMessagesQueryParams)),
    [dispatch]
  );

  useEffect(() => {
    if (isNotificationSettingsRequestRepeatable) {
      onFetchChatNotificationSettingsTypes();
    }
    if (isOrganizationProjectsRequestRepeatable) {
      onFetchOrganizationProjects();
    }
  }, [
    isNotificationSettingsRequestRepeatable,
    isOrganizationProjectsRequestRepeatable,
    onFetchOrganizationProjects,
    onFetchChatNotificationSettingsTypes,
  ]);
}
