/* eslint-disable camelcase */
import { FC, useState } from 'react';

import { Box } from '@mui/material';

import { useTranslation } from 'i18n';

import { Tab, Tabs } from '../components/styled';
import { DurationEntryForm } from './DurationEntryForm';
import { ManualTimeEntryForm } from './ManualTimeEntryForm';
import { TimerForm } from './TimerForm';

interface TaskTimeEditFormInterface {
  taskId: string;
}

enum FormTabs {
  TIMER = 'TIMER',
  MANUAL = 'MANUAL',
  DURATION = 'DURATION',
}

export const TaskTimeEditForm: FC<TaskTimeEditFormInterface> = ({ taskId }) => {
  const [tab, setTab] = useState<FormTabs>(FormTabs.TIMER);
  const { t } = useTranslation();

  const onTabChange = (_, newValue: FormTabs) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Box>
        <Tabs value={tab} onChange={onTabChange}>
          <Tab label={t('Timer')} value={FormTabs.TIMER} />
          <Tab label={t('Manual')} value={FormTabs.MANUAL} />
          <Tab label={t('Duration')} value={FormTabs.DURATION} />
        </Tabs>
      </Box>
      {tab === FormTabs.TIMER && <TimerForm taskId={taskId} />}
      {tab === FormTabs.MANUAL && <ManualTimeEntryForm taskId={taskId} />}
      {tab === FormTabs.DURATION && <DurationEntryForm taskId={taskId} />}
    </Box>
  );
};
