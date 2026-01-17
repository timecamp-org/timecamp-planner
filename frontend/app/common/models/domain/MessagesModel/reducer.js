import { fromJS, List, Map } from 'immutable'

import * as MessagesModelConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import { mergeObjectLists } from '../../../utils/immutableUtils'
import { makeObjectReadId } from '../../../utils/generateLocalStorageId'
import * as AppModelConstants from '../AppModel/constants'

const emptyList = new List()

// export initial state for testing
export const initialState = fromJS({

  messagesData: {

  },

  messagesCreatedAt: {

  },

  reactionsData: {

  },

  objectMessages: {

  },

  objectIsMessagesListLoading: {

  },

  // this is just for the current user, so it only contains an object->msgtext map
  // (we don't want clever users to see others' unfinished msgs)
  // preferably kept only in local storage?
  objectNewMessages: {

  },

  objectReadData: {

  },

  objectKeyPressData: {

  },

  messagesReactions: {

  },

  objectTopVisibleItemData: {

  },

  messageAttachmentsIds: {

  },

  currentEditingMessageId: null,
  respondedMessageId: null,
})

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case MessagesModelConstants.newMessageUpdated:
      return state
        .setIn(['objectNewMessages', action.objectId], action.value)

    case MessagesModelConstants.onUpdateNewMessageContent:
      return state
        .setIn(['objectNewMessages', action.objectId, 'content'], action.newContent)

    case MessagesModelConstants.onMessageBoundToObject:
      return state.updateIn(['objectMessages', action.objectId], list => (list ? list.push(action.messageId) : new List([action.messageId])))

    case MessagesModelConstants.messageAdded:
      return state.setIn(['messagesData', action.id], action.message)

    case MessagesModelConstants.setIsMessageBeingEdited:
      return state
        .setIn(['messagesData', action.messageId, 'isBeingEdited'], action.isBeingEdited)
        .set('currentEditingMessageId', action.isBeingEdited ? action.messageId : null)

    case MessagesModelConstants.onMessageEditSuccess: {
      const { messageId, message } = action.actionResult.data
      return state
        .setIn(['messagesData', messageId], message)
    }

    case MessagesModelConstants.onMessageDeleteSuccess: {
      const { objectId, messageId } = action.actionResult.data
      return state
        .updateIn(['objectMessages', objectId], (list) => (list ? list.filter((id) => id !== messageId) : emptyList))
        .deleteIn(['messagesData', messageId])
        .deleteIn(['messagesCreatedAt', messageId])
    }

    case MessagesModelConstants.onMessageSendSuccess: {
      const { messageId, objectId, message, createdAt } = action.actionResult.data
      return state
        .setIn(['messagesData', messageId], message)
        .setIn(['messagesCreatedAt', messageId], createdAt)
        .updateIn(['objectMessages', objectId], list => (list ? list.push(messageId) : new List([messageId])))
    }

    case MessagesModelConstants.onSetMessageDeleteConfirmationVisibility:
      return state.setIn(['messagesData', action.messageId, 'isDeleteConfirmationVisible'], action.isVisible)

    case MessagesModelConstants.messageUnboundFromObject: {
      const { messageId } = action
      return state.updateIn(['objectMessages', action.objectId], (messagesList) => (messagesList ? messagesList.filter((id) => id !== messageId) : emptyList))
    }

    case MessagesModelConstants.onUpdateMessageData: {
      return state.setIn(['messagesData', action.message.id], action.message)
    }

    case MessagesModelConstants.onCreateMessageData: {
      return state.setIn(['messagesData', action.message.id], action.message)
        .updateIn(['objectMessages', action.objectId], (list) => (
          list
            ? (!list.includes(action.message.id) ? list.push(action.message.id) : list)
            : new List([action.message.id])))
        .setIn(['objectReadData', makeObjectReadId(action.message.containerId, action.message.userId)], action.message.id)
        .setIn(['messagesCreatedAt', action.message.id], action.createdAt)
    }

    case MessagesModelConstants.onRemoveMessageData: {
      const { objectId, messageId } = action
      return state
        .updateIn(['objectMessages', objectId], (list) => (list ? list.filter((id) => id !== messageId) : emptyList))
        .deleteIn(['messagesData', messageId])
    }

    case MessagesModelConstants.onBatchMessagesData: {
      return state
        .set('messagesData', state.get('messagesData').merge(action.messages))
        .set('messagesCreatedAt', state.get('messagesCreatedAt').merge(action.messagesCreatedAt))
        .set('objectMessages', mergeObjectLists(state.get('objectMessages'), action.objectMessages))
    }

    case MessagesModelConstants.setIsMessagesListLoading: {
      return state
        .setIn(['objectIsMessagesListLoading', action.objectId], action.isLoading)
    }

    case MessagesModelConstants.onMessageReactionAddSuccess: {
      const { messageId, reactionId, reactionRecord } = action.actionResult.data
      return state.updateIn(['messagesReactions', messageId], list => (list ? list.push(reactionId) : new List([reactionId])))
        .setIn(['reactionsData', reactionId], reactionRecord)
    }

    case MessagesModelConstants.onMessageReactionRemoveSuccess: {
      const { messageId, reactionId } = action.actionResult.data

      return state.updateIn(['messagesReactions', messageId], list => (list ? list.filter(id => id !== reactionId) : emptyList))
        .removeIn(['reactionsData', reactionId])
    }

    case MessagesModelConstants.onCreateMessageRead:
    case MessagesModelConstants.onUpdateMessageReadSuccess: {
      const { messageReadId, messageId } = action
      return state.setIn(['objectReadData', messageReadId], messageId)
    }

    case MessagesModelConstants.onBatchMessageReadData: {
      return state.set('objectReadData', state.get('objectReadData').merge(action.objectMessageReadData))
    }

    case MessagesModelConstants.onCreateMessageKeyPressData:
    case MessagesModelConstants.onUpdateMessageKeyPressData: {
      return state.setIn(['objectKeyPressData', action.id], action.lastKeypressTime)
    }
    case MessagesModelConstants.onBatchMessageKeyPressData: {
      return state.set('objectKeyPressData', state.get('objectKeyPressData').merge(action.objectMessageKeyPressData))
    }

    case MessagesModelConstants.onUpdateMessageKeyPressSuccess: {
      const { containerId, timestamp } = action.actionResult.data
      return state.setIn(['objectKeyPressData', containerId], timestamp)
    }

    case MessagesModelConstants.onCreateMessageReactionData:
    case MessagesModelConstants.onUpdateMessageReactionData: {
      const { id, reaction } = action
      return state.updateIn(['messagesReactions', reaction.get('messageId')], list => (list ? list.push(id).toSet().toList() : new List([id])))
        .setIn(['reactionsData', id], reaction)
    }

    case MessagesModelConstants.onRemoveMessageReactionData: {
      const { id, messageId } = action
      return state
        .updateIn(['messagesReactions', messageId], list => (list ? list.filter(reactionId => reactionId !== id) : emptyList))
        .deleteIn(['reactionsData', id])
    }

    case MessagesModelConstants.onBatchMessageReactionData: {
      return state.set('messagesReactions', state.get('messagesReactions').merge(action.messagesReactions))
        .set('reactionsData', state.get('reactionsData').merge(action.reactionsData))
    }

    case MessagesModelConstants.onSetObjectTopVisibleItem: {
      const { objectId, scrollHeight } = action
      return state.setIn(['objectTopVisibleItemData', objectId], scrollHeight)
    }

    case MessagesModelConstants.onCreateMessageAttachmentsIds: {
      const { messageId, messageAttachmentsIds } = action
      return state.setIn(['messageAttachmentsIds', messageId], messageAttachmentsIds)
    }

    case MessagesModelConstants.onBatchMessagesAttachmentsIds: {
      return state.set('messageAttachmentsIds', state.get('messageAttachmentsIds').merge(action.messageAttachmentsIds))
    }

    case MessagesModelConstants.onAttachFile: {
      const { messageId, fileId } = action
      return state.setIn(['messageAttachmentsIds', messageId], new List([fileId]))
    }

    case MessagesModelConstants.onDeleteLinkPreviewSuccess: {
      const { messageId } = action
      return state.setIn(['messagesData', messageId, 'isLinkPreviewEnabled'], false)
    }

    case MessagesModelConstants.onDeleteLinkPreviewFailure: {
      const { messageId } = action
      return state.setIn(['messagesData', messageId, 'isLinkPreviewEnabled'], true)
    }

    case MessagesModelConstants.onBatchLatestActiveUserConversations: {
      const { objectMessages, messagesCreatedAt } = action

      return state
        .set('messagesCreatedAt', state.get('messagesCreatedAt').merge(messagesCreatedAt))
        .set('objectMessages', mergeObjectLists(state.get('objectMessages'), objectMessages))
    }

    case MessagesModelConstants.onSetRespondedMessageId: {
      const { messageId } = action
      return state.set('respondedMessageId', messageId)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default:
      return state
  }
}
