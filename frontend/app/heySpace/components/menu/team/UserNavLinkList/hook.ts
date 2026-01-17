import { useCallback, useEffect, useState } from 'react';

import { List } from 'immutable';
import { useParams } from 'react-router';

import useLazyList from 'common/hooks/useLazyList';
import useRefreshData from 'common/hooks/useRefreshData';
import { onGetOrganizationProjects } from 'common/models/domain/ProjectsModel/actions';
import { Id } from 'common/utils/identifier';
import { organizationDirectAndGroupChatQueryParams as queryParams } from 'models/domain/ProjectsModel/requestQueryParams';

import usePrevious from '../../../../../common/hooks/usePrevious';
import { ConversationDescriptorRecordInterface } from '../../../../../common/models/domain/ProjectsModel/types';

import { useDataPersister, useDataProvider } from './dataHooks';

const refreshControllerOptions = {
  action: onGetOrganizationProjects,
  paramsToInject: [
    {
      key: 'params',
      defaultValue: queryParams,
    },
  ],
};
export interface UserNavLinkListHookInterface {
  conversationDescriptors: List<ConversationDescriptorRecordInterface>;
  selectedUserIdToResendInvitation: Id;
  shouldRenderChatLink: boolean;
  isLoading: boolean;
  getIsConversationSelected: (conversationId: Id) => boolean;
  onSetUserIdToResendInvitation: (userId: Id) => void;
  onCloseResendInvitationModal: VoidFunction;
  onResendInvitation: VoidFunction;
}

export default function useComponent(): UserNavLinkListHookInterface {
  useRefreshData({}, refreshControllerOptions);

  const {
    conversationDescriptors,
    currentOrganizationId,
    isCurrentUserOrganizationGuest,
    isLoading,
    isTeamListRequestRepeatable,
    isConversationSettingsRequestRepeatable,
  } = useDataProvider();
  const dataPersister = useDataPersister();

  const prevCurrentOrganizationId = usePrevious(currentOrganizationId);
  const [selectedUserIdToResendInvitation, onSetUserIdToResendInvitation] =
    useState(null);

  const { projectId: currentProjectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    if (prevCurrentOrganizationId !== currentOrganizationId) {
      if (isTeamListRequestRepeatable) {
        dataPersister.onFetchTeamList();
      }
      if (isConversationSettingsRequestRepeatable) {
        dataPersister.onGetConversationSettings();
      }
    }
  }, [
    currentOrganizationId,
    prevCurrentOrganizationId,
    isTeamListRequestRepeatable,
    isConversationSettingsRequestRepeatable,
  ]);

  const onCloseResendInvitationModal = useCallback(() => {
    onSetUserIdToResendInvitation(null);
  }, [onSetUserIdToResendInvitation]);

  const onResendInvitation = useCallback(() => {
    if (selectedUserIdToResendInvitation) {
      dataPersister.onResendInvitation(selectedUserIdToResendInvitation);
      onCloseResendInvitationModal();
    }
  }, [selectedUserIdToResendInvitation, onCloseResendInvitationModal]);

  const shouldRenderChatLink = !isCurrentUserOrganizationGuest && !isLoading;

  const getIsConversationSelected = useCallback(
    (conversationId: Id) => currentProjectId === conversationId,
    [currentProjectId]
  );

  const { slicedItemIds: dynamicConversationDescriptors } =
    useLazyList<ConversationDescriptorRecordInterface>(
      conversationDescriptors,
      currentOrganizationId,
      5
    );

  return {
    conversationDescriptors: dynamicConversationDescriptors,
    selectedUserIdToResendInvitation,
    shouldRenderChatLink,
    isLoading,
    getIsConversationSelected,
    onSetUserIdToResendInvitation,
    onCloseResendInvitationModal,
    onResendInvitation,
  };
}
