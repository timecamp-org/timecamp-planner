import React, { memo } from 'react';

import { List } from 'immutable';

import { whiteFourColor } from 'common/commonStyles/colors';
import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import { BadgeNotificationType } from 'commonComponents/Badge/types';
import HoveredUserStatusTooltip from 'commonComponents/HoveredUserStatusTooltip';
import { EyeSlash } from 'commonComponents/Icons/fontawesome/EyeSlash';
import { NavSidebarButtonLayout } from 'commonComponents/Layouts/Navigation';
import UserStatusEmoji from 'commonComponents/UserStatusEmoji';
import NavButton from 'components/buttons/NavButton/NavButton';
import DirectChatNavLinkBottomLabel from 'components/menu/team/DirectChatNavLinkBottomLabel/index';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';

import { useComponent } from './hook';
import styles from './styles.css';

const MAX_USER_NAME_LENGTH = 22;

export type DirectChatNavLinkInterface = {
  className?: string;
  conversationId: string;
  isSelected?: boolean;
  people: List<Id>;
};

const defaultProps = {
  className: '',
  isSelected: false,
};

const DirectChatNavLink: React.FC<DirectChatNavLinkInterface> = (props: DirectChatNavLinkInterface): JSX.Element => {
  const {
    currentUserId,
    conversationUserId,
    isConversationWithBot,
    projectId,
    isUserActive,
    projectHasUnreadMessages,
    onHideConversation,
    innerRef,
    onClick,
    userName,
  } = useComponent(props);

  const shouldShowNameTooltip = MAX_USER_NAME_LENGTH < userName.length;

  return (
    <HoveredUserStatusTooltip userId={conversationUserId} offset={'0, 5'} showUserName={shouldShowNameTooltip}>
      <NavButton
        isActive={props.isSelected}
        ref={innerRef}
        onClick={onClick}
        className={styles.hover}
        shouldTruncateText
      >
        <>
          <NavSidebarButtonLayout
            icon={<PersonIcon userId={conversationUserId} className={styles.avatar} width={25} height={25} />}
            text={
              <div className={styles.wrapper}>
                <div className={styles.personFullNameWithHint}>
                  <div className={styles.personFullNameWithStatusEmoji}>
                    <PersonFullName
                      className={` 
                  ${isUserActive ? styles.personFullName : styles.deactivated}
                  ${projectHasUnreadMessages ? styles.unreadMessages : ''}
                `}
                      userId={conversationUserId}
                      shouldAddYouInParenthesesIfCurrent={conversationUserId === currentUserId}
                      maxNameLength={MAX_USER_NAME_LENGTH}
                    />
                    <UserStatusEmoji
                      userId={conversationUserId}
                      // @ts-ignore
                      size={14}
                      className={styles.userStatusEmoji}
                    />
                  </div>
                  {!isConversationWithBot && <DirectChatNavLinkBottomLabel conversationUserId={conversationUserId} />}
                </div>
                {projectId && (
                  <Badge
                    objectId={projectId}
                    objectType={BadgeNotificationType.CONVERSATION}
                    className={styles.badge}
                    color={whiteFourColor}
                    altElementWrapperClass={styles.iconWrapper}
                    altElement={
                      <div onClick={onHideConversation}>
                        <EyeSlash />
                      </div>
                    }
                  />
                )}
              </div>
            }
          />
        </>
      </NavButton>
    </HoveredUserStatusTooltip>
  );
};

DirectChatNavLink.defaultProps = defaultProps;

export default memo(DirectChatNavLink);
