import { FC, ReactNode, useRef, useState } from 'react';

import { Button } from '@mui/material';
import { Placement } from '@popperjs/core';

import { useKeyboard } from 'common/hooks/useKeyBoard';
import { AnyDict } from 'common/types';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import useOnPopoverClickOutside from 'hooks/useOnPopoverClickOutside';

import { ActivatableButton } from '../ActivableButton/ActivableButton';

import styles from './styles.css';

type Renderer = (props: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) => JSX.Element;

interface ButtonPopoverInterface {
  targetContent?: ReactNode;
  targetRenderer?: Renderer;
  popperComponent?: ReactNode;
  popperComponentRenderer?: Renderer;
  popperContentWrapperClassName?: string;
  targetClassName?: string;
  buttonClassName?: string;
  popperPlacement?: Placement;
  popperModifiers?: AnyDict;
  showCloseButton?: boolean;
  buttonDashed?: boolean;
  shouldRenderArrow?: boolean;
  arrowClassName?: string;
}

const DEFAULT_POPPER_MODIFIERS = {
  offset: {
    offset: `50%, 5px`,
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

export const ButtonPopover: FC<ButtonPopoverInterface> = ({
  targetRenderer,
  targetContent,
  popperComponent,
  popperComponentRenderer,
  targetClassName,
  buttonClassName,
  buttonDashed,
  popperContentWrapperClassName,
  popperPlacement,
  popperModifiers = DEFAULT_POPPER_MODIFIERS,
  showCloseButton,
  shouldRenderArrow = true,
  arrowClassName,
}) => {
  const popoverRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useOnPopoverClickOutside(popoverRef, () => {
    setIsOpen(false);
  });

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((o) => !o);

  useKeyboard({ onEsc: onClose });

  return (
    //@ts-ignore
    <PopoverContent isVisible={isOpen} onClickOutside={onToggle}>
      <UniversalPopover
        targetClassName={targetClassName}
        popperContentWrapperClassName={popperContentWrapperClassName}
        isPopoverOpened={isOpen}
        targetComponent={
          targetRenderer?.({ isOpen, onOpen, onClose, onToggle }) || (
            <ActivatableButton isDashed={buttonDashed} isActive={isOpen} className={buttonClassName} onClick={onToggle}>
              {targetContent}
            </ActivatableButton>
          )
        }
        popperComponent={
          popperComponentRenderer?.({ isOpen, onOpen, onClose, onToggle }) || (
            <div ref={popoverRef} className={styles.content}>
              <>
                {showCloseButton && (
                  <Button variant="text-reversed" className={styles.button} onClick={onClose}>
                    <Xmark />
                  </Button>
                )}
                {popperComponent}
              </>
            </div>
          )
        }
        popperPlacement={popperPlacement}
        popperModifiers={popperModifiers}
        shouldRenderArrow={shouldRenderArrow}
        arrowClassName={arrowClassName}
      />
    </PopoverContent>
  );
};
