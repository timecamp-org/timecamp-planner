import { ChangeEvent, FC, useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { isBefore } from 'date-fns';

import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import TimeField from 'components/time/TimeField';
import { useTranslation } from 'i18n';

import { Button, FormError, Line, StyledInput } from '../components/styled';
import { useTaskTimeEntry } from '../hooks/useTaskTimeEntry';
import { mergeTimeWithDay } from '../utils';

import { DayPicker } from './DatePicker';

interface ManualTimeEntryFormInterface {
  taskId: string;
}

export const ManualTimeEntryForm: FC<ManualTimeEntryFormInterface> = ({ taskId }) => {
  const { t } = useTranslation();
  const { addTimeEntry, isLoading } = useTaskTimeEntry(taskId);
  const [date, setDate] = useState(new Date());
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isValid, setIsValid] = useState(true);
  const fromDate = mergeTimeWithDay(from, date);
  const toDate = mergeTimeWithDay(to, date);

  const validateDate = () => {
    // eslint-disable-next-line no-shadow
    const isFormValid = isBefore(fromDate, toDate);
    setIsValid(isFormValid);

    return isFormValid;
  };

  useEffect(() => {
    if (!isValid) {
      validateDate();
    }
  }, [isValid, from, to]);

  const onClick = () => {
    const isFormValid = validateDate();
    if (isFormValid) {
      addTimeEntry({ from: fromDate, to: toDate });
      clearForm();
    }
  };

  const clearForm = () => {
    setDate(new Date());
    setFrom('');
    setTo('');
  };

  const generateOnChange = (callback: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    callback(event.target.value);
  };

  return (
    <Box>
      <Line>
        <TimeField
          value={from}
          onChange={generateOnChange(setFrom)}
          input={<StyledInput type="text" placeholder={t('Enter duration, e.g. 4h 30m')} />}
        />
        <span>-</span>
        <TimeField
          value={to}
          onChange={generateOnChange(setTo)}
          input={<StyledInput type="text" placeholder={t('Enter duration, e.g. 4h 30m')} />}
        />
        <DayPicker day={date} onDayChange={setDate} />
        {!isValid && <FormError>{t('The start time must be before the end time')}</FormError>}
      </Line>

      <Line>
        <Button onClick={onClick} disabled={isLoading}>
          <span>{t('ADD ENTRY')}</span>
          <Plus width={13} />
        </Button>
      </Line>
    </Box>
  );
};
