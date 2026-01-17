import { FC } from 'react';

import { getConditionalClass } from 'utils/getConditionalClass';

import styles from './styles.css';

type SidebarActionButtonInterface = {
  className?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
};

export const SidebarActionButton: ReactFCWithChildren<SidebarActionButtonInterface> = ({
  className,
  isActive,
  isDisabled,
  children,
  onClick,
  isCollapsed,
}) => (
  <div className={isCollapsed ? styles.collapsedWrapper : styles.wrapper}>
    <button
      className={`${styles.button} ${className}
            ${getConditionalClass(styles.collapsed, isCollapsed)}
            ${getConditionalClass(styles.active, isActive)} 
            ${getConditionalClass(styles.disabled, isDisabled)}
            `}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  </div>
);
