import { useState } from 'react'
import { Maybe, AppEventType } from 'common/types'
import { Id } from 'common/utils/identifier'
import { UserTracker, AppEventEmitter } from 'common/services'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { MessageActionsButtonInterface } from '.'
import { EmojiData } from 'emoji-mart'
import { useDataProvider, useDataPersister } from './dataHooks'
import { selectProjectIdByTaskId } from '../../../../common/models/domain/TasksModel/selectors/index'
import { selectEntityType } from '../../../../common/models/domain/EntityModel/selectors'
import { useSelector } from 'react-redux'
import { EntityType } from 'models/domain/EntityModel/types'

export type MessageActionButtonsHookInterface = {
  spaceId: Id,
  conversationWithUserId: Id,
  isConvertToTaskButtonVisible: boolean,
  isConvertMessageToTaskPopoverOpen: boolean,
  isConvertMessageToTaskCommentPopoverOpen: boolean,
  isOwnMessage: boolean,

  onSetIsEmojiPickerOpen: (isOpen: boolean) => void,
  onSetMessageDeleteConfirmationVisibility: (isVisible: boolean) => void,
  onMarkMessageAsUnread: VoidFunction,
  onCloseConvertMessagePopover: VoidFunction,
  onClickConvertMessageButton: VoidFunction,
  onCloseConvertMessageToTaskCommentPopover: VoidFunction,
  onClickConvertMessageToTaskCommentButton: VoidFunction,
  onMessageReactionPick: (emoji: EmojiData) => void,
  onMessageDeleteClicked: VoidFunction,
  onMessageEditClicked: VoidFunction,
  onRespondMessageClicked: VoidFunction,
  onHideMessageActionButtons: VoidFunction,
}

export default function useComponent(props: MessageActionsButtonInterface): MessageActionButtonsHookInterface {
  const [isConvertMessageToTaskPopoverOpen, onSetIsConvertMessageToTaskPopoverOpen] = useState(false)
  const [isConvertMessageToTaskCommentPopoverOpen, onSetIsConvertMessageToTaskCommentPopoverOpen] = useState(false)

  const { messageId, containerId } = props

  const dataProvider = useDataProvider(messageId, containerId)
  const dataPersister = useDataPersister(messageId, containerId)

  let projectId = containerId
  const containerType = useSelector(state => selectEntityType(state, { entityId: projectId }))

  const projectIdByTaskId = useSelector(state => selectProjectIdByTaskId(state, { taskId: containerId }))

  if (containerType === EntityType.TASK_DATA) {
    projectId = projectIdByTaskId
  }

  const onSetIsEmojiPickerOpen = (isOpen: boolean) => {
    if (!isOpen) {
      onHideMessageActionButtons()
    }
  }

  const onSetMessageDeleteConfirmationVisibility = (isVisible: boolean) => {
    if (!isVisible) {
      onHideMessageActionButtons()
    }

    dataPersister.onSetMessageDeleteConfirmationVisibility(isVisible)
  }

  const onHideMessageActionButtons = () => {
    props.onCloseMoreOptions()
    props.onHideMessageActionButtons()
  }

  const onMarkMessageAsUnread = () => {
    dataPersister.onUpdateMessageRead(props.previousMessageId || props.messageId)
    UserTracker.track(UserTrackerEvent.featureUsed, { name: 'Mark unread' })
  }

  const onCloseConvertMessagePopover = () => {
    onSetIsConvertMessageToTaskPopoverOpen(false)

    props.onCloseConvertMessagePopover()
  }

  const onClickConvertMessageButton = () => {
    onSetIsConvertMessageToTaskPopoverOpen(!isConvertMessageToTaskPopoverOpen)
    props.onClickConvertMessageButton()
  }

  const onCloseConvertMessageToTaskCommentPopover = () => {
    onSetIsConvertMessageToTaskCommentPopoverOpen(false)

    props.onCloseConvertMessagePopover()
  }

  const onRespondMessageClicked = () => {
    dataPersister.onSetRespondedMessageId()

    onHideMessageActionButtons()
    AppEventEmitter.emit(AppEventType.FOCUS_MESSAGE_INPUT)
  }

  const onClickConvertMessageToTaskCommentButton = () => {
    onSetIsConvertMessageToTaskCommentPopoverOpen(!isConvertMessageToTaskCommentPopoverOpen)

    props.onClickConvertMessageButton()
  }

  const onMessageReactionPick = (emoji: EmojiData) => {
    dataPersister.onMessageReactionAdd(emoji.colons)
  }

  const shouldRenderConvertToTaskButton = () => {
    if (projectId) {
      return true
    } else {
      return false
    }
  }

  const getConversationWithUserId = (): Maybe<Id> => (dataProvider.isDirectChat ? dataProvider.directChatUserId : null)

  return {
    spaceId: dataProvider.isConversation ? null : projectId,
    isConvertToTaskButtonVisible: shouldRenderConvertToTaskButton(),
    conversationWithUserId: getConversationWithUserId(),
    isConvertMessageToTaskPopoverOpen,
    isConvertMessageToTaskCommentPopoverOpen,
    isOwnMessage: dataProvider.isOwnMessage,

    onSetIsEmojiPickerOpen,
    onSetMessageDeleteConfirmationVisibility,
    onMarkMessageAsUnread,
    onCloseConvertMessagePopover,
    onClickConvertMessageButton,
    onCloseConvertMessageToTaskCommentPopover,
    onClickConvertMessageToTaskCommentButton,
    onMessageReactionPick,
    onMessageDeleteClicked: dataPersister.onMessageDeleteClicked,
    onMessageEditClicked: dataPersister.onMessageEditClicked,
    onRespondMessageClicked,
    onHideMessageActionButtons,
  }
}
