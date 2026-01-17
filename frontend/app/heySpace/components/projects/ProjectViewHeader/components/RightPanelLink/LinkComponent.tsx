import React, { useState } from 'react';

import NavLink from 'commonComponents/NavLink';
import SecondaryButton from 'components/buttons/SecondaryButton';
import styles from '../../styles.css';

export type LinkComponentProps = React.PropsWithChildren<{
  onSetIsHovering: (isHovering: boolean) => void;
  to?: string;
  onClick: () => void;
  isActive: boolean;
}>;

const LinkComponent: React.FC<LinkComponentProps> = ({ onSetIsHovering, isActive, onClick, children, to }) => (
  <NavLink className={styles.navLink} to={to} onClick={onClick}>
    <SecondaryButton
      className={styles.link}
      shouldFillContentWithColor={isActive}
      onMouseEnter={() => onSetIsHovering(true)}
      onMouseLeave={() => onSetIsHovering(false)}
    >
      {children}
    </SecondaryButton>
  </NavLink>
);

export default LinkComponent;
