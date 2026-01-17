import { FC } from 'react';

import { Box, SxProps } from '@mui/material';
import { useSelector } from 'react-redux';

import { ClockRotateLeft } from 'commonComponents/Icons/fontawesome/ClockRotateLeft';
import UserName from 'commonComponents/UserName';
import UserAvatar from 'components/settings/userProfile/UserAvatar';
import { useTranslation } from 'i18n';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { ElapsedTime } from '../components/ElapsedTime';
import { Header, Link, SpinnerGreen } from '../components/styled';
import styles from '../components/styles.css';
import { useTaskElapsedTime } from '../hooks/useTaskElapsedTime';
import { TaskTimeEditForm } from '../TakTimeEditForm/TaskTimeEditForm';

interface TaskTimePopOverContentInterface {
  taskId: string;
}

const TIMESHEETS_URL = 'https://app.timecamp.com/app#/timesheets/timer';

const contentWrapperStyles: SxProps = {
  padding: '2.4rem',
  display: 'flex',
  flexDirection: 'column',
};

const footerWrapperStyles: SxProps = {
  marginTop: '4rem',
};

const timerBoxStyles: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '1rem',
};

const userBoxStyles: SxProps = {
  display: 'flex',
  gap: '.8rem',
  alignItems: 'center',
};

const titleWrapper: SxProps = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const TaskTimePopOverContent: FC<TaskTimePopOverContentInterface> = ({ taskId }) => {
  const { t } = useTranslation();
  const { taskElapsedTime, isLoading } = useTaskElapsedTime(taskId);
  const userId = useSelector(selectCurrentUserId);

  return (
    <Box>
      <Header>
        <Box sx={titleWrapper}>
          <p>{t('Time tracked')}</p>
          {isLoading && <SpinnerGreen />}
        </Box>
        {!!taskElapsedTime && (
          <Box sx={timerBoxStyles}>
            <Box sx={userBoxStyles}>
              <UserAvatar userId={userId} className={styles.userAvatar} />
              <UserName userId={userId} className={styles.userName} />
            </Box>
            <ElapsedTime seconds={taskElapsedTime} />
          </Box>
        )}
      </Header>

      <Box sx={contentWrapperStyles}>
        <TaskTimeEditForm taskId={taskId} />
        <Box sx={footerWrapperStyles}>
          <Link target="_blank" rel="noreferrer" href={TIMESHEETS_URL}>
            <ClockRotateLeft />
            <span>{t('Full Timesheet and Reports in TimeCamp')}</span>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
