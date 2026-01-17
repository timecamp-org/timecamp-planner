import { Box, SxProps } from '@mui/material';
import { ButtonPopover } from 'components/buttons/ButtonPopover';
import { FC } from 'react';
import MonthCalendarPopup from './MonthCalendarPickerPopup';
import { MonthCalendarInterface } from './types';

const targetWrapperStyles: SxProps = {
  textTransform: 'uppercase',
  fontWeight: 'var(--fontWeight-semibold)',
};

const MonthCalendar: FC<MonthCalendarInterface> = (props) => {
  const { value } = props;
  return (
    <ButtonPopover
      popperModifiers={{}}
      popperComponent={<MonthCalendarPopup {...props} />}
      targetContent={<Box sx={targetWrapperStyles}>{value.format('MMMM YYYY')}</Box>}
    />
  );
};

export default MonthCalendar;
