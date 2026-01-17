import DifferenceInSeconds from 'date-fns/difference_in_seconds';
import format from 'date-fns/format';
import { List, Map } from 'immutable';
import createCachedSelector from 're-reselect';

import { timestampNow } from '../../../../utils/epoch';
import { makeObjectKeyPressId, makeObjectReadId } from '../../../../utils/generateLocalStorageId';
import generateSelectorName from '../../../../utils/generateSelectorName';
import toPlainText from '../../../../utils/messageToPlainText';
import { getUserName } from '../../../../utils/user';
import { selectFilteredObjectActivityTimestamps } from '../../ActivitiesModel/selectors';
import { selectEntityTypes } from '../../EntityModel/selectors';
import { EntityType } from '../../EntityModel/types';
import { selectFilesData } from '../../FilesModel/selectors';
import { selectProjectPeople } from '../../ProjectsModel/selectors/domain';
import { selectAllUserIdsExceptCurrent } from '../../UsersModel/selectors';
import { selectCurrentUserId, selectUsersData, selectUsersNicknames } from '../../UsersModel/selectors/domain';
import { ACTIVITY, DATE_SEPARATOR, MESSAGE } from '../constants/messageTypes';
import { isPureTextMessage } from '../utils';

import {
  selectMessage,
  selectMessageAttachmentsDomain,
  selectMessageContainerId,
  selectMessagesCreatedAt,
  selectMessagesData,
  selectMessagesReactions,
  selectMessageText,
  selectObjectKeyPressDataDomain,
  selectObjectMessageIds,
  selectObjectMessageIdsInOrder,
  selectObjectReadDataDomain,
  selectReactionsDataDomain,
  selectRespondedMessageId,
  selectUserIdByMessageId,
} from './domain';

const emptyList = new List();
const emptyMap = new Map();

/**
 * @param {string} messageId
 * @returns {boolean}
 */
export const selectDoesMessageBelongToCurrentUser = createCachedSelector(
  selectMessage,
  selectCurrentUserId,
  (message, userId) => (message ? message.get('userId') === userId : false)
)((_, args) => generateSelectorName(args, ['messageId']));

// TODO: handle store message text with slack-like entities to true plain text (with <@userId> mentions replaced with usernames etc
/**
 * @param {string} messageId
 * @returns {string}
 */
export const selectParsedMessageText = createCachedSelector(
  selectMessageText,
  selectUsersNicknames,
  (messageText, userNicknamesByIds) => (messageText ? toPlainText(messageText, userNicknamesByIds).trimEnd() : '')
)((_, args) => generateSelectorName(args, ['messageId']));

/**
 * @param {string} messageId
 * @param {string} objectId
 * @returns {List}
 */
export const selectUsersThatReadMessage = createCachedSelector(
  selectObjectReadDataDomain,
  selectAllUserIdsExceptCurrent,
  (_, args) => args.messageId,
  (_, args) => args.objectId,
  (objectReadData, allUserIdsExceptCurrent, messageId, objectId) => {
    let userIds = emptyList;

    allUserIdsExceptCurrent.forEach((userId) => {
      const readDataId = makeObjectReadId(objectId, userId);
      if (objectReadData.get(readDataId) === messageId) {
        userIds = userIds.push(userId);
      }
    });

    return userIds.sort();
  }
)((_, args) => generateSelectorName(args, ['messageId', 'objectId']));

/**
 * @param {string} objectId
 * @returns {List}
 */
export const selectObjectUsersRead = createCachedSelector(
  selectObjectReadDataDomain,
  (_, args) => args.objectId,
  selectAllUserIdsExceptCurrent,
  (objectReadData, objectId, allUserIdsExceptCurrent) => {
    let objectUsersRead = emptyList;
    allUserIdsExceptCurrent.forEach((userId) => {
      const readDataId = makeObjectReadId(objectId, userId);
      if (objectReadData.get(readDataId)) {
        objectUsersRead = objectUsersRead.push(
          new Map({
            userId,
            messageId: objectReadData.get(readDataId),
          })
        );
      }
    });

    return objectUsersRead;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 * @returns {Map}
 */
export const selectProjectMessagesUsersRead = createCachedSelector(
  selectObjectMessageIds,
  selectMessagesData,
  selectObjectUsersRead,
  selectMessagesCreatedAt,
  (messageIds, messagesData, objectUsersRead, messagesCreatedAt) => {
    const messages = messageIds.map((id) => messagesData.get(id));
    const reverseSortedMessages = messages.sort(
      (a, b) => messagesCreatedAt.get(b.messageId) - messagesCreatedAt.get(a.messageId)
    );
    let usersRead = emptyMap;

    reverseSortedMessages.forEach((message) => {
      const userIds = objectUsersRead
        .filter((objectUserRead) => objectUserRead.get('messageId') === message.id)
        .map((objectUserRead) => objectUserRead.get('userId'));

      if (userIds.size > 0) {
        usersRead = usersRead.set(message.id, userIds);
      }
    });

    return usersRead;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 * @returns {List}
 */
export const selectObjectUsersKeypress = createCachedSelector(
  selectObjectKeyPressDataDomain,
  (_, args) => args.objectId,
  selectAllUserIdsExceptCurrent,
  (objectKeypressData, objectId, allUserIdsExceptCurrent) => {
    const now = timestampNow();
    let objectUsersKeypress = emptyList;

    allUserIdsExceptCurrent.forEach((userId) => {
      const keypressDataId = makeObjectKeyPressId(objectId, userId);
      const keyPressTimestmap = objectKeypressData.get(keypressDataId);
      if (keyPressTimestmap && DifferenceInSeconds(now, keyPressTimestmap) < 5) {
        objectUsersKeypress = objectUsersKeypress.push(userId);
      }
    });

    return objectUsersKeypress;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} projectId
 * @returns {List}
 */
export const selectObjectLastKeyPressTimestamp = createCachedSelector(
  (_, args) => args.projectId,
  selectObjectKeyPressDataDomain,
  selectProjectPeople,
  selectCurrentUserId,
  (objectId, objectKeyPressData, projectPeople, currentUserId) => {
    let lastKeyPressTimestamp = null;

    projectPeople.forEach((userId) => {
      const keyPressId = makeObjectKeyPressId(objectId, userId);
      const lastUserKeyPressTimestamp = objectKeyPressData.get(keyPressId);

      if (lastKeyPressTimestamp < lastUserKeyPressTimestamp && userId !== currentUserId) {
        lastKeyPressTimestamp = lastUserKeyPressTimestamp;
      }
    });

    return lastKeyPressTimestamp;
  }
)((_, args) => generateSelectorName(args, ['projectId']));

/**
 * @param {string} objectId
 * @return {List}
 */
export const selectCurrentUserLastTextMessageIdInObject = createCachedSelector(
  selectObjectMessageIdsInOrder,
  selectCurrentUserId,
  selectMessagesData,
  (sortedMessageIds, currentUserId, messagesData) =>
    sortedMessageIds
      .reduce((result, messageId) => {
        const messageData = messagesData.get(messageId);
        if (messageData && messageData.get('userId') === currentUserId && isPureTextMessage(messageData)) {
          return result.push(messageId);
        } else {
          return result;
        }
      }, emptyList)
      .last()
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} messageId
 * @return {List}
 */
export const selectMessageAttachmentsIds = createCachedSelector(
  (_, args) => args.messageId,
  selectMessageAttachmentsDomain,
  selectFilesData,
  (messageId, messageAttachmentsDomain, filesData) => {
    const fileIds = messageAttachmentsDomain.get(messageId) || emptyList;

    return fileIds.filter((fileId) => filesData.has(fileId));
  }
)((_, args) => generateSelectorName(args, ['messageId']));

/**
 * @param {string} objectId
 */
export const selectObjectMessagesFiles = createCachedSelector(
  selectObjectMessageIdsInOrder,
  selectMessageAttachmentsDomain,
  selectFilesData,
  (messageIds, messageAttachmentsDomain, filesData) => {
    let messagesFiles = emptyMap;

    messageIds.forEach((messageId) => {
      const attachmentIds = messageAttachmentsDomain.get(messageId) || emptyList;
      const fileIds = attachmentIds.filter((fileId) => filesData.has(fileId));
      const files = fileIds.map((fileId) => filesData.get(fileId));
      messagesFiles = messagesFiles.set(messageId, files);
    });

    return messagesFiles;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 */
export const selectObjectMessagesReactionIds = createCachedSelector(
  selectObjectMessageIdsInOrder,
  selectMessagesReactions,
  selectReactionsDataDomain,
  (messageIds, messagesReactions, reactionsData) => {
    let messagesReactionIds = emptyMap;

    messageIds.forEach((messageId) => {
      const messageReactionIds = messagesReactions.get(messageId) || emptyList;
      const reactionIds = messageReactionIds.filter((reactionId) => reactionsData.has(reactionId));
      messagesReactionIds = messagesReactionIds.set(messageId, reactionIds);
    });

    return messagesReactionIds;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 */
export const selectObjectMessagesText = createCachedSelector(
  selectObjectMessageIdsInOrder,
  selectMessagesData,
  (messageIds, messagesData) => {
    let messagesText = emptyMap;

    messageIds.forEach((messageId) => {
      const message = messagesData.get(messageId);
      const messageText = message && message.text;
      messagesText = messagesText.set(messageId, messageText);
    });

    return messagesText;
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} messageId
 * @return {number|null} attachmentId
 */
export const selectMessageFirstAttachmentId = createCachedSelector(
  selectMessageAttachmentsIds,
  (messageAttachmentIds) => messageAttachmentIds.first()
)((_, args) => generateSelectorName(args, ['messageId']));

/**
 * @param {string} objectId
 * @param {boolean} withActivities
 * @return {List}
 */
export const selectMessageList = createCachedSelector(
  selectObjectMessageIdsInOrder,
  selectMessagesCreatedAt,
  selectFilteredObjectActivityTimestamps,
  (_, args) => args.withActivities,
  (_, args) => args.withMessages,
  (_, args) => args.objectId,
  (messageIds, messagesCreatedAt, activities, withActivities = true, withMessages = true, objectId) => {
    let result = emptyList;
    let date = null;

    if (withMessages) {
      messageIds.forEach((id) => {
        const createdAt = messagesCreatedAt.get(id);

        if (createdAt) {
          const currentDateString = format(createdAt, 'YYYY-MM-DD');

          if (date !== currentDateString) {
            result = result.push(
              new Map({
                id: `${DATE_SEPARATOR}::${createdAt}`,
                timestamp: createdAt,
                type: DATE_SEPARATOR,
              })
            );

            date = currentDateString;
          }
        }

        result = result.push(
          new Map({
            id,
            timestamp: createdAt,
            type: MESSAGE,
          })
        );
      });
    }

    if (withActivities) {
      activities.forEach((timestamp, id) => {
        result = result.push(
          new Map({
            id,
            timestamp,
            type: ACTIVITY,
          })
        );
      });
    }

    result = result.sortBy((data) => data.get('timestamp'));

    return result;
  }
)((_, args) => generateSelectorName(args, ['objectId', 'withActivities']));

/**
 * @param {string} objectId
 * @return {string}
 */
export const selectLastReadMessageId = createCachedSelector(
  (_, args) => args.objectId,
  selectObjectReadDataDomain,
  selectCurrentUserId,
  (objectId, objectReadData, userId) => {
    const readDataId = makeObjectReadId(objectId, userId);

    return objectReadData.get(readDataId);
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 * @return {string}
 */
export const selectLastReadMessageUserId = createCachedSelector(
  selectLastReadMessageId,
  selectUserIdByMessageId,
  (lastReadMessageId, messagesUser) => {
    if (!lastReadMessageId || !messagesUser) {
      return null;
    }

    return messagesUser.get(lastReadMessageId);
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 * @return {string}
 */
export const selectLastMessageId = createCachedSelector(selectMessageList, (messageList) => {
  if (!messageList) {
    return null;
  }

  const lastMessage = messageList.last();
  if (!lastMessage) {
    return null;
  }

  return lastMessage.get('id');
})((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} objectId
 * @return {string}
 */
export const selectLastMessageUserId = createCachedSelector(
  selectLastMessageId,
  selectUserIdByMessageId,
  (lastMessageId, messagesUser) => {
    if (!lastMessageId || !messagesUser) {
      return null;
    }

    return messagesUser.get(lastMessageId);
  }
)((_, args) => generateSelectorName(args, ['objectId']));

/**
 * @param {string} messageId
 * @return {string}
 */
export const selectMessageAuthorName = createCachedSelector(
  selectUsersData,
  selectUserIdByMessageId,
  (_, args) => args.messageId,
  (usersData, messagesUser, messageId) => {
    const userId = messagesUser.get(messageId);
    const user = usersData.get(userId);

    if (!userId) {
      return '';
    } else {
      const { firstName, lastName, email } = user;

      return getUserName(firstName, lastName, email);
    }
  }
)((_, args) => generateSelectorName(args, ['messageId']));

// messageId
export const selectIsEditingCardMessage = createCachedSelector(
  selectMessageContainerId,
  selectEntityTypes,
  (containerId, entityTypes) => entityTypes.get(containerId) === EntityType.TASK_DATA
)((_, args) => generateSelectorName(args, ['messageId']));

/**
 * @param {string} messageId
 * @param {string} objectId
 */
export const selectPreviousMessageId = createCachedSelector(
  selectObjectMessageIdsInOrder,
  (_, args) => args.messageId,
  (messageIds, messageId) => {
    const messageIndex = messageIds.indexOf(messageId);
    const previousMessageIndex = messageIndex - 1;
    if (previousMessageIndex < 0) {
      return null;
    }

    return messageIds.get(previousMessageIndex);
  }
)((_, args) => generateSelectorName(args, ['messageId']));

/**
 * @param {string} objectId
 */
export const selectRespondedMessageIdForObject = createCachedSelector(
  selectObjectMessageIds,
  selectRespondedMessageId,
  (objectMessageIds, respondedMessageId) => (objectMessageIds.includes(respondedMessageId) ? respondedMessageId : null)
)((_, args) => generateSelectorName(args, ['objectId']));
