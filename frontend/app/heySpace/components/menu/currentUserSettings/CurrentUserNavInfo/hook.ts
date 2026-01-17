import { Id } from 'common/utils/identifier'
import { useDataProvider, useDataPersister } from 'components/menu/currentUserSettings/CurrentUserNavInfo/dataHooks'
import useElementOpen from 'common/hooks/useElementOpen'
import { RefObject, useCallback, useRef } from 'react'
import useOnPopoverClickOutside from 'hooks/useOnPopoverClickOutside'

export type CurrentUserNavInfoHookInterface = {
  isPopoverOpened: boolean,
  currentUserId: Id,
  popoverTargetRef: RefObject<HTMLDivElement>

  shouldRenderAddWorkspaceButton: boolean,
  shouldRenderToggleWorkspace: boolean,
  isSubscriptionSettingsAvailable: boolean,
  isAddonsSettingsAvailable: boolean,
  isWorkspacesPanelVisible: boolean,

  onToggleIsPopoverVisible: VoidFunction,
  onSetIsWorkspaceModalOpen: (isOpen: boolean) => void,
  onToggleWorkspacesPanel: VoidFunction,
  onClickAddWorkspaceButton: VoidFunction,
}

export const useComponent = (): CurrentUserNavInfoHookInterface => {
  const {
    currentUserId,

    shouldRenderAddWorkspaceButton,
    shouldRenderToggleWorkspace,

    isSubscriptionSettingsAvailable,
    isAddonsSettingsAvailable,
    isWorkspacesPanelVisible,
  } = useDataProvider()

  const {
    onSetIsWorkspaceModalOpen,
    onSetIsWorkspacesPanelVisible,
  } = useDataPersister()

  const {
    isOpen: isPopoverOpened,
    onClose: onClosePopover,
    onToggleOpen: onToggleIsPopoverVisible,
  } = useElementOpen(false)
  const popoverTargetRef: RefObject<HTMLDivElement> = useRef(null)
  useOnPopoverClickOutside(popoverTargetRef, onClosePopover)

  const onToggleWorkspacesPanel = useCallback(() => {
    onSetIsWorkspacesPanelVisible(!isWorkspacesPanelVisible)
  }, [onSetIsWorkspacesPanelVisible, isWorkspacesPanelVisible])

  const onClickAddWorkspaceButton = useCallback(() => {
    onSetIsWorkspaceModalOpen(true)
    onToggleIsPopoverVisible()
  }, [onToggleIsPopoverVisible, onSetIsWorkspaceModalOpen])


  return {
    isPopoverOpened,
    currentUserId,
    popoverTargetRef,

    shouldRenderAddWorkspaceButton,
    shouldRenderToggleWorkspace,
    isSubscriptionSettingsAvailable,
    isAddonsSettingsAvailable,
    isWorkspacesPanelVisible,

    onToggleIsPopoverVisible,
    onSetIsWorkspaceModalOpen,
    onToggleWorkspacesPanel,
    onClickAddWorkspaceButton,
  }
}
