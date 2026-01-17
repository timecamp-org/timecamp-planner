import React, { useState } from 'react';

import { ChevronDown, ChevronUp } from 'commonComponents/Icons';
import SecondaryButton from 'components/buttons/SecondaryButton';

import styles from './styles.css';

type CollapsablePanelInteface = {
  className?: string;
  icon?: React.ReactElement;
  title: string | React.ReactElement;
  description?: string | React.ReactElement;
  isInitiallyExpanded?: boolean;
};

export const CollapsablePanel: ReactFCWithChildren<CollapsablePanelInteface> = ({
  className,
  title,
  description,
  icon,
  isInitiallyExpanded,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  return (
    <div className={`${styles.panel} ${isExpanded || styles.panelCollapsed} ${className}`}>
      <div className={styles.panelHeader}>
        {icon}
        <div className={styles.panelHeaderText}>{title}</div>
        <SecondaryButton onClick={() => setIsExpanded((prevIsExpanded) => !prevIsExpanded)} className={styles.chevron}>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </SecondaryButton>
      </div>
      {children}
      <div className={styles.description}>{description}</div>
    </div>
  );
};
