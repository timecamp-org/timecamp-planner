import { MouseEventHandler } from 'react';

import useElementOpen from 'common/hooks/useElementOpen';
import useOnHover from 'hooks/useOnHover';

type MessageHookInterface = {
  shouldRenderMessageActionButtons: boolean;
  isHovering: boolean;
  isMoreOptionsOpen: boolean;
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  onClickConvertMessageButton: VoidFunction;
  onCloseConvertMessagePopover: VoidFunction;
  onOpenMoreOptions: VoidFunction;
  onCloseMoreOptions: VoidFunction;
};

export default function useComponent(): MessageHookInterface {
  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover(false);
  const { isOpen: isMoreOptionsOpen, onOpen: onOpenMoreOptions, onClose: onCloseMoreOptions } = useElementOpen();
  const {
    isOpen: isConvertToTaskPopoverVisible,
    onClose: onCloseConvertMessagePopover,
    onToggleOpen: onClickConvertMessageButton,
  } = useElementOpen(false);

  return {
    shouldRenderMessageActionButtons: isHovering || isConvertToTaskPopoverVisible || isMoreOptionsOpen,
    isMoreOptionsOpen,
    isHovering,
    onMouseEnter,
    onMouseLeave,
    onClickConvertMessageButton,
    onCloseConvertMessagePopover,
    onOpenMoreOptions,
    onCloseMoreOptions,
  };
}
