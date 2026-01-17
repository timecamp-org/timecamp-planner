import { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { Id } from 'common/utils/identifier';
import * as MessagesModelActions from 'models/domain/MessagesModel/actions';
import { selectDoesMessageBelongToCurrentUser, selectPreviousMessageId } from 'models/domain/MessagesModel/selectors';
import {
  selectProjectIdByConversationId,
  selectProjectIsGroupOrDirectChat,
  selectProjectIsDirectChat,
  selectDirectChatPartner,
} from 'models/domain/ProjectsModel/selectors';

export type DataProviderHook = {
  isOwnMessage: boolean;
  isConversation: boolean;
  isDirectChat: boolean;
  directChatUserId: Id;
  previousMessageId: Id;
};

export function useDataProvider(messageId: Id, containerId: Id): DataProviderHook {
  const { projectId: objectId } = useParams<{ projectId: string }>();
  const projectId = useSelector((state) => selectProjectIdByConversationId(state, { conversationId: objectId }));
  const isOwnMessage = useSelector((state) =>
    // @ts-ignore
    selectDoesMessageBelongToCurrentUser(state, { messageId })
  );
  const isConversation = useSelector((state) => selectProjectIsGroupOrDirectChat(state, { projectId }));
  const isDirectChat = useSelector((state) => selectProjectIsDirectChat(state, { projectId }));
  const directChatUserId = useSelector((state) => selectDirectChatPartner(state, { conversationId: projectId }));
  const previousMessageId = useSelector((state) =>
    // @ts-ignore
    selectPreviousMessageId(state, { objectId: containerId, messageId })
  );

  return {
    isOwnMessage,
    isConversation,
    isDirectChat,
    directChatUserId,
    previousMessageId,
  };
}

export type DataPersisterHook = {
  onMessageEditClicked: VoidFunction;
  onSetRespondedMessageId: VoidFunction;
  onMessageDeleteClicked: VoidFunction;
  onSetMessageDeleteConfirmationVisibility: (isVisible: boolean) => void;
  onConvertMessageToTask: VoidFunction;
  onMessageReactionAdd: (reaction: string) => void;
  onUpdateMessageRead: (targetMessageId: Id) => void;
};

export function useDataPersister(messageId: Id, containerId: Id): DataPersisterHook {
  const dispatch = useDispatch();
  const { projectId: objectId } = useParams<{ projectId: string }>();

  return {
    onMessageEditClicked: useCallback(
      () => dispatch(MessagesModelActions.setIsMessageBeingEdited(messageId, true)),
      [dispatch, messageId]
    ),
    onSetRespondedMessageId: useCallback(
      () => dispatch(MessagesModelActions.onSetRespondedMessageId(messageId)),
      [dispatch, messageId]
    ),
    onMessageDeleteClicked: useCallback(
      () => dispatch(MessagesModelActions.onSetMessageDeleteConfirmationVisibility(messageId, true)),
      [dispatch, messageId]
    ),
    onSetMessageDeleteConfirmationVisibility: useCallback(
      (isVisible) => dispatch(MessagesModelActions.onSetMessageDeleteConfirmationVisibility(messageId, isVisible)),
      [dispatch, messageId]
    ),
    onConvertMessageToTask: useCallback(
      () => dispatch(MessagesModelActions.onConvertMessageToTask(messageId, objectId)),
      [dispatch, messageId, objectId]
    ),
    onMessageReactionAdd: useCallback(
      (reaction: string) => dispatch(MessagesModelActions.onMessageReactionAdd(messageId, reaction)),
      [dispatch, messageId]
    ),
    onUpdateMessageRead: useCallback(
      (targetMessageId: Id) => dispatch(MessagesModelActions.onUpdateMessageRead(containerId, targetMessageId)),
      [dispatch, containerId]
    ),
  };
}
