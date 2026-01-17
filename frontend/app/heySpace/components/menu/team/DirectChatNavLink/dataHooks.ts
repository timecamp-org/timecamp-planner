import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectProjectUnreadMessagesCount } from 'models/domain/NotificationsModel/selectors';
import { selectIsUserActiveInCurrentOrganization } from 'models/domain/OrganizationsModel/selectors/domain';
import * as ProjectsModelActions from 'models/domain/ProjectsModel/actions';
import { selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors';
import { selectCurrentUserId, selectUserFullName, selectUserIsBot } from 'models/domain/UsersModel/selectors/domain';

import { DirectChatNavLinkInterface } from './index';

export type DataProviderHookInterface = {
  currentUserId: string;
  conversationUserId: string;
  isConversationWithBot: boolean;
  projectId: string;
  isUserActive: boolean;
  projectHasUnreadMessages: boolean;
  userName: string;
};

export const useDataProvider = (props: DirectChatNavLinkInterface): DataProviderHookInterface => {
  const currentUserId = useSelector((state) => selectCurrentUserId(state));
  const userId = getUserId(props.people, currentUserId);
  const projectId = useSelector((state) =>
    selectProjectIdByConversationId(state, { conversationId: props.conversationId })
  );

  const projectHasUnreadMessages = !!useSelector((state) => selectProjectUnreadMessagesCount(state, { projectId }));
  const userName = useSelector((state) => selectUserFullName(state, { userId }));

  return {
    currentUserId,
    conversationUserId: userId,
    isConversationWithBot: useSelector((state) => selectUserIsBot(state, { userId })),
    projectId,
    isUserActive: useSelector((state) => selectIsUserActiveInCurrentOrganization(state, { userId })),
    projectHasUnreadMessages,
    userName,
  };
};

export type DataPersisterHookInterface = {
  onHideConversation: VoidFunction;
  onCreateConversationIfDoesNotExist: (people: List<Id>) => void;
};

export const useDataPersister = (props: DirectChatNavLinkInterface): DataPersisterHookInterface => {
  const dispatch = useDispatch();

  return {
    onHideConversation: useCallback(
      () => dispatch(ProjectsModelActions.onSetIsConversationVisible(props.conversationId, false)),
      [props.conversationId, dispatch]
    ),
    onCreateConversationIfDoesNotExist: useCallback(
      (people: List<Id>) => dispatch(ProjectsModelActions.onCreateConversationIfDoesNotExist(people)),
      [dispatch]
    ),
  };
};

function getUserId(people: List<Id>, currentUserId: string): string {
  return people.size === 1 ? currentUserId : people.filter((userId) => userId !== currentUserId).first();
}
