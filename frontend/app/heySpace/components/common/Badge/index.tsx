import React, { ReactNode, RefObject } from 'react';

import { NotificationType } from 'models/domain/NotificationsModel/types';

import { Id } from '../../../../common/utils/identifier';

import { useComponent } from './hook';
import styles from './styles.css';
import { BadgeNotificationType } from './types';

export interface BadgeInterface {
  className?: string;
  counter?: number;
  color?: string;
  innerRef?: RefObject<HTMLDivElement>;
  showDotOnly?: boolean;
  objectType: BadgeNotificationType;
  includedNotificationTypes?: NotificationType[];
  objectId?: Id;
  altElement?: ReactNode;
  altElementWrapperClass?: string;
  onCounterChange?: (counter: number) => void;
}

const defaultProps = {
  counter: 0,
  showDotOnly: false,
};

const Badge: React.FC<BadgeInterface> = (props) => {
  const hook = useComponent(props);
  if (hook.counter <= 0) {
    return (
      <div ref={hook.innerRef} className={props.altElementWrapperClass}>
        {props?.altElement}
      </div>
    );
  } else {
    return (
      <div
        ref={hook.innerRef}
        className={`
            ${props.className ? props.className : styles.defaultStyle}
            `}
      >
        {props.showDotOnly ? null : hook.counter}
      </div>
    );
  }
};

Badge.defaultProps = defaultProps;

export default Badge;
