import React, { CSSProperties, FC, useEffect } from 'react';

import { Placement } from '@popperjs/core';
import ReactResizeDetector from 'react-resize-detector';
import { Transition } from 'react-transition-group';

import { AnyDict } from 'common/types';
import PopperPortal from 'commonComponents/PopperPortal';
import useUniversalPopover from 'hooks/useUniversalPopover';

import { usePopoverOpenContext } from './PopoverOpenContext';
import componentStyles from './styles.css';

export interface PopperTransitionStyle {
  entering: CSSProperties;
  entered: CSSProperties;
  exiting: CSSProperties;
  exited: CSSProperties;
}

type UniversalPopoverInterface = {
  targetComponent: JSX.Element;
  isPopoverOpened?: boolean;
  shouldRenderArrow?: boolean;
  targetClassName?: string;
  arrowClassName?: string;
  popperContentWrapperClassName?: string;
  scrollContainerId?: string;
  popperComponent: JSX.Element;
  popperModifiers?: AnyDict;
  popperPlacement?: Placement;
  hasDarkBackground?: boolean;
  popperTransitionStyles?: PopperTransitionStyle;
  popperArrowFillClassName?: string;
  popperArrowShadowClassName?: string;

  transitionProperty?: string;
  transitionDuration?: number;
};

const defaultProps: Partial<UniversalPopoverInterface> = {
  isPopoverOpened: false,
  shouldRenderArrow: true,
  targetClassName: '',
  popperPlacement: 'bottom',
  popperTransitionStyles: {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  },
  hasDarkBackground: false,
  transitionProperty: 'opacity',
  transitionDuration: 150,
};

const UniversalPopover: FC<UniversalPopoverInterface> = (props) => {
  const { popperData, onSetArrowElement, onSetPopperElement, onSetReferenceElement } = useUniversalPopover(
    props.popperModifiers,
    props.shouldRenderArrow,
    props.popperPlacement,
    props.scrollContainerId
  );

  const { styles, attributes, update } = popperData;

  const { setIsOpen } = usePopoverOpenContext();
  useEffect(() => {
    setIsOpen?.(props.isPopoverOpened);
  }, [props.isPopoverOpened, setIsOpen]);

  return (
    <>
      <span className={props.targetClassName} ref={onSetReferenceElement}>
        {props.targetComponent}
      </span>
      {renderTransition()}
    </>
  );

  function renderTransition() {
    const isReactComponent = typeof props.popperComponent.type === 'function';

    return (
      <Transition in={props.isPopoverOpened} timeout={props.transitionDuration} mountOnEnter unmountOnExit>
        {(transitionState) => (
          <PopperPortal>
            <div
              className={componentStyles.popover}
              ref={onSetPopperElement}
              style={{
                ...props.popperTransitionStyles[transitionState],
                transitionProperty: props.transitionProperty,
                transitionDuration: `${props.transitionDuration}ms`,
                ...styles.popper,
              }}
              {...attributes.popper}
            >
              {props.shouldRenderArrow && renderArrow()}
              <div
                className={
                  props.popperContentWrapperClassName ||
                  (props.hasDarkBackground ? componentStyles.popoverContentDark : componentStyles.popoverContent)
                }
              >
                {isReactComponent ? React.cloneElement(props.popperComponent) : props.popperComponent}
              </div>
              <ReactResizeDetector handleWidth handleHeight onResize={update} />
            </div>
          </PopperPortal>
        )}
      </Transition>
    );
  }

  function renderArrow() {
    return (
      <>
        <div
          ref={onSetArrowElement}
          style={styles.arrow}
          data-popper-arrow
          key={'fill'}
          className={`
      ${componentStyles.popoverArrow} 
      ${props.popperArrowFillClassName ||
            (props.hasDarkBackground ? componentStyles.popoverArrowFillDark : componentStyles.popoverArrowFill)
            } 
    `}
        />
        <div
          style={styles.arrow}
          data-popper-arrow
          className={`
            ${componentStyles.arrowOverflow}
            ${props.hasDarkBackground ? componentStyles.overflowDark : ''}
            ${props.arrowClassName}
          `}
        />
      </>
    );
  }
};

UniversalPopover.defaultProps = defaultProps;

export default UniversalPopover;
