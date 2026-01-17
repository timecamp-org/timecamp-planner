import React, { FC } from 'react';
import componentStyles from './styles.css';

import PopperPortal from 'commonComponents/PopperPortal';
import { Transition } from 'react-transition-group';
import { AnyDict } from 'common/types';
import { PopperTransitionStyle } from '../UniversalPopover';
import { Placement } from '@popperjs/core';
import useUniversalPopover from 'hooks/useUniversalPopover';

type InfoTooltipInterface = {
  infoTooltipWrapperClassName?: string;
  targetWrapperClassName?: string;
  messageClassName?: string;
  shouldRenderInfoTooltip?: boolean;
  targetComponent: JSX.Element;
  title?: string | JSX.Element;
  message?: string | JSX.Element;
  popperPlacement?: Placement;
  popperTransitionStyles?: PopperTransitionStyle;
  popperModifiers?: AnyDict;
  transitionProperty?: string;
  transitionDuration?: number;
  shouldRenderArrow?: boolean;
};

const defaultProps: Partial<InfoTooltipInterface> = {
  shouldRenderInfoTooltip: false,
  title: '',
  message: '',
  popperPlacement: 'left',
  popperTransitionStyles: {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  },
  transitionProperty: 'opacity',
  transitionDuration: 300,
  shouldRenderArrow: true,
};

const InfoTooltip: ReactFCWithChildren<InfoTooltipInterface> = (props) => {
  const { popperData, onSetArrowElement, onSetPopperElement, onSetReferenceElement } = useUniversalPopover(
    props.popperModifiers,
    props.shouldRenderArrow,
    props.popperPlacement,
  );

  const { styles, attributes } = popperData;

  return (
    <>
      <div ref={onSetReferenceElement} className={props.targetWrapperClassName}>
        {props.targetComponent}
      </div>
      <Transition in={props.shouldRenderInfoTooltip} timeout={props.transitionDuration} mountOnEnter unmountOnExit>
        {(transitionState) => (
          <PopperPortal popperRootId={'info-popper-root'}>
            <div
              className={props.infoTooltipWrapperClassName || componentStyles.infoTooltipBody}
              role="tooltip"
              ref={onSetPopperElement}
              style={{
                ...props.popperTransitionStyles[transitionState],
                transitionProperty: props.transitionProperty,
                transitionDuration: `${props.transitionDuration}ms`,
                ...styles.popper,
              }}
              {...attributes.popper}
            >
              {props.shouldRenderArrow && (
                <div ref={onSetArrowElement} className={componentStyles.popoverArrow} data-popper-arrow />
              )}

              {props.title && <div className={componentStyles.infoTooltipTitle}>{props.title}</div>}
              {props.message && (
                <div className={props.messageClassName || componentStyles.infoTooltipMessage}>{props.message}</div>
              )}
            </div>
          </PopperPortal>
        )}
      </Transition>
    </>
  );
};

InfoTooltip.defaultProps = defaultProps;

export default InfoTooltip;
