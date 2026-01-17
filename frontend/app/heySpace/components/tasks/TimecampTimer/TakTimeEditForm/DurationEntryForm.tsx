import { FC, useState } from 'react';

import { Box } from '@mui/material';

import { useKeyboard } from 'common/hooks/useKeyBoard';
import { DurationMask } from 'commonComponents/DurationMask';
import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation/component';
import { useTranslation } from 'i18n';

import { Button, Line, StyledInput } from '../components/styled';
import { useTaskDurationEntry } from '../hooks/useTaskDurationEntry';
import { WithTaskIdInterface } from '../types';

import { DayPicker } from './DatePicker';

export const DurationEntryForm: FC<WithTaskIdInterface> = ({ taskId }) => {
  const { t } = useTranslation();
  const [date, setDate] = useState(new Date());
  const [minutes, setMinutes] = useState(0);
  const { addDurationEntry, isLoading } = useTaskDurationEntry(taskId);

  const onClick = () => {
    if (minutes) {
      addDurationEntry({ date, durationSeconds: minutes * 60 });
      setMinutes(0);
    }
  };

  const onChange = (newDuration: number) => {
    setMinutes(newDuration);
  };

  useKeyboard({ onEnter: onClick });

  return (
    <Box>
      <Line>
        <DurationMask
          initialValue={minutes}
          onChange={onChange}
          inputRenderer={({ ref, value }) => (
            <StyledInput
              ref={(reference) => {
                ref.current = reference;
              }}
              type="text"
              placeholder={t('Enter duration, e.g. 4h 30m')}
              value={value}
            />
          )}
        />
        <StopClickEventPropagation>
          <DayPicker day={date} onDayChange={setDate} />
        </StopClickEventPropagation>
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
