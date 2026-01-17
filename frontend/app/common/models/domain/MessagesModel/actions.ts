import * as MessageConstants from './constants';
import { Map, List } from 'immutable';
import { Message, Reaction } from './models';

import { makeObjectKeyPressId, makeObjectReadId } from '../../../utils/generateLocalStorageId';
import {
  getMessageRecordFromRestApiResponse,
  getMessageCreationTimeFromRestApiResponse,
} from '../../../utils/fetchResultToRecord';
import { MessagePayload } from './types';

const emptyList = List();

export function newMessageUpdated(value, objectId, userId) {
  return {
    type: MessageConstants.newMessageUpdated,
    value,
    objectId,
    userId,
  };
}

export function messageAdded(message, id) {
  return {
    type: MessageConstants.messageAdded,
    message,
    id,
  };
}

export function onMessageBoundToObject(messageId, objectId) {
  return {
    type: MessageConstants.onMessageBoundToObject,
    messageId,
    objectId,
  };
}

export function onMessageSend(text, objectId, mentionedUserIds = [], hails = [], isLinkPreviewEnabled = true) {
  return {
    type: MessageConstants.onMessageSend,
    text,
    objectId,
    hails,
    mentionedUserIds,
    isLinkPreviewEnabled,
  };
}

export function onMessageResend({ messageId, objectId }: Partial<MessagePayload>) {
  return {
    type: MessageConstants.onMessageResend,
    messageId,
    objectId,
  };
}
export function onDeleteUndeliveredMessage({ messageId, objectId }: Partial<MessagePayload>) {
  return {
    type: MessageConstants.onDeleteUndeliveredMessage,
    messageId,
    objectId,
  };
}

export function onMessageSendSuccess(actionResult) {
  return {
    type: MessageConstants.onMessageSendSuccess,
    actionResult,
  };
}

export function onMessageSendFailure(actionResult) {
  return {
    type: MessageConstants.onMessageSendFailure,
    actionResult,
  };
}

export function messageUnboundFromObject(objectId, messageId) {
  return {
    type: MessageConstants.messageUnboundFromObject,
    objectId,
    messageId,
  };
}

export function onMessageDelete(objectId, messageId) {
  return {
    type: MessageConstants.onMessageDelete,
    objectId,
    messageId,
  };
}

export function setIsMessageBeingEdited(messageId, isBeingEdited) {
  return {
    type: MessageConstants.setIsMessageBeingEdited,
    messageId,
    isBeingEdited,
  };
}

export function onSetRespondedMessageId(messageId) {
  return {
    type: MessageConstants.onSetRespondedMessageId,
    messageId,
  };
}

export function onMessageDeleteSuccess(actionResult) {
  return {
    type: MessageConstants.onMessageDeleteSuccess,
    actionResult,
  };
}

export function onMessageDeleteFailure(actionResult) {
  return {
    type: MessageConstants.onMessageDeleteFailure,
    actionResult,
  };
}

export function onMessageEdit(messageId, newText) {
  return {
    type: MessageConstants.onMessageEdit,
    messageId,
    newText,
  };
}

export function onMessageEditSuccess(actionResult) {
  return {
    type: MessageConstants.onMessageEditSuccess,
    actionResult,
  };
}

export function onMessageEditFailure(actionResult) {
  return {
    type: MessageConstants.onMessageEditFailure,
    actionResult,
  };
}

export function onBatchMessagesData(messagesData, messagesCreatedAt) {
  let messages = Map();
  let objectMessages = Map();

  messagesData.forEach((message) => {
    messages = messages.set(message.id, new Message(message));
    objectMessages = objectMessages.updateIn([message.containerId], (list) =>
      list ? list.push(message.id) : List([message.id])
    );
  });

  return {
    type: MessageConstants.onBatchMessagesData,
    messages,
    objectMessages,
    messagesCreatedAt,
  };
}

export function onCreateMessageData(wrappedEntity) {
  const message = getMessageRecordFromRestApiResponse(wrappedEntity);
  const createdAt = getMessageCreationTimeFromRestApiResponse(wrappedEntity);

  return {
    type: MessageConstants.onCreateMessageData,
    objectId: wrappedEntity.optionalId,
    organizationId: wrappedEntity.body.organizationId,
    message,
    createdAt,
  };
}

export function onUpdateMessageData(wrappedEntity) {
  const message = getMessageRecordFromRestApiResponse(wrappedEntity);
  return {
    type: MessageConstants.onUpdateMessageData,
    message,
  };
}

export function onRemoveMessageData(wrappedEntity) {
  const { containerId, messageId } = wrappedEntity.body;
  return {
    type: MessageConstants.onRemoveMessageData,
    objectId: containerId,
    messageId,
  };
}

export function onFetchMessagesMetadata(containerId, containerType) {
  return {
    type: MessageConstants.onFetchMessagesMetadata,
    containerId,
    containerType,
  };
}

export function onSetMessageDeleteConfirmationVisibility(messageId, isVisible) {
  return {
    type: MessageConstants.onSetMessageDeleteConfirmationVisibility,
    messageId,
    isVisible,
  };
}

export function onUpdateNewMessageContent(newContent, objectId, ignoreDebounce = false) {
  return {
    type: MessageConstants.onUpdateNewMessageContent,
    newContent,
    objectId,
    ignoreDebounce,
  };
}

export function onRemovePersistentMessageContent(objectId) {
  return {
    type: MessageConstants.onRemovePersistentMessageContent,
    objectId,
  };
}

export function onRetrieveLocalStoredNewMessage(objectId) {
  return {
    type: MessageConstants.onRetrieveLocalStoredNewMessage,
    objectId,
  };
}

export function updateMessageNewText(messageId, nextMessageValue) {
  return {
    type: MessageConstants.updateMessageNewText,
    messageId,
    nextMessageValue,
  };
}

export function setIsMessagesListLoading(objectId, isLoading) {
  return {
    type: MessageConstants.setIsMessagesListLoading,
    objectId,
    isLoading,
  };
}

export function onMessageReactionAdd(messageId, emojiCode) {
  return {
    type: MessageConstants.onMessageReactionAdd,
    messageId,
    emojiCode,
  };
}

export function onMessageReactionAddSuccess(actionResult) {
  return {
    type: MessageConstants.onMessageReactionAddSuccess,
    actionResult,
  };
}

export function onMessageReactionAddFailure(actionResult) {
  return {
    type: MessageConstants.onMessageReactionAddFailure,
    actionResult,
  };
}

export function onUpdateMessageRead(objectId, messageId, objectType?) {
  return {
    type: MessageConstants.onUpdateMessageRead,
    objectId,
    messageId,
    objectType,
  };
}

export function onUpdateMessageReadSuccess(messageId, containerId, containerType, userId, messageUserId) {
  return {
    type: MessageConstants.onUpdateMessageReadSuccess,
    messageReadId: makeObjectReadId(containerId, userId),
    messageId,
    containerId,
    containerType,
    userId,
    messageUserId,
  };
}

export function onUpdateMessageReadData(wrappedEntity) {
  const { containerId, userId, messageId, containerType, timestamp, messageUserId } = wrappedEntity.body;
  return {
    type: MessageConstants.onUpdateMessageReadData,
    messageReadId: makeObjectReadId(containerId, userId),
    messageId,
    lastReadTime: timestamp,
    containerType,
    containerId,
    userId,
    messageUserId,
  };
}

export function onCreateMessageRead(containerId, userId, messageId) {
  return {
    type: MessageConstants.onCreateMessageRead,
    messageReadId: makeObjectReadId(containerId, userId),
    messageId,
  };
}

export function onBatchMessageReadData(objectMessageReadData) {
  return {
    type: MessageConstants.onBatchMessageReadData,
    objectMessageReadData,
  };
}

export function onUpdateMessageKeyPress(objectId, userId, timestamp) {
  return {
    type: MessageConstants.onUpdateMessageKeyPress,
    objectId,
    userId,
    timestamp,
  };
}

export function onUpdateMessageKeyPressSuccess(actionResult) {
  return {
    type: MessageConstants.onUpdateMessageKeyPressSuccess,
    actionResult,
  };
}

export function onCreateMessageKeyPressData(wrappedEntity) {
  const { containerId, userId, timestamp } = wrappedEntity.body;
  return {
    type: MessageConstants.onCreateMessageKeyPressData,
    id: makeObjectKeyPressId(containerId, userId),
    lastKeypressTime: timestamp,
  };
}

export function onUpdateMessageKeyPressData(wrappedEntity) {
  const { containerId, userId, timestamp } = wrappedEntity.body;
  return {
    type: MessageConstants.onUpdateMessageKeyPressData,
    id: makeObjectKeyPressId(containerId, userId),
    lastKeypressTime: timestamp,
  };
}

export function onBatchMessageKeyPressData(objectMessageKeyPressData) {
  return {
    type: MessageConstants.onBatchMessageKeyPressData,
    objectMessageKeyPressData,
  };
}

export function onCreateMessageReactionData(wrappedEntity) {
  return {
    type: MessageConstants.onCreateMessageReactionData,
    id: wrappedEntity.entityId,
    reaction: new Reaction(wrappedEntity.body),
  };
}

export function onUpdateMessageReactionData(wrappedEntity) {
  let reactions = emptyList;
  wrappedEntity.reactions.forEach((emojiCode) => {
    reactions = reactions.push(
      new Reaction({
        messageId: wrappedEntity.messageId,
        userId: wrappedEntity.userId,
        emojiCode,
      })
    );
  });
  return {
    type: MessageConstants.onUpdateMessageReactionData,
    id: wrappedEntity.entityId,
    reactions,
  };
}

export function onRemoveMessageReactionData(wrappedEntity) {
  const { id, messageId } = wrappedEntity.body;
  return {
    type: MessageConstants.onRemoveMessageReactionData,
    id,
    messageId,
  };
}

export function onBatchMessageReactionData(reactions) {
  let messagesReactions = Map();
  let reactionsData = Map();

  reactions.forEach((reaction) => {
    messagesReactions = messagesReactions.update(reaction.messageId, (list: Array<string | number>) =>
      list ? list.push(reaction.id) : List([reaction.id])
    );
    reactionsData = reactionsData.set(reaction.id, new Reaction(reaction));
  });

  return {
    type: MessageConstants.onBatchMessageReactionData,
    messagesReactions,
    reactionsData,
  };
}

export function onConvertMessageToTask(messageId, projectId) {
  return {
    type: MessageConstants.onConvertMessageToTask,
    messageId,
    projectId,
  };
}

export function onConvertConversationMessageToTask({ messageId, spaceId, listId, userId, cardName }) {
  return {
    type: MessageConstants.onConvertConversationMessageToTask,
    spaceId,
    listId,
    messageId,
    cardName,
    userId,
  };
}

export function onConvertMessageToCardComment(messageId, destinationCardId) {
  return {
    type: MessageConstants.onConvertMessageToCardComment,
    messageId,
    destinationCardId,
  };
}

export function onSetObjectTopVisibleItem(scrollHeight, objectId) {
  return {
    type: MessageConstants.onSetObjectTopVisibleItem,
    objectId,
    scrollHeight,
  };
}

export function onCreateMessageAttachmentsIds(messageId, messageAttachmentsIds, containerId) {
  return {
    type: MessageConstants.onCreateMessageAttachmentsIds,
    messageId,
    messageAttachmentsIds: List(messageAttachmentsIds),
    containerId: containerId,
  };
}

export function onBatchMessagesAttachmentsIds(attachments) {
  let messageAttachmentsIds = Map();
  attachments.forEach((attachment) => {
    messageAttachmentsIds = messageAttachmentsIds.set(attachment.messageId, List([attachment.fileId]));
  });
  return {
    type: MessageConstants.onBatchMessagesAttachmentsIds,
    messageAttachmentsIds,
  };
}

export function onCreateMessagesWithFiles(files, objectId) {
  return {
    type: MessageConstants.onCreateMessagesWithFiles,
    files,
    objectId,
  };
}

export function onAttachFile(fileId, messageId) {
  return {
    type: MessageConstants.onAttachFile,
    fileId,
    messageId,
  };
}

export function onCreateMessageAndAttachFile(fileId, messageId, objectId) {
  return {
    type: MessageConstants.onCreateMessageAndAttachFile,
    fileId,
    messageId,
    objectId,
  };
}

export function onFetchMessageBoard(containerId, limit, containerType, force) {
  return {
    type: MessageConstants.onFetchMessageBoard,
    containerId,
    limit,
    containerType,
    force,
  };
}

export function onFetchMessageBoardSuccess() {
  return {
    type: MessageConstants.onFetchMessageBoardSuccess,
  };
}

export function onFetchMessageBoardFailure() {
  return {
    type: MessageConstants.onFetchMessageBoardFailure,
  };
}

export function onMessageReactionRemove(messageId, reactionId) {
  return {
    type: MessageConstants.onMessageReactionRemove,
    messageId,
    reactionId,
  };
}

export function onMessageReactionRemoveSuccess(actionResult) {
  return {
    type: MessageConstants.onMessageReactionRemoveSuccess,
    actionResult,
  };
}

export function onMessageReactionRemoveFailure(actionResult) {
  return {
    type: MessageConstants.onMessageReactionRemoveFailure,
    actionResult,
  };
}

export function onFetchMessageBoardIfDidNotFetchAlready(containerId, limit, containerType, force) {
  return {
    type: MessageConstants.onFetchMessageBoardIfDidNotFetchAlready,
    containerId,
    limit,
    containerType,
    force,
  };
}

export function onDeleteLinkPreview(messageId) {
  return {
    type: MessageConstants.onDeleteLinkPreview,
    messageId,
  };
}

export function onDeleteLinkPreviewSuccess(messageId) {
  return {
    type: MessageConstants.onDeleteLinkPreviewSuccess,
    messageId,
  };
}

export function onDeleteLinkPreviewFailure(messageId) {
  return {
    type: MessageConstants.onDeleteLinkPreviewFailure,
    messageId,
  };
}

export function onBatchLatestActiveUserConversations(objectMessages, messagesCreatedAt) {
  return {
    type: MessageConstants.onBatchLatestActiveUserConversations,
    objectMessages,
    messagesCreatedAt,
  };
}
