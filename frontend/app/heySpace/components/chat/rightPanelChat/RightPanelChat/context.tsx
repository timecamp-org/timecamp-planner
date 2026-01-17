import React, { createContext, useCallback, useEffect, useMemo } from 'react';
import { doNothing } from 'common/utils';
import useElementOpen from 'common/hooks/useElementOpen';
import { getIsRightPanelOpened, onSetIsRightPanelOpened } from './isRightPanelOpenedController';
import { Id } from 'common/utils/identifier';

export type RightPanelContextInterface = {
  isRightPanelChatOpen: boolean;
  onSetIsRightPanelChatOpen: (isOpen: boolean) => void;
  onOpenRightPanelChat: VoidFunction;
};

export const RightPanelContext = createContext<RightPanelContextInterface>({
  isRightPanelChatOpen: false,
  onSetIsRightPanelChatOpen: doNothing,
  onOpenRightPanelChat: doNothing,
});

export const RightPanelProvider: React.FC<React.PropsWithChildren<{ projectId: Id }>> = ({ children, projectId }) => {
  const { isOpen, onSetIsOpen } = useElementOpen(getIsRightPanelOpened(projectId));

  const onSetIsRightPanelChatOpen = useCallback(
    (isRightPanelChatOpen) => {
      onSetIsRightPanelOpened(projectId, isRightPanelChatOpen);
      onSetIsOpen(isRightPanelChatOpen);
    },
    [projectId, onSetIsOpen],
  );

  useEffect(() => {
    onSetIsOpen(getIsRightPanelOpened(projectId));
  }, [projectId, onSetIsOpen]);

  const onOpenRightPanelChat = useCallback(() => onSetIsRightPanelChatOpen(true), [onSetIsRightPanelChatOpen]);

  const value: RightPanelContextInterface = useMemo(
    () => ({
      isRightPanelChatOpen: isOpen,
      onSetIsRightPanelChatOpen,
      onOpenRightPanelChat,
    }),
    [isOpen, onOpenRightPanelChat, onSetIsRightPanelChatOpen],
  );

  return <RightPanelContext.Provider value={value}>{children}</RightPanelContext.Provider>;
};
