import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as OrganizationsModelActions from 'models/domain/OrganizationsModel/actions';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import * as ProjectsActions from 'models/domain/ProjectsModel/actions';
import {
  fetchOrganizationProjectsRequestType,
  organizationDirectAndGroupChatQueryParams,
} from 'models/domain/ProjectsModel/requestQueryParams';
import { selectSortedConversationDescriptors } from 'models/domain/ProjectsModel/selectors';
import { ConversationDescriptorRecordInterface } from 'models/domain/ProjectsModel/types';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { getConversationSettings } from 'models/domain/RequestModel/constants/requestTypes';
import {
  selectIsRequestRepeatable,
  selectIsRequestNotFinishedInitially,
  selectRequestIsSuccess,
} from 'models/domain/RequestModel/selectors';

interface DataProviderHookInterface {
  conversationDescriptors: List<ConversationDescriptorRecordInterface>;
  currentOrganizationId: Id;
  isCurrentUserOrganizationGuest: boolean;
  isLoading: boolean;
  isTeamListRequestRepeatable: boolean;
  isConversationSettingsRequestRepeatable: boolean;
}

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector((state) => selectCurrentOrganizationId(state));

  return {
    isCurrentUserOrganizationGuest: useSelector((state) => selectIsCurrentUserOrganizationGuest(state)),
    conversationDescriptors: useSelector((state) =>
      selectSortedConversationDescriptors(state, {
        shouldIncludeInvisibleConversations: false,
      })
    ),
    currentOrganizationId,
    isLoading: useSelector(
      (state) =>
        selectIsRequestNotFinishedInitially(state, {
          requestType: fetchOrganizationProjectsRequestType,
          objectId: currentOrganizationId,
        }) ||
        !selectRequestIsSuccess(state, {
          requestType: RequestTypesConstants.getOrganizationPeople,
          objectId: currentOrganizationId,
        })
    ),
    isTeamListRequestRepeatable: useSelector((state) =>
      selectIsRequestRepeatable(state, {
        requestType: fetchOrganizationProjectsRequestType,
        objectId: currentOrganizationId,
      })
    ),
    isConversationSettingsRequestRepeatable: useSelector((state) =>
      selectIsRequestRepeatable(state, {
        requestType: getConversationSettings,
        objectId: currentOrganizationId,
      })
    ),
  };
};

interface DataPersisterHookInterface {
  onFetchTeamList: VoidFunction;
  onGetConversationSettings: VoidFunction;
  onResendInvitation: (userId: Id) => void;
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  const onFetchTeamList = useCallback(
    () => dispatch(ProjectsActions.onGetOrganizationProjects(organizationDirectAndGroupChatQueryParams)),
    [dispatch]
  );

  const onGetConversationSettings = useCallback(
    () => dispatch(ProjectsActions.onGetConversationSettings()),
    [dispatch]
  );

  const onResendInvitation = useCallback(
    (userId) => dispatch(OrganizationsModelActions.onResendInvitation(userId)),
    [dispatch]
  );

  return {
    onFetchTeamList,
    onGetConversationSettings,
    onResendInvitation,
  };
};
