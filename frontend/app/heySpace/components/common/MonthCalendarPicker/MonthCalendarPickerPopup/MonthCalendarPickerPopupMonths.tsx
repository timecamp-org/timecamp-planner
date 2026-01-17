import { Box } from '@mui/material';
import moment, { Moment } from 'moment';
import { FC } from 'react';
import { MonthWrapper, PlaceholderWrapper, ValueWrapper, monthsWrapperStyles } from '../styled';

interface MonthCalendarPickerPopupMonths {
  selectedMonth: Moment;
  onSelectMonth: (newMonth: Moment) => void;
}

const monthsArray = Array.from({ length: 12 }, (_, index) => index);

const MonthCalendarPickerPopupMonths: FC<MonthCalendarPickerPopupMonths> = ({ selectedMonth, onSelectMonth }) => {
  return (
    <Box sx={monthsWrapperStyles}>
      {monthsArray.map((monthIndex) => {
        const value = moment().month(monthIndex).format('MMM').toUpperCase();

        const isSelected = selectedMonth.month() === monthIndex;
        const newMonth = selectedMonth.clone().set('month', monthIndex);

        const onMonthClick = () => onSelectMonth(newMonth);

        return (
          <MonthWrapper isSelected={isSelected} onClick={onMonthClick}>
            <ValueWrapper>{value}</ValueWrapper>
            <PlaceholderWrapper>{value}</PlaceholderWrapper>
          </MonthWrapper>
        );
      })}
    </Box>
  );
};

export default MonthCalendarPickerPopupMonths;
