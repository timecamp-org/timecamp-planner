import { FC } from 'react';

import { TASK_PRIORITY_COLORS } from '../const';

import { FigmaIconSizeProp } from 'app/heySpace/theme/types';
import { TaskPriorityFlagButton, TaskPriorityFlagLight, TaskPriorityFlagSolid } from './styled';

interface TaskPriorityFlagInterface {
  size?: FigmaIconSizeProp;
  priorityType: string;
  className?: string;
  grayscale?: boolean;
  hideBorder?: boolean;
  isCrossed?: boolean;
  onClick: VoidFunction;
}

const TaskPriorityFlag: FC<TaskPriorityFlagInterface> = ({
  priorityType,
  onClick,
  size,
  grayscale,
  hideBorder = false,
  isCrossed = false,
  className,
}) => (
  <TaskPriorityFlagButton
    onClick={onClick}
    $flagSize={size}
    $hideBorder={hideBorder}
    $isCrossed={isCrossed}
    className={className}
  >
    {grayscale || !priorityType ? (
      <TaskPriorityFlagLight $flagSize={size} size={size} />
    ) : (
      <TaskPriorityFlagSolid color={TASK_PRIORITY_COLORS[priorityType]} $flagSize={size} size={size} />
    )}
  </TaskPriorityFlagButton>
);

export default TaskPriorityFlag;
