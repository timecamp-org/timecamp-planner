import React from 'react';

import { Placement } from '@popperjs/core';

import UniversalPopover from 'commonComponents/UniversalPopover';
import {
  useComponent
} from 'components/menu/currentUserSettings/CurrentUserNavInfo/hook';

import CurrentUserDropdown from '../CurrentUserDropdown';

import styles from './styles.css';
import { UserSettingsButton } from './UserSettingsButton';

interface CurrentUserNavInfoInterface {
  direction?: 'vertical' | 'horizontal';
  isCollapsed?: boolean;
}

const CurrentUserNavInfo: React.FC<CurrentUserNavInfoInterface> = ({ direction = 'horizontal', isCollapsed }) => {
  const hook = useComponent();

  const popoverProps = {
    popperPlacement: direction === 'horizontal' ? 'top' : 'left',
  };

  return (
    <UniversalPopover
      isPopoverOpened={hook.isPopoverOpened}
      targetComponent={
        <div ref={hook.popoverTargetRef}>
          <UserSettingsButton
            isActive={hook.isPopoverOpened}
            onClick={hook.onToggleIsPopoverVisible}
            userId={hook.currentUserId}
            isCollapsed={isCollapsed}
          />
        </div>
      }
      popperComponent={<CurrentUserDropdown onClose={hook.onToggleIsPopoverVisible} />}
      popperContentWrapperClassName={styles.popperContent}
      popperPlacement={popoverProps.popperPlacement as Placement}
      popperModifiers={{
        offset: {
          offset: `0, 10`,
        },
      }}
      transitionDuration={0}
    />
  );
};
export default CurrentUserNavInfo;
