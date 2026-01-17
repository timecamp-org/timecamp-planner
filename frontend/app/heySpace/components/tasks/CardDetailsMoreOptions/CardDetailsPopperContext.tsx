import React, {
  createContext,
  MouseEventHandler,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import useOnPopoverClickOutside from 'hooks/useOnPopoverClickOutside';

type ContentType = 'default' | 'copyCard';

export interface UsePopperInterface {
  taskId: Id;
  onSetIsPopperOpen?: (isOpen: boolean) => void;
  onAction: () => void;
}

export const usePopover = ({ onSetIsPopperOpen, taskId, onAction }: UsePopperInterface) => {
  const popoverRef = useRef<HTMLElement>();
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('default');

  useLayoutEffect(() => {
    popoverRef.current = document.getElementById('popper-root');
  }, []);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isMoveAndUnarchiveModalOpen, showIsMoveAndUnarchiveModalOpen] = useState(false);

  useEffect(() => {
    onSetIsPopperOpen?.(isPopperOpen);
  }, [isPopperOpen, onSetIsPopperOpen]);

  useOnPopoverClickOutside(popoverRef, () => {
    closePopper();
    onSetIsPopperOpen?.(false);
  });

  const resetContent = () => {
    setContentType('default');
  };

  const changeContentType = (newContentType: ContentType) => {
    setContentType(contentType);
  };

  function closePopper() {
    setIsPopperOpen(false);
    onSetIsPopperOpen?.(false);
  }

  const onOpenPopper: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev?.stopPropagation();
    setIsPopperOpen(true);
  };

  const onTogglePopper = () => {
    setIsPopperOpen((val) => !val);
  };

  const onTargetClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    onTogglePopper();
  };

  const navigateToCopyCard = () => {
    setContentType('copyCard');
  };

  const showArchiveModal = () => {
    setIsArchiveModalOpen(true);
    closePopper();
  };
  const showMoveAndUnarchiveModal = () => {
    showIsMoveAndUnarchiveModalOpen(true);
    closePopper();
  };

  const hideArchiveModal = () => {
    setIsArchiveModalOpen(false);
    closePopper();
    onAction();
  };

  const hideMoveAndUnarchiveModal = () => {
    showIsMoveAndUnarchiveModalOpen(false);
    closePopper();
    onAction();
  };

  return {
    taskId,
    isPopperOpen,
    contentType,
    isArchiveModalOpen,
    isMoveAndUnarchiveModalOpen,
    onOpenPopper,
    closePopper,
    changeContentType,
    resetContent,
    navigateToCopyCard,
    onTogglePopper,
    onTargetClick,
    onAction,
    onSetIsPopperOpen,
    showArchiveModal,
    showMoveAndUnarchiveModal,
    hideArchiveModal,
    hideMoveAndUnarchiveModal,
  };
};

type PopperContextType = ReturnType<typeof usePopover>;

const PopperContext = createContext<PopperContextType>(null as PopperContextType);

export const PopperContextProvider: ReactFCWithChildren<UsePopperInterface> = ({
  onAction = doNothing,
  onSetIsPopperOpen,
  taskId,
  children,
}) => {
  const value = usePopover({
    taskId,
    onSetIsPopperOpen: onSetIsPopperOpen,
    onAction,
  });

  return <PopperContext.Provider value={value}>{children}</PopperContext.Provider>;
};
export const PopperContextConsumer = PopperContext.Consumer;

export const usePopperContext = () => useContext(PopperContext);
