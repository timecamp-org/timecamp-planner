import { FC } from 'react';

import styled from 'styles/styled';
import { Box, IconButton, SxProps, Tab, TabProps, Tabs } from '@mui/material';
import { useSelector } from 'react-redux';

import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import { useTranslation } from 'i18n';
import { selectAllUnreadNotificationsSinceLastDisplayCount } from 'models/domain/NotificationsModel/selectors';
import { NotificationCenterType } from 'models/domain/NotificationsModel/types';
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils';

import { useNotificationCenterContext } from '../NotificationCenterContext';

import { renderNotificationList } from './renderers';

// eslint-disable-next-line prettier/prettier
const StyledLabel = styled(Box)<{ count: number }>`
  position: relative;

  &:after {
    content: ${({ count }) => `"${count ? count : ''}"`};
    position: absolute;
    left: 100%;
    top: 0;
    font-size: var(--fontSize-xxs);
    font-weight: var(--fontWeight-semibold);
    color: var(--color-accent-500);
  }
`;

const boxStyles: SxProps = {
  display: 'flex ',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: '1.6rem',
  paddingBottom: '1.5rem',
};

const tabsStyles: SxProps = {
  zIndex: 100,
  position: 'relative',
  maxWidth: 'min-content',
};

const tabStyles: SxProps = {
  padding: '.6rem 1.5rem',
};

const StyledTitle = styled.p`
  font-size: var(--fontSize-base);
  font-weight: var(--fontWeight-semibold);
`;

interface NotificationTabInterface extends TabProps {
  value: NotificationCenterType;
}

const NotificationTab: FC<NotificationTabInterface> = ({ value, label, ...rest }) => {
  const includedNotificationTypes = getNotificationTypesByNotificationCenterType(value);

  const unreadNotificationsCount = useSelector((state) =>
    selectAllUnreadNotificationsSinceLastDisplayCount(state, { includedNotificationTypes }),
  );

  return (
    <Tab
      sx={tabStyles}
      value={value}
      label={<StyledLabel count={unreadNotificationsCount}>{label}</StyledLabel>}
      {...rest}
    />
  );
};

export const NotificationTabPanel = () => {
  const { t } = useTranslation();
  const { hook, notificationCenterType, setCurrentTab } = useNotificationCenterContext();

  const onChange = (_, newValue: NotificationCenterType) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Box sx={boxStyles}>
        <StyledTitle>{t('Notifications')}</StyledTitle>
        <IconButton onClick={hook.onClose}>
          <Xmark />
        </IconButton>
      </Box>
      <Tabs value={notificationCenterType} onChange={onChange} sx={tabsStyles}>
        <NotificationTab label={t('All')} value={NotificationCenterType.ALL} />
        <NotificationTab label={t('Chats')} value={NotificationCenterType.CHAT} />
        <NotificationTab label={t('Projects')} value={NotificationCenterType.ACTION_BASED} />
      </Tabs>
      {renderNotificationList(hook, notificationCenterType)}
    </>
  );
};
