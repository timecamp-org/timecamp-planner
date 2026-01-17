import { IconButton } from '@mui/material';
import ChevronDecider from 'commonComponents/ChevronDecider/ChevronDecider';
import { FC, useState } from 'react';
import { PopupWrapper, ToolbarWrapper, YearWrapper, iconButtonStyles } from '../styled';
import { MonthCalendarInterface } from '../types';
import MonthCalendarPickerPopupMonths from './MonthCalendarPickerPopupMonths';

type MonthCalendarPopupInterface = Pick<MonthCalendarInterface, 'onChange' | 'value'>;

const MonthCalendarPopup: FC<MonthCalendarPopupInterface> = ({ onChange, value }) => {
  const [selectedMonth, setSelectedMonth] = useState(value);

  const subtractMonth = () => setSelectedMonth(selectedMonth.clone().subtract(1, 'years'));
  const appendMonth = () => setSelectedMonth(selectedMonth.clone().add(1, 'years'));

  const onSelectMonth = (newMonth) => {
    setSelectedMonth(newMonth);
    onChange(newMonth);
  };
  return (
    <PopupWrapper>
      <ToolbarWrapper>
        <IconButton sx={iconButtonStyles} onClick={subtractMonth}>
          <ChevronDecider size="sm" direction="left" />
        </IconButton>
        <YearWrapper>{selectedMonth.format('YYYY')}</YearWrapper>

        <IconButton sx={iconButtonStyles} onClick={appendMonth}>
          <ChevronDecider size="sm" direction="right" />
        </IconButton>
      </ToolbarWrapper>

      <MonthCalendarPickerPopupMonths selectedMonth={selectedMonth} onSelectMonth={onSelectMonth} />
    </PopupWrapper>
  );
};

export default MonthCalendarPopup;
