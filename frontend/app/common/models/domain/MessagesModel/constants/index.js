import { Quill } from 'react-quill'

let Delta = null
if (Quill) {
  Delta = Quill.import('delta')
}

export const domain = 'MessagesModel'

export const newMessageUpdated = `${domain}/newMessageUpdated`

export const messageAdded = `${domain}/messageAdded`
export const onMessageBoundToObject = `${domain}/onMessageBoundToObject`

export const onMessageSend = `${domain}/onMessageSend`
export const onMessageResend = `${domain}/onMessageResend`
export const onMessageSendSuccess = `${domain}/onMessageSendSuccess`
export const onMessageSendFailure = `${domain}/onMessageSendFailure`

export const messageUnboundFromObject = `${domain}/messageUnboundFromObject`
export const onMessageDelete = `${domain}/onMessageDelete`
export const onMessageDeleteSuccess = `${domain}/onMessageDeleteSuccess`
export const onMessageDeleteFailure = `${domain}/onMessageDeleteFailure`
export const onDeleteUndeliveredMessage = `${domain}/onDeleteUndeliveredMessage`

export const onAddMessagesBatch = `${domain}/onAddMessagesBatch`
export const onAddMessagesBatchSuccess = `${domain}/onAddMessagesBatchSuccess`
export const onAddMessagesBatchFailure = `${domain}/onAddMessagesBatchFailure`

export const onCreateMessageData = `${domain}/onCreateMessageData`
export const onRemoveMessageData = `${domain}/onRemoveMessageData`
export const onBatchMessagesData = `${domain}/onBatchMessageData`
export const onUpdateMessageData = `${domain}/onUpdateMessageData`

export const onFetchMessagesMetadata = `${domain}/onFetchMessagesMetadata`

export const onSetMessageDeleteConfirmationVisibility = `${domain}/onSetMessageDeleteConfirmationVisibility`
export const setIsMessageBeingEdited = `${domain}/setIsMessageBeingEdited`
export const updateMessageNewText = `${domain}/updateMessageNewText`

export const onUpdateNewMessageContent = `${domain}/onUpdateNewMessageContent`
export const onRetrieveLocalStoredNewMessage = `${domain}/onRetrieveLocalStoredNewMessage`

export const onMessageEdit = `${domain}/onMessageEdit`
export const onMessageEditSuccess = `${domain}/onMessageEditSuccess`
export const onMessageEditFailure = `${domain}/onMessageEditFailure`

export const setIsMessagesListLoading = `${domain}/setIsMessagesListLoading`

export const onMessageReactionAdd = `${domain}/onMessageReactionAdd`
export const onMessageReactionAddSuccess = `${domain}/onMessageReactionAddSuccess`
export const onMessageReactionAddFailure = `${domain}/onMessageReactionAddFailure`

export const onUpdateMessageRead = `${domain}/onUpdateMessageRead`
export const onUpdateMessageReadSuccess = `${domain}/onUpdateMessageReadSuccess`

export const onUpdateMessageKeyPress = `${domain}/onUpdateMessageKeyPress`
export const onUpdateMessageKeyPressSuccess = `${domain}/onUpdateMessageKeyPressSuccess`

export const onUpdateMessageReadData = `${domain}/onUpdateMessageReadData`
export const onBatchMessageReadData = `${domain}/onBatchMessageReadData`

export const onCreateMessageKeyPressData = `${domain}/onCreateMessageKeyPressData`
export const onUpdateMessageKeyPressData = `${domain}/onUpdateMessageKeyPressData`
export const onBatchMessageKeyPressData = `${domain}/onBatchMessageKeyPressData`

export const onCreateMessageReactionData = `${domain}/onCreateMessageReactionData`
export const onUpdateMessageReactionData = `${domain}/onUpdateMessageReactionData`
export const onRemoveMessageReactionData = `${domain}/onRemoveMessageReactionData`
export const onBatchMessageReactionData = `${domain}/onBatchMessageReactionData`

export const onConvertMessageToTask = `${domain}/onConvertMessageToTask`
export const onConvertConversationMessageToTask = `${domain}/onConvertConversationMessageToTask`

export const onConvertMessageToCardComment = `${domain}/onConvertMessageToCardComment`

export const onSetObjectTopVisibleItem = `${domain}/onSetObjectTopVisibleItem`

export const onCreateMessageAttachmentsIds = `${domain}/onCreateMessageAttachmentsIds`
export const onBatchMessagesAttachmentsIds = `${domain}/onBatchMessagesAttachmentsIds`

export const onCreateMessagesWithFiles = `${domain}/onCreateMessagesWithFiles`
export const onCreateMessageAndAttachFile = `${domain}/onCreateMessageAndAttachFile`
export const onAttachFile = `${domain}/onAttachFile`

export const onFetchMessageBoard = `${domain}/onFetchMessageBoard`
export const onFetchMessageBoardSuccess = `${domain}/onFetchMessageBoardSuccess`
export const onFetchMessageBoardFailure = `${domain}/onFetchMessageBoardFailure`

export const onMessageReactionRemove = `${domain}/onMessageReactionRemove`
export const onMessageReactionRemoveSuccess = `${domain}/onMessageReactionRemoveSuccess`
export const onMessageReactionRemoveFailure = `${domain}/onMessageReactionRemoveFailure`

export const onFetchMessageBoardIfDidNotFetchAlready = `${domain}/onFetchMessageBoardIfDidNotFetchAlready`

export const onDeleteLinkPreview = `${domain}/onDeleteLinkPreview`
export const onDeleteLinkPreviewSuccess = `${domain}/onDeleteLinkPreviewSuccess`
export const onDeleteLinkPreviewFailure = `${domain}/onDeleteLinkPreviewFailure`

export const onRemovePersistentMessageContent = `${domain}/onRemovePersistentMessageContent`

export const onCreateMessageRead = `${domain}/onCreateMessageRead`

export const onBatchLatestActiveUserConversations = `${domain}/onBatchLatestActiveUserConversations`

export const onSetRespondedMessageId = `${domain}/onSetRespondedMessageId`

export const emptyDelta = Delta ? new Delta().insert('\n') : null
