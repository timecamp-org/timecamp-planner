
import { useDataProvider, useDataPersister } from './dataHooks'
import { Id } from 'common/utils/identifier'
import { QuickSwitcherState } from 'models/domain/AppModel/types'
import { useCallback, useEffect } from 'react'
import mousetrap from 'mousetrap'
import queryString from 'query-string'

// based on mousetrap GH: https://github.com/ccampbell/mousetrap/issues/288#issuecomment-122081142
mousetrap.prototype.stopCallback = function (event, element, combo) {
  // if the element has the class "mousetrap" then no need to stop
  if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) { // eslint-disable-line
    return false
  }

  // Open QuickSwitcher modal when NewMessageEditor is focused
  if ((' ' + element.className + ' ').indexOf(' ql-editor ') > -1) { // eslint-disable-line
    return false
  }

  // stop for input, select, and textarea
  return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true'); // eslint-disable-line
}

export type GlobalModalsHookInterface = {
  openedCardDetailsModalId: Id,
  openedReactivateUserModalId: Id,
  openedGuestDeactivateModalUserId: Id,
  addUsersToProjectModalProjectId: Id,
  openedMeetModalId: Id,
  isGuestProfileModalDeactivating: boolean,
  isUserStatusModalOpen: boolean,
  quickSwitcherState: QuickSwitcherState,
  isWorkspaceModalOpen: boolean,
  isCurrentUserAuthenticated: boolean,
  isCardDetailsModalOpen: boolean,
  isGuestProfileModalOpen: boolean,
}

export default function useComponent(): GlobalModalsHookInterface {
  const {
    openedCardDetailsModalId,
    openedReactivateUserModalId,
    openedGuestDeactivateModalUserId,
    openedMeetModalId,
    isGuestProfileModalDeactivating,
    isUserStatusModalOpen,
    quickSwitcherState,
    isWorkspaceModalOpen,
    isCurrentUserAuthenticated,
    addUsersToProjectModalProjectId,
  } = useDataProvider()

  const dataPersister = useDataPersister()

  const onToggleQuickSwitcherState = useCallback((event) => {
    if (isCurrentUserAuthenticated) {
      event.preventDefault()
      let newState = QuickSwitcherState.CLOSED
      switch (quickSwitcherState) {
        case QuickSwitcherState.CLOSED: newState = QuickSwitcherState.CHATS; break
        case QuickSwitcherState.CHATS: newState = QuickSwitcherState.CARDS; break
        default: newState = QuickSwitcherState.CLOSED
      }
      dataPersister.onToggleQuickSwitcherState(newState)
    }
  }, [
    isCurrentUserAuthenticated,
    quickSwitcherState,
    dataPersister.onToggleQuickSwitcherState
  ])

  useEffect(() => {
    const { taskId } = queryString.parse(window.location.search)
    if (taskId) {
      dataPersister.onOpenCardDetailsModal(taskId as Id)
    }
  }, [])

  useEffect(() => {
    mousetrap.bind('mod+k', onToggleQuickSwitcherState)

    return () => mousetrap.unbind('mod+k', onToggleQuickSwitcherState)
  }, [onToggleQuickSwitcherState])

  return {
    quickSwitcherState: quickSwitcherState || QuickSwitcherState.CLOSED,
    isCardDetailsModalOpen: Boolean(openedCardDetailsModalId && isCurrentUserAuthenticated),
    isGuestProfileModalOpen: Boolean(openedGuestDeactivateModalUserId && isCurrentUserAuthenticated),
    isWorkspaceModalOpen,
    isGuestProfileModalDeactivating,
    isUserStatusModalOpen,
    isCurrentUserAuthenticated,
    openedCardDetailsModalId,
    openedReactivateUserModalId,
    openedGuestDeactivateModalUserId,
    openedMeetModalId,
    addUsersToProjectModalProjectId,
  }
}
