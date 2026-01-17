import { FC } from 'react';

import styled from 'styles/styled';
import { Box, Button } from '@mui/material';

import { Play } from 'commonComponents/Icons/fontawesome/Play';
import { Stop } from 'commonComponents/Icons/fontawesome/Stop';
import { useTranslation } from 'i18n';

import { Line, TimeCampColor } from '../components/styled';
import { useTaskTimer } from '../hooks/useTaskTimer';

const StyledButton = styled(Button)<{ $isRunning: boolean }>`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 0.6rem 1rem;
  width: 100%;
  max-width: 15rem !important;
  background-color: ${({ $isRunning }) => ($isRunning ? 'var(--color-critical-500)' : TimeCampColor)};

  &:hover {
    background-color: ${({ $isRunning }) => ($isRunning ? 'var(--color-critical-500)' : TimeCampColor)};
    opacity: 0.9;
  }
`;

interface TimerFormInterface {
  taskId: string;
}

export const TimerForm: FC<TimerFormInterface> = ({ taskId }) => {
  const { t } = useTranslation();
  const { isTimerRunning, toggleTimer } = useTaskTimer(taskId);

  return (
    <Box>
      <Line>
        <StyledButton onClick={toggleTimer} $isRunning={isTimerRunning}>
          <span> {t(isTimerRunning ? 'STOP TIMER' : 'START TIMER')}</span>
          {isTimerRunning ? <Stop /> : <Play />}
        </StyledButton>
      </Line>
    </Box>
  );
};
