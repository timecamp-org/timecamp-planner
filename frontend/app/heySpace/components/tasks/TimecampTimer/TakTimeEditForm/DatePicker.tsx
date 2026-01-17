import { FC, useRef, useState } from 'react';

import { ButtonBase } from '@mui/material';

import UniversalPopover from 'commonComponents/UniversalPopover';
import DatePicker from 'components/date/DatePicker';
import useOnClickOutside from 'hooks/useOnClickOutside';

import { CalendarDay } from '../../../common/Icons/fontawesome/CalendarDay';

interface DatePickerInterface {
  day: Date;
  onDayChange?: (day: Date) => void;
}

const POPPER_MODIFIERS = {
  offset: {
    offset: `50%, 5px`,
  },
  preventOverflow: {
    boundariesElement: 'window',
  },
};

export const DayPicker: FC<DatePickerInterface> = ({ day, onDayChange }) => {
  const popoverRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(day || new Date());

  useOnClickOutside(popoverRef, () => {
    setIsOpen(false);
  });

  // eslint-disable-next-line no-shadow
  const onChange = (day: Date) => {
    onDayChange?.(day);
    setDate(day);
  };

  const onToggle = () => setIsOpen((o) => !o);

  return (
    <UniversalPopover
      isPopoverOpened={isOpen}
      targetComponent={
        <ButtonBase onClick={onToggle}>
          <CalendarDay size="sm" />
        </ButtonBase>
      }
      popperComponent={
        <div ref={popoverRef}>
          {/* @ts-ignore */}
          <DatePicker date={date} onChange={onChange} />
        </div>
      }
      popperPlacement="bottom"
      popperModifiers={POPPER_MODIFIERS}
      shouldRenderArrow
    />
  );
};
