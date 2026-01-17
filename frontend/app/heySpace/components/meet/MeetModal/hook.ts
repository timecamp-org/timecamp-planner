import { useEffect, useCallback } from 'react'
import { useSelector } from 'common/hooks/useSelector'
import {
  selectProjectName, selectProjectIsGroupOrDirectChat, selectConversationNameByProjectId, selectProjectColor
} from 'models/domain/ProjectsModel/selectors'
import { selectModalProperty } from 'models/component/ModalsModel/selectors'
import { ModalType } from 'models/component/ModalsModel/types'
import { useDispatch } from 'react-redux'
import { onOpenModal, onCloseModal } from 'models/component/ModalsModel/actions'
import { Id } from 'common/utils/identifier'
import useElementOpen from 'common/hooks/useElementOpen'
import { AppEventEmitter } from 'common/services'
import { AppEventType } from 'common/types'

export type MeetModalHookInterface = {
  isOpen: boolean,
  isMinimized: boolean,
  objectId: Id,
  containerName: string,
  color: string,
  onSetIsOpen: (isOpen: boolean) => void,
  onSetIsMinimized: (isMinimized: boolean) => void,
  onMaximize: VoidFunction,
  onMinimize: VoidFunction,
  onSendCloseModalSignal: VoidFunction,

}

export default function useComponent(): MeetModalHookInterface {
  const {
    isOpen: isMinimized,
    onSetIsOpen: onSetIsMinimized,
    onOpen: onMinimize,
    onClose: onMaximize,
  } = useElementOpen(false)

  const openedMeetModalId: Id = useSelector(state => selectModalProperty(state, { modalType: ModalType.HEYSPACE_MEET, property: 'objectId' }))
  let containerName = useSelector(state => selectProjectName(state, { projectId: openedMeetModalId }))
  const isConversation = useSelector(state => selectProjectIsGroupOrDirectChat(state, { projectId: openedMeetModalId }))
  const conversationName = useSelector(state => selectConversationNameByProjectId(state, { projectId: openedMeetModalId }))
  const color = useSelector(state => selectProjectColor(state, { projectId: openedMeetModalId }))

  const isOpen = !!openedMeetModalId

  const dispatch = useDispatch()

  const onSetIsOpen = useCallback((isModalOpened: boolean) => {
    if (isModalOpened) {
      dispatch(onOpenModal(ModalType.HEYSPACE_MEET, { objectId: openedMeetModalId }))
    } else {
      dispatch(onCloseModal(ModalType.HEYSPACE_MEET))
    }
  }, [dispatch, openedMeetModalId])

  const onSendCloseModalSignal = useCallback(() => {
    AppEventEmitter.emit(AppEventType.DISPOSE_MEET)
  }, [])

  if (isConversation && conversationName) {
    containerName = conversationName
  }

  useEffect(() => {
    onSetIsMinimized(false)
  }, [isOpen, onSetIsMinimized])

  return {
    isOpen,
    objectId: openedMeetModalId,
    color,
    isMinimized,
    containerName,
    onSetIsOpen,
    onSetIsMinimized,
    onMaximize,
    onMinimize,
    onSendCloseModalSignal,
  }
}
