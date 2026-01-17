import React, { useContext } from 'react';

import { UserTracker } from 'common/services';
import { CloseMobileSidebarButton } from 'components/responsive/CloseMobileSidebarButton';
import { useResponsiveContext } from 'components/responsive/ResponsiveContext';

import { ChevronLeft } from '../../common/Icons/fontawesome/ChevronLeft';
import { SidebarContext } from '../Sidebar/context';

import { TrackingEvent } from './constants';
import styles from './styles.css';

export type Props = {
  className?: string;
  shouldShowBadge?: boolean;
};

const SidebarToggle: React.FC<Props> = ({ className, shouldShowBadge = true }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { isCollapsed, onToggleSidebarSize } = useContext(SidebarContext);
  const { isDesktop } = useResponsiveContext();
  const onClick = () => {
    onToggleSidebarSize();
    UserTracker.track(TrackingEvent.SIDEBAR_TOGGLE_CLICKED, { isCollapsed: !isCollapsed });
  };

  return (
    <>
      {isDesktop ? (
        <div className={className || styles.iconWrapper} onClick={onClick}>
          <ChevronLeft className={`${isCollapsed && styles.collapsed}`} color="var(--color-gray-500)" />
        </div>
      ) : (
        <div className={styles.iconWrapper}>
          <CloseMobileSidebarButton />
        </div>
      )}
    </>
  );
};

export default SidebarToggle;
