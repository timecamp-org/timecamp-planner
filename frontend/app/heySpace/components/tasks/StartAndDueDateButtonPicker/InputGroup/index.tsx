import { FC, Ref } from 'react';

import { IconButton } from '@mui/material';

import { isStartOfDay } from 'common/utils/dateOperations';
import { Clock } from 'commonComponents/Icons/fontawesome/Clock';
import DateInput from 'components/date/DateInput';
import { DateChange } from 'components/date/DateInput/types';
import TimeInput from 'components/time/TimeInput';

import styles from '../styles.css';
import { DateInputGroup } from '../types';

type InputGroupInterface = {
  type: DateInputGroup;
  focusedInputType: DateInputGroup;
  date: number;
  label: string;
  color: string;
  isVisible: boolean;
  onSetIsVisible: (isVisible: boolean) => void;
  onSetFocusedInput: (type: DateInputGroup) => void;
  onChangeDate: (dateChange: DateChange) => void;
  inputRef: Ref<HTMLInputElement>;
};

const InputGroup: FC<InputGroupInterface> = ({
  type,
  focusedInputType,
  date,
  label,
  color,
  isVisible,
  onSetIsVisible,
  onSetFocusedInput,
  onChangeDate,
  inputRef,
}) => {
  const isInputVisible = isVisible || (date && !isStartOfDay(date));
  const isFocused = focusedInputType === type;

  return (
    <div tabIndex={-1} className={styles.inputGroup} onFocus={() => onSetFocusedInput(type)}>
      <span className={styles.label} style={{ color: isFocused ? color : undefined }}>
        {label}
      </span>
      <DateInput className={styles.dateInput} value={date} onChange={onChangeDate} inputRef={inputRef} />
      {date && renderTimeInputController()}
    </div>
  );

  function renderTimeInputController() {
    if (isInputVisible) {
      return <TimeInput value={date} className={styles.timeInput} onChange={onChangeDate} />;
    } else {
      return (
        <IconButton className={styles.timeButton} onClick={() => onSetIsVisible(true)}>
          <Clock />
        </IconButton>
      );
    }
  }
};

export default InputGroup;
