import { Button, IconButton, SxProps } from '@mui/material';
import { dateNow } from 'common/utils/date';
import ChevronDecider from 'commonComponents/ChevronDecider/ChevronDecider';
import MonthCalendarPicker from 'commonComponents/MonthCalendarPicker/MonthCalendarPicker';
import { useTranslation } from 'i18n';
import moment from 'moment';
import { FC } from 'react';

import styles from './styles.css';
import { ToolbarWrapperInterface } from './types';

interface ToolbarCurrentDateInterface
  extends Pick<
    ToolbarWrapperInterface,
    'onClickPrevious' | 'projectId' | 'onClickNext' | 'onSetCurrentDate' | 'date'
  > {}

const iconButtonStyles: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover svg': {
    color: 'var(--color-primary-500)',
  },
};

const ToolbarCurrentDate: FC<ToolbarCurrentDateInterface> = ({
  onClickNext,
  onClickPrevious,
  projectId,
  onSetCurrentDate,
  date,
}) => {
  const { t } = useTranslation();

  const onMonthChange = (date) => onSetCurrentDate(projectId, date.toDate());

  const onTodayClick = () => onSetCurrentDate(projectId, dateNow());

  return (
    <div className={styles.currentDateWrapper}>
      <IconButton onClick={onClickPrevious} sx={iconButtonStyles}>
        <ChevronDecider direction="left" />
      </IconButton>
      <MonthCalendarPicker value={moment(date)} onChange={onMonthChange} />

      <IconButton onClick={onClickNext} sx={iconButtonStyles}>
        <ChevronDecider direction="right" />
      </IconButton>
      <Button variant="text" className={styles.todayButton} onClick={onTodayClick}>
        {t('Today')}
      </Button>
    </div>
  );
};

export default ToolbarCurrentDate;
