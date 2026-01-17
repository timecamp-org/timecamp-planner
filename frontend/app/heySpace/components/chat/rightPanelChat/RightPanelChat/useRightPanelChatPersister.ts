import { useContext } from "react"
import { RightPanelContext } from './context'

type RightPanelChatPersisterHookInterface = {
  isRightPanelChatOpen: boolean,
  onSetIsRightPanelChatOpen: (isOpen: boolean) => void,
  onOpenRightPanelChat: VoidFunction,
}

export default function useRightPanelChatPersister(): RightPanelChatPersisterHookInterface {
  const { isRightPanelChatOpen, onOpenRightPanelChat, onSetIsRightPanelChatOpen } = useContext(RightPanelContext)
  return {
    isRightPanelChatOpen,
    onSetIsRightPanelChatOpen,
    onOpenRightPanelChat,
  }
}