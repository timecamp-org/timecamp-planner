import { Box, SxProps } from '@mui/material';

import CurrentUserNavInfo from 'components/menu/currentUserSettings/CurrentUserNavInfo';

import { NotificationsButton } from '../../NotificationsButton/NotificationsButton';
import { WorkSpaceSettingsButton } from '../../WorkspaceSettingsButton/WorkspaceSettingsButton';

const BoxStyles: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
};
const CurrentUserNavInfoWrapper: SxProps = {
  width: '100%',
  padding: '0 1rem',
  overflow: 'hidden',
};

export const FooterSection = () => (
  <Box sx={BoxStyles}>
    <NotificationsButton />
    <WorkSpaceSettingsButton />
    <Box sx={CurrentUserNavInfoWrapper}>
      <CurrentUserNavInfo />
    </Box>
  </Box>
);
