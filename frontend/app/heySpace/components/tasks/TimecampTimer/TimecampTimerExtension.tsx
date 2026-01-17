import { FC } from 'react';

import { Box, SxProps } from '@mui/material';

import { TimecampTimerPopoverButton } from './Popover/TimecampTimerPopoverButton';
import { StartStopButton } from './StartStopButton/StartStopButton';
import { WithTaskIdInterface } from './types';

const boxStyles: SxProps = {
  display: 'flex',
  alignItems: 'center',

  '&>*:not(:last-child)': {
    marginRight: '1rem',
  },
};

export const TimecampTimerExtension: FC<WithTaskIdInterface> = ({ taskId }) => (
  <Box sx={boxStyles}>
    <StartStopButton taskId={taskId} />
    <TimecampTimerPopoverButton taskId={taskId} />
  </Box>
);
