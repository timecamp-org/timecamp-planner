import React, { useState } from 'react';
import styles from './styles.css';
import commonStyles from 'styles/common.css';

import InfoTooltip from 'commonComponents/InfoTooltip';

export type TooltipedDisabledElementInterface = {
  message: string;
  isDisabled: boolean;
  className?: string;
};

const TooltipedDisabledElement: ReactFCWithChildren<TooltipedDisabledElementInterface> = (props) => {
  const { children, message, isDisabled, className } = props;
  const [isHovering, onSetIsHovering] = useState(false);

  if (!isDisabled) {
    return <>{children}</>;
  }
  return (
    <InfoTooltip
      shouldRenderInfoTooltip={isHovering}
      infoTooltipWrapperClassName={styles.infoTooltip}
      targetWrapperClassName={className}
      popperPlacement={'bottom'}
      targetComponent={
        <div onMouseEnter={() => onSetIsHovering(true)} onMouseLeave={() => onSetIsHovering(false)}>
          {children}
        </div>
      }
      popperModifiers={{
        offset: {
          offset: `0, ${commonStyles.gridCellSize}`,
        },
      }}
      message={message}
    />
  );
};

export default TooltipedDisabledElement;
