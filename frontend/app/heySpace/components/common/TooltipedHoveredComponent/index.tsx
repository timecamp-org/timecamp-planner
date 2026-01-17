import React, { MouseEventHandler, ReactNode, RefObject } from 'react';
import useOnHover from 'hooks/useOnHover';
import styles from './styles.css';
import commonStyles from 'styles/common.css';

import InfoTooltip from 'commonComponents/InfoTooltip';
import { Placement } from '@popperjs/core';

type TooltipedHoveredComponentInterface = {
  message: string;
  popperPlacement?: Placement;
  className?: string;
  targetInnerClassName?: string;
  offset?: string;
  isDisabled?: boolean;
  isTooltipVisible?: boolean;
  targetRef?: RefObject<HTMLDivElement>;
};

const defaultProps: Partial<TooltipedHoveredComponentInterface> = {
  popperPlacement: 'bottom',
  offset: `0, ${commonStyles.gridCellSize}`,
  isDisabled: false,
  isTooltipVisible: true,
};

const TooltipedHoveredComponent: ReactFCWithChildren<TooltipedHoveredComponentInterface> = ({
  children,
  message,
  className,
  targetInnerClassName,
  popperPlacement,
  offset,
  isDisabled,
  isTooltipVisible,
  targetRef,
}) => {
  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover(false);
  const shouldRenderInfoTooltip = !isDisabled && isHovering && isTooltipVisible;

  return (
    <InfoTooltip
      shouldRenderInfoTooltip={shouldRenderInfoTooltip}
      infoTooltipWrapperClassName={styles.infoTooltip}
      targetWrapperClassName={className}
      popperPlacement={popperPlacement}
      targetComponent={renderTarget(targetInnerClassName, onMouseEnter, onMouseLeave, children, isHovering, targetRef)}
      popperModifiers={{
        offset: {
          offset,
        },
        preventOverflow: {
          boundariesElement: 'window',
        },
      }}
      message={message}
    />
  );
};

function renderTarget(
  targetInnerClassName: string,
  onMouseEnter: MouseEventHandler<HTMLDivElement>,
  onMouseLeave: MouseEventHandler<HTMLDivElement>,
  children: ReactNode | ((isHovering: boolean) => React.ReactNode),
  isHovering: boolean,
  targetRef: RefObject<HTMLDivElement>,
) {
  return (
    <div className={targetInnerClassName} ref={targetRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {typeof children === 'function' ? children(isHovering) : children}
    </div>
  );
}

TooltipedHoveredComponent.defaultProps = defaultProps;

export default TooltipedHoveredComponent;
