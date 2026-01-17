import { FC, MouseEventHandler } from 'react';

import Dotdotdot from 'react-dotdotdot';
import { Link } from 'react-router-dom';

import { getConditionalClass } from 'utils/getConditionalClass';

import styles from './styles.css';

type TabNavButtonInterface = {
  className?: string;
  to: string;
  color?: string;
  shouldTruncateText?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const TabNavButton: ReactFCWithChildren<TabNavButtonInterface> = ({
  isDisabled,
  isActive,
  to,
  children,
  className,
  color,
  onClick,
  shouldTruncateText,
}) => (
  <Link
    className={`
        ${className || styles.navLinkButton}
        ${getConditionalClass(styles.disabled, isDisabled)}
        ${getConditionalClass(styles.active, isActive)}
      `}
    onClick={onClick}
    to={to}
    color={color}
  >
    {shouldTruncateText ? (
      <Dotdotdot clamp={1} useNativeClamp>
        {children}
      </Dotdotdot>
    ) : (
      children
    )}
  </Link>
);

export default TabNavButton;
