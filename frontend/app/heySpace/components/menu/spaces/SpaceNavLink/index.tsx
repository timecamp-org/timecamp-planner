import React, { memo } from 'react';

import { NavSidebarButtonLayout } from 'commonComponents/Layouts/Navigation';
import { PrivateProjectBadge } from 'commonComponents/PrvateProjectBadge';
import NavButton from 'components/buttons/NavButton/NavButton';

import Badge from '../../../common/Badge';
import { BadgeNotificationType } from '../../../common/Badge/types';
import ColoredProjectIcon from '../../../common/ColoredProjectIcon';
import ProjectName from '../../../projects/projectName/ProjectName';

import { useComponent } from './hook';
import styles from './styles.css';

export interface SpaceNavLinkInterface {
  spaceId: string;
  isSelected?: boolean;
  className?: string;
  maxTextLength?: number;
}

const defaultProps: Partial<SpaceNavLinkInterface> = {
  isSelected: false,
  maxTextLength: 25,
};

const SpaceNavLink: React.FC<SpaceNavLinkInterface> = (props) => {
  const hook = useComponent(props);

  return (
    <NavButton isActive={props.isSelected} to={hook.url} ref={hook.innerRef}>
      <NavSidebarButtonLayout
        icon={
          <div className={styles.iconSizeWrapper}>
            <ColoredProjectIcon
              className={hook.isMuted ? styles.mutedProjectIcon : undefined}
              projectId={props.spaceId}
              isPrivateClassName={styles.isPrivateClassName}
              size="lg"
            />
          </div>
        }
        text={
          <>
            <ProjectName
              projectId={props.spaceId}
              className={
                hook.isMuted
                  ? styles.mutedProjectName
                  : hook.projectHasUnreadMessages
                    ? styles.unreadMessagesProjectName
                    : styles.projectName
              }
              maxLength={props.maxTextLength}
            />
            <div className={styles.linkInfoSection}>
              <PrivateProjectBadge projectId={props.spaceId} />
              <Badge objectId={props.spaceId} objectType={BadgeNotificationType.PROJECT} className={styles.badge} />
            </div>
          </>
        }
      />
    </NavButton>
  );
};

SpaceNavLink.defaultProps = defaultProps;

export default memo(SpaceNavLink);
