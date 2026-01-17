import { FC, useState } from 'react';

import styled from 'styles/styled';
import { Box, SxProps } from '@mui/material';
import { useSelector } from 'react-redux';

import { NavSidebarButtonLayout } from 'commonComponents/Layouts/Navigation';
import { SidebarActionButton } from 'components/buttons/SidebarActionButton';
import { useTranslation } from 'i18n';
import { selectAllUnreadNotificationsSinceLastDisplayCount } from 'models/domain/NotificationsModel/selectors';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils';

import { Megaphone } from '../../common/Icons/fontawesome/Megaphone';
import { NotificationsCenterTooltip } from '../../notifications/NotificationsCenterIcon/index';

const boxStyles: SxProps = {
  position: 'relative',
};

const StyledSpan = styled.span`
  margin-left: '1.2rem';
`;

const Indicator = styled.div`
  position: absolute;
  background-color: var(--color-accent-500);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  left: 80%;
  bottom: 0;
`;

const Counter = styled.div`
  height: 1.8rem;
  margin-left: auto;
  font-size: var(--fontSize-xs);
  font-weight: var(--fontWeight-semibold);
  background-color: var(--color-accent-500);
  padding: 0 1rem;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
`;
interface NotificationsButtonInterface {
  isCollapsed?: boolean;
}
export const NotificationsButton: FC<NotificationsButtonInterface> = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const includedNotificationTypes = getNotificationTypesByNotificationCenterType(NotificationCenterType.ALL);

  const unreadNotificationsCount = useSelector((state) =>
    selectAllUnreadNotificationsSinceLastDisplayCount(state, { includedNotificationTypes }),
  );

  const onClose = () => setIsOpen(false);
  const onClick = () => setIsOpen((open) => !open);

  return (
    <NotificationsCenterTooltip isOpen={isOpen} onClose={onClose}>
      <SidebarActionButton onClick={onClick} isActive={isOpen} isDisabled={isOpen} isCollapsed={isCollapsed}>
        <NavSidebarButtonLayout
          icon={
            <Box sx={boxStyles}>
              <Megaphone />
              {!!unreadNotificationsCount && <Indicator />}
            </Box>
          }
          text={
            !isCollapsed && (
              <>
                <StyledSpan> {t('Notifications')}</StyledSpan>
                {!!unreadNotificationsCount && <Counter>{unreadNotificationsCount}</Counter>}
              </>
            )
          }
        />
      </SidebarActionButton>
    </NotificationsCenterTooltip>
  );
};
