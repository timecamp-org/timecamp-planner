import { Record, List, Map } from 'immutable'

export const Message = new Record({
  id: undefined,
  userId: undefined,
  text: '',
  attachments: new List(),
  editorId: undefined,
  editTime: undefined,
  containerId: undefined,
  containerType: undefined,

  isDeleteConfirmationVisible: false,
  isBeingEdited: false,
  isLinkPreviewEnabled: true,
})

export const Conversation = new Record({
  usersList: new List(),
  messageIds: new List(),
  usersTypingTimestamps: new Map(),
})

export const Reaction = new Record({
  messageId: null,
  userId: null,
  emojiCode: null,
})
