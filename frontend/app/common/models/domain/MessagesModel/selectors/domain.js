import * as Constants from '../constants'
import { Map, List } from 'immutable'
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector'
import createCachedSelector from 're-reselect'
import isAfter from 'date-fns/is_after'
import addMinutes from 'date-fns/add_minutes'
import { createSelector } from 'reselect'
import generateSelectorName from '../../../../utils/generateSelectorName'

const emptyList = new List()
const emptyMap = new Map()

// EXPORT EVERY SELECTOR FOR TESTING
export const messagesDomain = (state) => state.get(Constants.domain)

export const selectMessagesData = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('messagesData'),
)

export const selectMessagesCreatedAt = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('messagesCreatedAt'),
)

export const selectObjectMessages = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('objectMessages'),
)

export const selectMessagesReactions = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('messagesReactions'),
)

export const selectObjectReadDataDomain = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('objectReadData'),
)

export const selectObjectKeyPressDataDomain = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('objectKeyPressData'),
)

export const selectReactionsDataDomain = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('reactionsData'),
)

export const selectObjectNewMessages = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('objectNewMessages'),
)

export const selectObjectTopVisibleItemDomain = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('objectTopVisibleItemData'),
)

export const selectMessageAttachmentsDomain = createImmutableEqualSelector(
  messagesDomain,
  (domain) => domain.get('messageAttachmentsIds'),
)

export const selectCurrentEditingMessageId = createSelector(
  messagesDomain,
  domain => domain.get('currentEditingMessageId'),
)

export const selectRespondedMessageId = createSelector(
  messagesDomain,
  domain => domain.get('respondedMessageId'),
)

export const selectUserIdByMessageId = createImmutableEqualSelector(
  selectMessagesData,
  (messagesData) => messagesData.map(message => message.get('userId')),
)

/**
 * @param {string} messageId
 * @returns {object}
 */
export const selectMessage = createImmutableEqualSelector(
  selectMessagesData,
  (_, args) => args.messageId,
  (messages, messageId) => messages.get(messageId),
)

/**
 * @param {string} messageId
 * @returns {string | null}
 */
export const selectMessageContainerId = createCachedSelector(
  selectMessage,
  (message) => (message ? message.containerId : null),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @returns {string}
 */
export const selectMessageText = createCachedSelector(
  selectMessage,
  (message) => (message && message.text !== '' ? message.text : ''),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @returns {string | undefined}
 */
export const selectMessageEditorId = createCachedSelector(
  selectMessage,
  (message) => (message ? message.editorId : undefined),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @returns {number | undefined}
 */
export const selectMessageCreatedAt = createCachedSelector(
  selectMessagesCreatedAt,
  (_, args) => args.messageId,
  (messagesCreatedAt, messageId) => messagesCreatedAt.get(messageId),
)
(
  (_, args) => generateSelectorName(args, ['messageId']),
)

/**
 * @param {string} messageId
 * @returns {boolean}
 */
export const selectIsMessageDeleteConfirmationVisible = createCachedSelector(
  selectMessage,
  (message) => message && message.get('isDeleteConfirmationVisible'),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @returns {boolean}
 */
export const selectIsMessageBeingEdited = createCachedSelector(
  selectMessage,
  (message) => message && message.get('isBeingEdited'),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @returns {string | null}
 */
export const selectMessageUser = createCachedSelector(
  selectMessage,
  (message) => (message ? message.get('userId') : null),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @returns {boolean}
 */
export const selectMessageIsLinkPreviewEnabled = createCachedSelector(
  selectMessage,
  (message) => (message ? message.get('isLinkPreviewEnabled') : false),
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**

/**
 * @param {string} objectId
 * @returns {string}
 */
export const selectObjectNewMessage = createCachedSelector(
  selectObjectNewMessages,
  (_, args) => args.objectId,
  (newMessages, objectId) => newMessages.get(objectId) || '',
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} objectId
 * @returns {Delta}
 */
export const selectObjectNewMessageContent = createCachedSelector(
  selectObjectNewMessage,
  (objectNewMessage) => (objectNewMessage && objectNewMessage.has('content') ? objectNewMessage.get('content') : Constants.emptyDelta),
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} objectId
 * @returns {List}
 */
export const selectObjectMessageIds = createCachedSelector(
  selectObjectMessages,
  (_, args) => args.objectId,
  (objectMessages, objectId) => objectMessages.get(objectId) || emptyList,
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} objectId
 * @return {List}
 */
export const selectObjectMessageIdsInOrder = createCachedSelector(
  selectObjectMessageIds,
  selectMessagesCreatedAt,
  (messageIds, messagesCreatedAt) => (
    messageIds
      ? messageIds.sort((aId, bId) => {
        const aTimestamp = messagesCreatedAt.get(aId)
        const bTimestamp = messagesCreatedAt.get(bId)

        if (aTimestamp && bTimestamp) {
          return aTimestamp - bTimestamp
        } else if (aTimestamp) {
          return -1
        } else {
          return 1
        }
      })
      : emptyList
  ),
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} messageId
 * @return {Map}
 */
export const selectMessageReactions = createCachedSelector(
  selectMessagesReactions,
  selectReactionsDataDomain,
  (_, args) => args.messageId,
  (messagesReactions, reactionsData, messageId) => {
    let reactions = new Map()
    const reactionsIds = messagesReactions.get(messageId)

    if (reactionsIds) {
      reactionsIds.forEach(reactionId => {
        const reaction = reactionsData.get(reactionId)

        if (reaction) {
          reactions = reactions.update(reaction.emojiCode, (list) => (list ? list.push(reaction.userId) : new List([reaction.userId])))
        }
      })
    }

    return reactions
  },
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @return {Map}
 */
export const selectSortedMessageReactionIds = createCachedSelector(
  selectMessageReactions,
  (messageReactions) => {
    return messageReactions.keySeq().toList().sort()
  },
)
  (
  (_, args) => generateSelectorName(args, ['messageId']),
  )

/**
 * @param {string} messageId
 * @param {string} userId
 * @return {Map}
 */
export const selectUserMessageReactionIds = createCachedSelector(
  selectMessagesReactions,
  selectReactionsDataDomain,
  (_, args) => args.messageId,
  (_, args) => args.userId,
  (messagesReactions, reactionsData, messageId, userId) => {
    let result = new Map()
    const reactionsIds = messagesReactions.get(messageId)

    if (reactionsIds) {
      reactionsIds.forEach(reactionId => {
        const reaction = reactionsData.get(reactionId)

        if (reaction && reaction.userId === userId) {
          result = result.set(reaction.emojiCode, reactionId)
        }
      })
    }

    return result
  },
)
  (
  (_, args) => generateSelectorName(args, ['messageId', 'userId']),
  )

/**
 * @param {string} messageId
 * @param {string} userId
 * @return {List}
 */
export const selectUserMessageReactions = createCachedSelector(
  selectMessageReactions,
  (_, args) => args.userId,
  (messageReactions, userId) => {
    let result = emptyList

    const reactions = messageReactions.keySeq().toArray()

    for (let i = 0; i < reactions.length; i++) {
      const reaction = reactions[i]
      const userIds = messageReactions.get(reaction)

      if (userIds && userIds.indexOf(userId) !== -1) {
        result = result.push(reaction)
      }
    }

    return result
  },
)
  (
  (_, args) => generateSelectorName(args, ['messageId', 'userId']),
  )

/**
 * @param {string} objectId
 * @returns {object}
 */
export const selectObjectTopVisibleItem = createCachedSelector(
  (_, args) => args.objectId,
  selectObjectTopVisibleItemDomain,
  (objectId, objectTopVisibleItemDomain) => objectTopVisibleItemDomain.get(objectId),
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} objectId
 * @returns {Map}
 */
export const selectObjectMessagesUser = createCachedSelector(
  selectMessagesData,
  (_, args) => args.objectId,
  (messagesData, objectId) => {
    return messagesData
      .filter(message => message.containerId === objectId)
      .map(message => message.get('userId'))
  },
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} objectId
 * @returns {Map}
 */
export const selectMessagesIsContinuation = createCachedSelector(
  selectObjectMessageIdsInOrder,
  selectUserIdByMessageId,
  selectMessagesCreatedAt,
  (messageIds, messagesUser, messagesCreatedAt) => {
    let result = emptyMap
    let prevTimestamp = null
    let prevUserId = null

    messageIds.forEach((id) => {
      const userId = messagesUser.get(id)
      const createdAt = messagesCreatedAt.get(id)

      if (userId && createdAt) {
        if (prevTimestamp) {
          const addedDate = new Date(createdAt)
          const previousAddedDate = new Date(prevTimestamp)
          const isAfterDate = isAfter(addedDate, addMinutes(previousAddedDate, 10))
          const isSameUser = prevUserId === userId

          if (!isAfterDate && isSameUser) {
            result = result.set(id, true)
          }
        }

        prevTimestamp = createdAt
        prevUserId = userId
      }
    })

    return result
  },
)
  (
  (_, args) => generateSelectorName(args, ['objectId']),
  )

/**
 * @param {string} messageId
 * @param {string} objectId
 * @return {boolean}
 */
export const selectMessageIsContinuation = createCachedSelector(
  selectMessagesIsContinuation,
  (_, args) => args.messageId,
  (messagesIsContinuation, messageId) => messagesIsContinuation && messagesIsContinuation.get(messageId),
)
  (
  (_, args) => generateSelectorName(args, ['messageId', 'objectId']),
  )


 