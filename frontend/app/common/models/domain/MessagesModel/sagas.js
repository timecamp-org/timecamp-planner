import { put, call, cps, select, takeEvery, takeLatest, all, delay } from 'redux-saga/effects';
import { List, Map } from 'immutable';
import { HeySpaceClient as client, UserTracker, localStorage } from '../../../services';
import makeActionResult from '../../../utils/makeActionResult';
import { parseMessageText, appendReplyToMessage, createMarkdownLink, createUserQuote, isEmptyMessage } from './utils';
import handleError from '../../../utils/handleError';
import { epochNow } from '../../../utils/epoch';
import { makeObjectReadId, makeObjectKeyPressId } from '../../../utils/generateLocalStorageId';
import { MentionType } from './types';
import { RequestStatus } from '../RequestModel/types';

import generatePushId from '../../../utils/generate-pushid';
import { extractMentionAndHailsFromMessageNode, extractTextFromOperation } from './utils';
import makeNewMessageId from './makeNewMessageId';
import { Message, Reaction } from './models';
import * as MessagesModelConstants from './constants';
import * as MessagesModelActions from './actions';
import * as FilesModelActions from '../FilesModel/actions';
import * as MessagesModelSelectors from './selectors';
import * as MessagesModelDomainSelectors from './selectors/domain';
import { onSetPageLastNext } from '../PaginationModel/actions';
import { selectCurrentUserId, selectUserNickname } from '../UsersModel/selectors/domain';
import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import { ProjectType } from '../ProjectsModel/types';
import * as ProjectSelectors from '../ProjectsModel/selectors';
import * as ProjectsModelActions from '../ProjectsModel/actions';
import { TaskPeopleRole } from '../TasksModel/types';
import * as ActivitiesModelActions from '../ActivitiesModel/actions';
import * as TasksModelSelectors from '../TasksModel/selectors';
import * as TasksModelActions from '../TasksModel/actions';
import * as TasksModelSagas from '../TasksModel/sagas';
import * as ListsModelSagas from '../ListsModel/sagas';
import * as FilesModelSagas from '../FilesModel/sagas';
import * as EntityModelSelectors from '../EntityModel/selectors';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import * as RequestStatusSelectors from '../RequestModel/selectors';
import { onFetchListTasksData } from '../RequestModel/sagas';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import { selectEntityContainedRequestPageLastNext } from '../PaginationModel/selectors';
import { onOpenAddUsersToProjectModal } from '../../component/AddUsersToProjectModalModel/actions';
import { batchActions } from 'redux-batched-actions';

import { EntityType } from '../EntityModel/types';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

import MarkdownRenderer from './MarkdownRenderer';
import { selectProjectPeople } from '../ProjectsModel/selectors/domain';
import { selectFileUrl, selectFileName } from '../FilesModel/selectors';

const markdownRenderer = new MarkdownRenderer();

const emptyList = new List();
const emptyMap = new Map();

export function* watchMessages() {
  /* eslint-disable */
  yield all([
    takeLatest(MessagesModelConstants.onUpdateNewMessageContent, onUpdateNewMessageContent),
    takeEvery(MessagesModelConstants.onRetrieveLocalStoredNewMessage, onRetrieveLocalStoredNewMessage),
    takeEvery(MessagesModelConstants.onMessageSend, onMessageSend),
    takeEvery(MessagesModelConstants.onMessageResend, onMessageResend),
    takeEvery(MessagesModelConstants.onMessageDelete, onMessageDelete),
    takeEvery(MessagesModelConstants.onDeleteUndeliveredMessage, onDeleteUndeliveredMessage),
    takeEvery(MessagesModelConstants.onFetchMessagesMetadata, onFetchMessagesMetadata),
    takeEvery(MessagesModelConstants.onMessageEdit, onMessageEdit),
    takeLatest(MessagesModelConstants.onUpdateMessageRead, onUpdateMessageRead),
    takeLatest(MessagesModelConstants.onUpdateMessageKeyPress, onUpdateMessageKeyPress),
    takeLatest(MessagesModelConstants.onMessageReactionAdd, onMessageReactionAdd),
    takeEvery(MessagesModelConstants.onConvertMessageToTask, onConvertMessageToTask),
    takeEvery(MessagesModelConstants.onConvertConversationMessageToTask, onConvertConversationMessageToTask),
    takeEvery(MessagesModelConstants.onConvertMessageToCardComment, onConvertMessageToCardComment),
    takeEvery(MessagesModelConstants.onCreateMessagesWithFiles, onCreateMessagesWithFiles),
    takeEvery(MessagesModelConstants.onCreateMessageAndAttachFile, onCreateMessageAndAttachFile),
    takeEvery(MessagesModelConstants.onFetchMessageBoard, onFetchMessageBoard),
    takeEvery(MessagesModelConstants.onMessageReactionRemove, onMessageReactionRemove),
    takeEvery(MessagesModelConstants.onFetchMessageBoardIfDidNotFetchAlready, onFetchMessageBoardIfDidNotFetchAlready),
    takeEvery(MessagesModelConstants.onDeleteLinkPreview, onDeleteLinkPreview),
    takeEvery(MessagesModelConstants.onRemovePersistentMessageContent, onRemovePersistentMessageContent),
    takeEvery(MessagesModelConstants.onUpdateMessageReadData, onUpdateMessageReadData),
  ]);
  /* eslint-enable */
}

// takeLatest is not the best solution here, think of sth different
export function* onUpdateNewMessageContent({ objectId, newContent, ignoreDebounce = false }) {
  try {
    if (ignoreDebounce) {
      // ok
    } else {
      yield delay(2000);
    }

    const isEmptyContent = isEmptyMessage(newContent);

    if (isEmptyContent) {
      return yield onRemovePersistentMessageContent({ objectId });
    }

    yield cps(localStorage.setItem, makeNewMessageId(objectId), JSON.stringify(newContent));
  } catch (error) {
    handleError(error, { objectId, newContent });
  }
}

export function* onRetrieveLocalStoredNewMessage(action) {
  try {
    const storedNewMessageContentDoc = JSON.parse(yield cps(localStorage.getItem, makeNewMessageId(action.objectId)));

    if (storedNewMessageContentDoc && storedNewMessageContentDoc.ops) {
      yield put(
        MessagesModelActions.onUpdateNewMessageContent({ ops: storedNewMessageContentDoc.ops }, action.objectId)
      );
    }
  } catch (error) {
    handleError(error, action);
  }
}

export function* onRemovePersistentMessageContent({ objectId }) {
  try {
    yield cps(localStorage.removeItem, makeNewMessageId(objectId));
  } catch (error) {
    handleError(error);
  }
}
export function* onMessageResend({ messageId, objectId, hails = [], mentionedUserIds = [], isLinkPreviewEnabled }) {
  const message = yield select(MessagesModelDomainSelectors.selectMessage, { messageId });
  const text = message.text;
  const objectType = yield select(EntityModelSelectors.selectContainerType, { entityId: objectId });
  const organizationId = yield select(selectCurrentOrganizationId);
  const userId = yield select(selectCurrentUserId);

  try {
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.LOADING));

    yield cps(client.restApiClient.sendMessage, messageId, {
      containerId: objectId,
      organizationId,
      containerType: objectType,
      content: text,
      mentionedUserIds,
      hails,
      isLinkPreviewEnabled,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.SUCCESS));
    yield call(doOperationsAfterSendingMessage, {
      objectId,
      messageId,
      mentionedUserIds,
      userId,
    });
  } catch (error) {
    handleError(error, { messageId, text, objectId });
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.FAILURE, error));
  }
}
export function* onMessageSend({ text, objectId, hails, mentionedUserIds, isLinkPreviewEnabled }) {
  const messageId = generatePushId();
  const objectType = yield select(EntityModelSelectors.selectContainerType, { entityId: objectId });
  const organizationId = yield select(selectCurrentOrganizationId);
  const userId = yield select(selectCurrentUserId);
  let formattedMessageText = '';
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.LOADING));

    /* TODO: THIS IS QUILL CASE THAT NEEDS TO BE REMOVED
     * For now mobile sends pure text message to backend, which adds hails and mentionedUserIds himself
     * Web client parses Quill message and extracts hails and mentionedUserIds.
     * This whole logic should be deleted ASAP, when we leave Quill.
     * Adding mentionedUserIds and hails should be in separate saga/reducer
     */
    if (typeof text !== 'string') {
      const result = yield call(doQuillMentionOperations, text, objectId, objectType);
      formattedMessageText = result.formattedMessageText; // eslint-disable-line
      hails = uniq(result.hails);
      mentionedUserIds = uniq(result.mentionedUserIds);
    }

    formattedMessageText = formattedMessageText || text;

    formattedMessageText = yield call(decorateMessageContent, formattedMessageText, objectId);
    const { message, createdAt } = yield call(
      createNewMessageRecord,
      messageId,
      formattedMessageText,
      objectId,
      isLinkPreviewEnabled
    );

    yield put(
      MessagesModelActions.onMessageSendSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMessageSendSuccess',
          data: { messageId, message, objectId, createdAt },
        })
      )
    );

    yield cps(client.restApiClient.sendMessage, messageId, {
      containerId: objectId,
      organizationId,
      containerType: objectType,
      content: formattedMessageText,
      mentionedUserIds,
      hails,
      isLinkPreviewEnabled,
    });

    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.SUCCESS));

    yield call(doOperationsAfterSendingMessage, {
      objectId,
      messageId,
      mentionedUserIds,
      userId,
    });
  } catch (error) {
    handleError(error, { messageId, text, objectId });
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.FAILURE, error));
  }
}

function* decorateMessageContent(text, objectId) {
  let formattedMessageText = text;

  const respondedMessageId = yield select(MessagesModelSelectors.selectRespondedMessageIdForObject, { objectId });
  if (respondedMessageId) {
    let messageContent = yield select(MessagesModelDomainSelectors.selectMessageText, {
      messageId: respondedMessageId,
    });
    const senderId = yield select(MessagesModelDomainSelectors.selectMessageUser, { messageId: respondedMessageId });
    const attachmentId = yield select(MessagesModelSelectors.selectMessageFirstAttachmentId, {
      messageId: respondedMessageId,
    });
    if (attachmentId) {
      const attachmentUrl = yield select(selectFileUrl, { fileId: attachmentId });
      const attachmentName = yield select(selectFileName, { fileId: attachmentId });
      messageContent = createMarkdownLink(attachmentUrl, attachmentName);
    }

    formattedMessageText = appendReplyToMessage(text, messageContent, senderId);
    yield put(MessagesModelActions.onSetRespondedMessageId(null));
  }

  return yield formattedMessageText;
}

function* createNewMessageRecord(messageId, text, objectId, isLinkPreviewEnabled) {
  const objectType = yield select(EntityModelSelectors.selectContainerType, { entityId: objectId });
  const userId = yield select(selectCurrentUserId);
  const createdAt = epochNow();
  const message = new Message({
    id: messageId,
    userId,
    text,
    containerId: objectId,
    containerType: objectType,
    isLinkPreviewEnabled,
  });

  return {
    createdAt,
    message,
  };
}

function* doQuillMentionOperations(text, objectId, objectType) {
  // Without try/catch throw in parent saga
  let formattedMessageText = '';
  let hails = [];
  const mentionedUserIds = [];

  text.ops.forEach((operation) => {
    // convert ops to slack-like format
    formattedMessageText = `${formattedMessageText}${extractTextFromOperation(operation)}`;
  });

  const syntaxTree = markdownRenderer.getAST(formattedMessageText);
  syntaxTree.forEach((node) => extractMentionAndHailsFromMessageNode(node, mentionedUserIds, hails));

  hails = uniq(hails.map((hail) => (hail === MentionType.CHANNEL ? MentionType.SPACE : hail)));

  const projectId =
    objectType === EntityType.PROJECT_DATA
      ? objectId
      : yield select(TasksModelSelectors.selectProjectIdByTaskId, { taskId: objectId });
  const isConversation = yield select(ProjectSelectors.selectProjectIsGroupOrDirectChat, { projectId });
  if (!isConversation) {
    const projectPeople = yield select(selectProjectPeople, { projectId });
    const mentionedUsersNotInProjectPeople = mentionedUserIds.filter((userId) => !projectPeople.contains(userId));
    if (mentionedUsersNotInProjectPeople.length > 0) {
      yield put(onOpenAddUsersToProjectModal(projectId, new List(mentionedUsersNotInProjectPeople)));
    }
  }

  return {
    formattedMessageText,
    mentionedUserIds,
    hails,
  };
}

/*
 * - reads just sent message
 * - if message from task, add sender to follower
 * - tracking
 */
function* doOperationsAfterSendingMessage({ objectId, messageId, mentionedUserIds, userId }) {
  yield put(MessagesModelActions.onUpdateMessageRead(objectId, messageId));

  const containerType = yield select(EntityModelSelectors.selectEntityType, { entityId: objectId });

  if (containerType === EntityType.TASK_DATA) {
    const isUserTaskFollower = yield select(TasksModelSelectors.selectIsUserTaskFollower, { userId, taskId: objectId });
    if (!isUserTaskFollower) {
      yield put(TasksModelActions.onAddUserToTaskFollowers(objectId, userId));
    }
  }

  if (mentionedUserIds.length > 0) {
    UserTracker.track(UserTrackerEvent.memberMentioned, {
      where: containerType === EntityType.TASK_DATA ? 'task' : 'chat',
    });
  }

  UserTracker.track(UserTrackerEvent.messageSend, {
    place: yield call(getMessagePlace, containerType, objectId),
    type: 'text',
  });
}

function* getMessagePlace(containerType, containerId) {
  if (containerType === EntityType.TASK_DATA) {
    return 'task';
  } else {
    const projectType = yield select(ProjectSelectors.selectProjectType, { projectId: containerId });
    switch (projectType) {
      case ProjectType.PROJECT:
        return 'project';
      case ProjectType.DIRECT_CHAT:
        return 'direct message';
      case ProjectType.GROUP_CHAT:
        return 'group';
      default:
        return 'project';
    }
  }
}
export function* onDeleteUndeliveredMessage({ messageId, objectId }) {
  try {
    yield put(MessagesModelActions.messageUnboundFromObject(objectId, messageId));
    yield put(
      MessagesModelActions.onMessageDeleteSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMessageDeleteSuccess',
          data: { objectId, messageId },
        })
      )
    );
  } catch (error) {
    handleError(error, { messageId });
  }
}
export function* onMessageDelete({ messageId }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeMessage, messageId, RequestStatus.LOADING));
    const objectId = yield select(MessagesModelDomainSelectors.selectMessageContainerId, { messageId });
    const messageAttachmentsIds = yield select(MessagesModelSelectors.selectMessageAttachmentsIds, { messageId });
    const containerType = yield select(EntityModelSelectors.selectEntityType, { entityId: objectId });

    yield put(MessagesModelActions.messageUnboundFromObject(objectId, messageId));
    yield put(
      MessagesModelActions.onMessageDeleteSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMessageDeleteSuccess',
          data: { objectId, messageId },
        })
      )
    );

    yield cps(client.restApiClient.removeMessage, messageId);

    for (let i = 0; i < messageAttachmentsIds.size; i++) {
      if (containerType === EntityType.TASK) {
        yield call(TasksModelSagas.onDeleteTaskAttachment, {
          payload: {
            fileId: messageAttachmentsIds.get(i),
            taskId: objectId,
          },
        });
      } else {
        yield call(FilesModelSagas.onDeleteFile, { payload: { id: messageAttachmentsIds.get(i) } });
      }
    }
    yield put(onSetRequestStatus(RequestTypesConstants.removeMessage, messageId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { messageId });
    yield put(onSetRequestStatus(RequestTypesConstants.removeMessage, messageId, RequestStatus.FAILURE, error));
    yield put(
      MessagesModelActions.onMessageDeleteFailure(
        makeActionResult({
          isOk: false,
          code: 'onMessageDeleteFailure',
          data: { messageId },
        })
      )
    );
  }
}

export function* onMessageEdit({ messageId, newText }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessage, messageId, RequestStatus.LOADING));
    const currentUserId = yield select(selectCurrentUserId);
    const message = yield select(MessagesModelDomainSelectors.selectMessage, { messageId });

    let formattedMessageText = '';
    newText.ops.forEach((operation) => {
      // convert ops to slack-like format
      formattedMessageText = `${formattedMessageText}${extractTextFromOperation(operation)}`;
    });

    const newMessage = message.merge({
      text: formattedMessageText,
      editorId: currentUserId,
      editTime: epochNow(),
      isBeingEdited: false,
    });

    yield put(
      MessagesModelActions.onMessageEditSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMessageEditSuccess',
          data: { messageId, message: newMessage },
        })
      )
    );

    yield cps(client.restApiClient.updateMessage, messageId, {
      content: formattedMessageText,
      editorId: currentUserId,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessage, messageId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessage, messageId, RequestStatus.FAILURE, error));
    yield put(
      MessagesModelActions.onMessageEditFailure(
        makeActionResult({
          isOk: false,
          code: 'onMessageEditFailure',
          error,
        })
      )
    );
  }
}

export function* onUpdateMessageRead({ objectId, messageId, objectType }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessageRead, messageId, RequestStatus.LOADING));

    if (!objectType) {
      objectType = yield select(EntityModelSelectors.selectContainerType, { entityId: objectId });
    }

    const userId = yield select(selectCurrentUserId);
    const messageUserId = yield select(MessagesModelDomainSelectors.selectMessageUser, { messageId });
    yield put(MessagesModelActions.onUpdateMessageReadSuccess(messageId, objectId, objectType, userId, messageUserId));

    yield cps(client.restApiClient.updateMessageRead, objectType, objectId, messageId);
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessageRead, messageId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessageRead, messageId, RequestStatus.FAILURE, error));
  }
}

export function* onUpdateMessageKeyPress({ objectId, timestamp }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessageKeyPress, objectId, RequestStatus.LOADING));
    const containerType = yield select(EntityModelSelectors.selectContainerType, { entityId: objectId });

    yield cps(client.restApiClient.updateMessageKeyPress, containerType, objectId, timestamp);

    yield put(
      MessagesModelActions.onUpdateMessageKeyPressSuccess(
        makeActionResult({
          isOk: true,
          code: 'onUpdateMessageKeyPressSuccess',
          data: {
            objectId,
            timestamp,
          },
        })
      )
    );
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessageKeyPress, objectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.updateMessageKeyPress, objectId, RequestStatus.FAILURE, error));
  }
}

export function* onMessageReactionAdd({ messageId, emojiCode }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addMessageReaction, messageId, RequestStatus.LOADING));
    const currentUserId = yield select(selectCurrentUserId);
    const reactionId = generatePushId('reaction');

    const userMessageReactions = yield select(MessagesModelDomainSelectors.selectUserMessageReactions, {
      messageId,
      userId: currentUserId,
    });

    const existingReaction = userMessageReactions.indexOf(emojiCode) !== -1;
    if (existingReaction) {
      const emojiCodes = yield select(MessagesModelDomainSelectors.selectUserMessageReactionIds, {
        messageId,
        userId: currentUserId,
      });

      yield put(MessagesModelActions.onMessageReactionRemove(messageId, emojiCodes.get(emojiCode)));
    } else {
      const reactionRecord = new Reaction({
        userId: currentUserId,
        messageId,
        emojiCode,
      });

      yield put(
        MessagesModelActions.onMessageReactionAddSuccess(
          makeActionResult({
            isOk: true,
            code: 'onMessageReactionAddSuccess',
            data: {
              messageId,
              reactionId,
              reactionRecord,
            },
          })
        )
      );

      yield cps(client.restApiClient.addMessageReaction, messageId, currentUserId, reactionId, emojiCode);
    }
    yield put(onSetRequestStatus(RequestTypesConstants.addMessageReaction, messageId, RequestStatus.SUCCESS));

    const containerId = yield select(MessagesModelDomainSelectors.selectMessageContainerId, { messageId });
    const containerType = yield select(EntityModelSelectors.selectContainerType, { entityId: containerId });
    UserTracker.track(UserTrackerEvent.messageSend, {
      place: yield call(getMessagePlace, containerType, containerId),
      type: 'reaction',
    });
  } catch (error) {
    handleError(error, { messageId, emojiCode });
    yield put(
      MessagesModelActions.onMessageReactionAddFailure(
        makeActionResult({
          isOk: false,
          code: 'onMessageReactionAddFailure',
          error,
        })
      )
    );
    yield put(onSetRequestStatus(RequestTypesConstants.addMessageReaction, messageId, RequestStatus.FAILURE, error));
  }
}

export function* onMessageReactionRemove({ messageId, reactionId }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeMessageReaction, messageId, RequestStatus.LOADING));
    yield put(
      MessagesModelActions.onMessageReactionRemoveSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMessageReactionRemoveSuccess',
          data: {
            messageId,
            reactionId,
          },
        })
      )
    );

    yield cps(client.restApiClient.removeMessageReaction, messageId, reactionId);
    yield put(onSetRequestStatus(RequestTypesConstants.removeMessageReaction, messageId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(
      MessagesModelActions.onMessageReactionRemoveFailure(
        makeActionResult({
          isOk: false,
          code: 'onMessageReactionRemoveFailure',
          error,
        })
      )
    );
    yield put(onSetRequestStatus(RequestTypesConstants.removeMessageReaction, messageId, RequestStatus.FAILURE, error));
  }
}

export function* onConvertMessageToTask({ messageId, projectId }) {
  try {
    let firstLabelId = yield select(TasksModelSelectors.selectFirstTaskIdInProject, { projectId });
    const messageContent = yield select(MessagesModelDomainSelectors.selectMessage, { messageId });

    let messageText = yield messageContent.text.ops.map((operation) => {
      if (operation.insert && typeof operation.insert === 'string') {
        return operation.insert;
      } else if (operation.insert && operation.insert.mention) {
        const { userId } = operation.insert.mention;
        return select(selectUserNickname, { userId });
      } else {
        return '';
      }
    });

    messageText = messageText.join('').replace(/  +/g, ' ');

    if (!firstLabelId) {
      firstLabelId = generatePushId('task');
      yield call(ListsModelSagas.onCreateList, {
        payload: {
          id: firstLabelId,
          name: 'New list',
          projectId,
        },
      });
    }

    yield put(
      TasksModelActions.onTaskCreate(
        {
          id: generatePushId(),
          name: messageText,
          projectId,
          sourceMessageId: messageId,
        },
        firstLabelId,
        true
      )
    );
  } catch (error) {
    handleError(error);
  }
}

export function* onConvertConversationMessageToTask({ messageId, spaceId, listId, userId, cardName }) {
  try {
    const currentUserId = yield select(selectCurrentUserId);
    let destinationSpaceId = spaceId;
    let destinationListId = listId;

    if (!spaceId) {
      destinationSpaceId = generatePushId();
      let spacePeople = new List().push(currentUserId);
      if (userId) {
        spacePeople = spacePeople.push(userId);
      }
      yield put(
        ProjectsModelActions.onProjectCreate(
          {
            id: destinationSpaceId,
            name: 'New project',
          },
          spacePeople
        )
      );
    }

    if (!listId) {
      destinationListId = generatePushId();
      yield call(ListsModelSagas.onCreateList, {
        payload: {
          id: destinationListId,
          name: 'New list',
          projectId: destinationSpaceId,
        },
      });
    } else {
      yield call(onFetchListTasksData, { payload: { listId } });
    }

    let taskPeople = emptyMap;
    let taskFollowerIds = emptyList.push(currentUserId);
    if (userId) {
      taskPeople = taskPeople.set(userId, TaskPeopleRole.ASSIGNEE);
      if (!taskFollowerIds.includes(userId)) {
        taskFollowerIds = taskFollowerIds.push(userId);
      }
    }

    const taskId = generatePushId();

    const taskFields = {
      id: taskId,
      name: cardName,
      projectId: destinationSpaceId,
      sourceMessageId: messageId,
      people: taskPeople,
      assigneeIds: userId ? new List([userId]) : new List(),
    };

    yield call(TasksModelSagas.onTaskCreate, {
      payload: {
        taskFields,
        destinationTaskId: null,
        createBelowDestination: false,
        createAtTheEnd: false,
        createAtTheBeginning: true,
        listId: listId || destinationListId,
        taskPeople: taskPeople,
        taskFollowerIds: taskFollowerIds,
      },
    });

    const attachmentIds = yield select(MessagesModelSelectors.selectMessageAttachmentsIds, { messageId });
    for (let i = 0; i < attachmentIds.size; i++) {
      yield put(TasksModelActions.onAddFileToTaskAttachments(attachmentIds.get(i), taskId));
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onConvertMessageToCardComment({ messageId, destinationCardId }) {
  try {
    const messageOriginalText = yield select(MessagesModelSelectors.selectParsedMessageText, { messageId });
    const attachmentIds = yield select(MessagesModelSelectors.selectMessageAttachmentsIds, { messageId });
    const senderId = yield select(MessagesModelDomainSelectors.selectMessageUser, { messageId });

    if (attachmentIds.isEmpty()) {
      const messageText = createUserQuote(senderId, messageOriginalText);
      yield call(onMessageSend, {
        text: messageText,
        objectId: destinationCardId,
        hails: [],
        mentionedUserIds: [],
      });
    } else {
      const messageText = createUserQuote(senderId);
      yield call(onMessageSend, {
        text: messageText,
        objectId: destinationCardId,
        hails: [],
        mentionedUserIds: [],
      });
      for (let i = 0; i < attachmentIds.size; i++) {
        yield call(onCreateMessageAndAttachFile, {
          fileId: attachmentIds.get(i),
          messageId: generatePushId(),
          objectId: destinationCardId,
        });
      }
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onCreateMessagesWithFiles({ files, objectId }) {
  for (let i = 0; i < files.length; i++) {
    const messageId = generatePushId('message');
    yield put(
      FilesModelActions.onQueueFilesAndStartUploading(
        [files[i]],
        messageId,
        objectId,
        MessagesModelActions.onCreateMessageAndAttachFile
      )
    );
  }
}

export function* onCreateMessageAndAttachFile({ fileId, messageId, objectId }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.LOADING));
    const containerType = yield select(EntityModelSelectors.selectContainerType, { entityId: objectId });
    const userId = yield select(selectCurrentUserId);
    const createdAt = epochNow();
    const message = new Message({
      id: messageId,
      userId,
      containerId: objectId,
      containerType,
    });
    yield put(MessagesModelActions.onAttachFile(fileId, messageId));
    if (containerType === EntityType.PROJECT_DATA) {
      yield put(ProjectsModelActions.onAddFileIdToProjectFileIds(fileId, objectId));
    } else {
      yield put(TasksModelActions.onAddFileIdToTaskFileIds(fileId, objectId));
    }
    yield put(
      MessagesModelActions.onMessageSendSuccess(
        makeActionResult({
          isOk: true,
          code: 'onMessageSendSuccess',
          data: { messageId, message, objectId, createdAt },
        })
      )
    );
    const restMessage = {
      id: messageId,
      senderId: userId,
      containerType,
      containerId: objectId,
      attachments: [fileId],
    };
    yield cps(client.restApiClient.sendMessage, messageId, restMessage);
    if (containerType !== 'project') {
      yield call(TasksModelSagas.onAddFileToTaskAttachments, { payload: { fileId, taskId: objectId } });
    } else {
      // ok
    }
    yield put(MessagesModelActions.onUpdateMessageRead(objectId, messageId));
    UserTracker.track(UserTrackerEvent.messageSend, {
      place: yield call(getMessagePlace, containerType, objectId),
      type: 'attachment',
    });
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { messageId, objectId });
    yield put(onSetRequestStatus(RequestTypesConstants.sendMessage, messageId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchMessageBoardIfDidNotFetchAlready({ containerId, limit = 20, containerType, force }) {
  try {
    const projectId =
      containerType === EntityType.TASK_DATA
        ? yield select(TasksModelSelectors.selectProjectIdByTaskId, { taskId: containerId })
        : containerId;

    const isRepeatable = yield select(RequestStatusSelectors.selectIsEntityContainedRequestRepeatable, {
      objectId: containerId,
      containerId: projectId,
      requestType: RequestTypesConstants.initiallyFetchChatItems,
      containerType: EntityType.PROJECT_DATA,
    });

    if (isRepeatable || force) {
      yield call(onFetchMessageBoard, {
        containerId,
        limit,
        containerType,
        requestStatusType: RequestTypesConstants.initiallyFetchChatItems,
        force,
      });
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onDeleteLinkPreview({ messageId }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteLinkPreview, messageId, RequestStatus.LOADING));
    yield put(MessagesModelActions.onDeleteLinkPreviewSuccess(messageId));

    yield cps(client.restApiClient.updateMessage, messageId, {
      isLinkPreviewEnabled: false,
    });

    yield put(onSetRequestStatus(RequestTypesConstants.deleteLinkPreview, messageId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteLinkPreview, messageId, RequestStatus.FAILURE, error));
    yield put(MessagesModelActions.onDeleteLinkPreviewFailure(messageId));
    handleError(error);
  }
}

export function* onFetchMessageBoard({
  containerId,
  limit = 20,
  containerType,
  requestStatusType = RequestTypesConstants.fetchMoreChatItems,
  force,
}) {
  try {
    const projectId =
      containerType === EntityType.TASK_DATA
        ? yield select(TasksModelSelectors.selectProjectIdByTaskId, { taskId: containerId })
        : containerId;

    const page = yield select(selectEntityContainedRequestPageLastNext, {
      objectId: containerId,
      requestType: RequestTypesConstants.getMessageBoard,
      containerId: projectId,
      containerType: EntityType.PROJECT_DATA,
    });
    // fetch only if has more to load
    if (page !== null || force) {
      yield put(onSetRequestStatus(requestStatusType, containerId, RequestStatus.LOADING));
      let result;
      if (!containerType) {
        containerType = yield select(EntityModelSelectors.selectContainerType, { entityId: containerId });
        if (!containerType) {
          throw new Error(`Entity type for containerId: ${containerId} not set`);
        }
      }

      const fetchAllUnreadMessages = page === undefined || force ? true : false;
      if (containerType === EntityType.PROJECT_DATA) {
        result = yield cps(
          client.restApiClient.getProjectMessageBoard,
          containerId,
          page,
          limit,
          fetchAllUnreadMessages
        );
      } else if (containerType === EntityType.TASK_DATA) {
        result = yield cps(client.restApiClient.getTaskMessageBoard, containerId, page, limit, fetchAllUnreadMessages);
      }
      let messages = emptyList;
      let messagesCreatedAt = emptyMap;
      let activities = emptyList;
      let activitiesChangedProps = emptyList;
      let reactions = emptyList;
      let files = emptyList;
      let attachments = emptyList;
      let taskSourceDataByMessageIds = emptyMap;

      const actionsBatch = [];

      if (result.messages) {
        result.messages.forEach((message) => {
          const { senderId, createdAt, editedAt, content, ...data } = message;
          if (senderId) {
            messages = messages.push({
              ...data,
              userId: senderId,
              editTime: editedAt,
              text: parseMessageText(content),
              containerId,
            });

            messagesCreatedAt = messagesCreatedAt.set(message.id, createdAt);
          }
        });
      }

      if (result.activities) {
        activities = new List(result.activities);
        activities = activities.map((activity) => {
          activity.containerId = containerId;
          activity.containerType = containerType;
          return activity;
        });
      }

      if (result.changedProps) {
        activitiesChangedProps = new List(result.changedProps);
      }

      if (result.reactions) {
        reactions = new List(result.reactions);
      }

      if (result.files) {
        files = new List(result.files);
      }

      if (result.attachments) {
        attachments = new List(result.attachments);
      }

      if (result.taskSourceDataByMessageIds) {
        taskSourceDataByMessageIds = new Map(result.taskSourceDataByMessageIds);
      }

      if (result.lastRead) {
        const { userId, messageId } = result.lastRead;
        actionsBatch.push(MessagesModelActions.onCreateMessageRead(containerId, userId, messageId));
      }

      if (!isEmpty(activities)) {
        actionsBatch.push(ActivitiesModelActions.onBatchActivitiesData(activities, result.activityTargetIds));
      }

      if (!isEmpty(activities)) {
        actionsBatch.push(ActivitiesModelActions.onBatchActivitiesChangedProps(activitiesChangedProps));
      }

      if (!isEmpty(reactions)) {
        actionsBatch.push(MessagesModelActions.onBatchMessageReactionData(reactions));
      }

      if (!isEmpty(files)) {
        actionsBatch.push(FilesModelActions.onBatchFilesData(files));
      }

      if (!isEmpty(attachments)) {
        actionsBatch.push(MessagesModelActions.onBatchMessagesAttachmentsIds(attachments));
      }

      if (!isEmpty(taskSourceDataByMessageIds)) {
        let taskIdByMessageId = emptyMap;
        let projectIdByTaskId = emptyMap;
        // TODO: add listId->taskId etc maps in future if needed (it will need a change in the backend)

        taskSourceDataByMessageIds.forEach((taskSourceData, messageId) => {
          taskIdByMessageId = taskIdByMessageId.set(messageId, taskSourceData.taskId);
          projectIdByTaskId = projectIdByTaskId.set(taskSourceData.taskId, taskSourceData.projectId);
        });

        const tasksFromMessagesSourceData = {
          taskIdByMessageId,
          projectIdByTaskId,
        };

        actionsBatch.push(TasksModelActions.onBatchTasksSources(tasksFromMessagesSourceData));
      }

      if (!isEmpty(messages)) {
        actionsBatch.push(MessagesModelActions.onBatchMessagesData(messages, messagesCreatedAt));
      }

      actionsBatch.push(onSetPageLastNext(RequestTypesConstants.getMessageBoard, containerId, result.nextPage));
      yield put(MessagesModelActions.onFetchMessagesMetadata(containerId, containerType));
      actionsBatch.push(onSetRequestStatus(requestStatusType, containerId, RequestStatus.SUCCESS));

      yield put(batchActions(actionsBatch));
    }
  } catch (error) {
    handleError(error, { containerId });
    yield put(onSetRequestStatus(requestStatusType, containerId, RequestStatus.FAILURE, error));
  }
}

export function* onFetchMessagesMetadata({ containerId, containerType }) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getMessagesMetadata, containerId, RequestStatus.LOADING));
    if (!containerType) {
      containerType = yield select(EntityModelSelectors.selectContainerType, { entityId: containerId });
    }
    const resultMetadata = yield cps(client.restApiClient.getMessagesMetadata, containerType, containerId);

    let objectKeyPress = emptyMap;
    let objectLastRead = emptyMap;
    const actionsBatch = [];

    if (resultMetadata && resultMetadata.lastKeyPress) {
      resultMetadata.lastKeyPress.forEach((lastKeyPress) => {
        const { userId, timestamp } = lastKeyPress;
        let objectId = null;
        if (containerType === EntityType.PROJECT_DATA) {
          objectId = lastKeyPress.projectId;
        } else if (containerType === EntityType.TASK_DATA) {
          objectId = lastKeyPress.taskId;
        }

        if (objectId && timestamp) {
          const id = makeObjectKeyPressId(objectId, userId);
          objectKeyPress = objectKeyPress.set(id, timestamp);
        }
      });
    }

    if (resultMetadata && resultMetadata.lastRead) {
      resultMetadata.lastRead.forEach((lastRead) => {
        const { userId, messageId } = lastRead;

        let objectId = null;
        if (containerType === EntityType.PROJECT_DATA) {
          objectId = lastRead.projectId;
        } else if (containerType === EntityType.TASK_DATA) {
          objectId = lastRead.taskId;
        }

        if (objectId && messageId) {
          const id = makeObjectReadId(objectId, userId);
          objectLastRead = objectLastRead.set(id, messageId);
        }
      });
    }

    if (!isEmpty(objectLastRead)) {
      actionsBatch.push(MessagesModelActions.onBatchMessageReadData(objectLastRead));
    }

    if (!isEmpty(objectKeyPress)) {
      actionsBatch.push(MessagesModelActions.onBatchMessageKeyPressData(objectKeyPress));
    }
    actionsBatch.push(
      onSetRequestStatus(RequestTypesConstants.getMessagesMetadata, containerId, RequestStatus.SUCCESS)
    );

    yield put(batchActions(actionsBatch));
  } catch (error) {
    handleError(error, { containerId });
    yield put(onSetRequestStatus(RequestTypesConstants.getMessagesMetadata, containerId, RequestStatus.FAILURE, error));
  }
}

export function* onUpdateMessageReadData({ messageId, userId, containerId }) {
  const lastReadMessageId = yield select(MessagesModelSelectors.selectLastReadMessageId, { objectId: containerId });
  const currentUserId = yield select(selectCurrentUserId);
  const isLoading = yield select(RequestStatusSelectors.selectRequestIsLoading, {
    objectId: lastReadMessageId,
    requestType: RequestTypesConstants.updateMessageRead,
  });

  if (isLoading && userId === currentUserId) {
    return;
  }

  yield put(MessagesModelActions.onCreateMessageRead(containerId, userId, messageId));
}

export default [watchMessages];
