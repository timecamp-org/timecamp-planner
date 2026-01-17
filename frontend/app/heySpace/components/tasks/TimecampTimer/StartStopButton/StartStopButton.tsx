import { FC } from 'react';

import styled from 'styles/styled';
import { ButtonBase } from '@mui/material';
import { useSelector } from 'react-redux';

import { Play } from 'commonComponents/Icons/fontawesome/Play';
import { Stop } from 'commonComponents/Icons/fontawesome/Stop';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors';

import { TimeCampColor } from '../components/styled';
import { useTaskTimer } from '../hooks/useTaskTimer';
import { WithTaskIdInterface } from '../types';

const Button = styled(ButtonBase)<{ $isRunning: boolean }>`
  background-color: ${({ $isRunning }) => ($isRunning ? 'var(--color-critical-500)' : TimeCampColor)};
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;

  & > svg {
    width: 0.7rem;
    color: var(--color-white);
  }
`;

export const StartStopButton: FC<WithTaskIdInterface> = ({ taskId }) => {
  const { toggleTimer, isTimerRunning } = useTaskTimer(taskId);
  const isLoading = useSelector((state) =>
    selectRequestIsLoading(state, { requestType: RequestTypesConstants.setTimer, objectId: taskId }),
  );

  return (
    <Button disabled={isLoading} $isRunning={isTimerRunning} onClick={toggleTimer}>
      {isTimerRunning ? <Stop /> : <Play />}
    </Button>
  );
};
