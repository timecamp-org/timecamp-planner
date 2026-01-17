import { FC, memo, useState } from 'react';

import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import { EyeSlash } from 'commonComponents/Icons/fontawesome/EyeSlash';
import { NavSidebarButtonLayout } from 'commonComponents/Layouts/Navigation';
import NavButton from 'components/buttons/NavButton/NavButton';
import colors from 'styles/colors.css';
import { getConditionalClass } from 'utils/getConditionalClass';

import { BadgeNotificationType } from '../../../common/Badge/types';
import ProjectConversationNames from '../../../projects/ProjectConversationNames';
import ProjectIcon from '../../../projects/ProjectIcon';

import useComponent from './hook';
import styles from './styles.css';

export type GroupChatNavLinkInterface = {
  conversationId: Id;
  className?: string;
  buttonShadeClassName?: string;
  isSelected?: boolean;
};

const defaultProps = {};

const GroupChatNavLink: FC<GroupChatNavLinkInterface> = (props) => {
  const hook = useComponent(props);
  const [notificationCount, setNotificationCount] = useState(0);

  return (
    <NavButton
      isActive={props.isSelected}
      ref={hook.innerRef}
      onClick={hook.onClick}
      className={styles.hover}
      shouldTruncateText
    >
      <NavSidebarButtonLayout
        className={styles.layout}
        icon={<ProjectIcon projectId={hook.projectId} className={styles.conversationIcon} />}
        text={
          <>
            <ProjectConversationNames
              shouldTruncateText
              projectId={hook.projectId}
              className={`
                  ${styles.personFullName}
                  ${getConditionalClass(styles.unreadMessages, !!notificationCount)}
                `}
            />
            <Badge
              objectId={hook.projectId}
              objectType={BadgeNotificationType.CONVERSATION}
              className={styles.badge}
              color={colors.whiteFourColor}
              onCounterChange={setNotificationCount}
              altElement={
                <div className={styles.iconWrapper} onClick={hook.onHideConversation}>
                  <EyeSlash />
                </div>
              }
            />
          </>
        }
      />
    </NavButton>
  );
};

GroupChatNavLink.defaultProps = defaultProps;

export default memo(GroupChatNavLink);
