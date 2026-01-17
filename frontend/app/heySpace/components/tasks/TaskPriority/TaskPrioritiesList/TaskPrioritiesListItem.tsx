import { FC } from 'react';
import TaskPriorityFlag from '../TaskPriorityFlag/TaskPriorityFlag';
import { TaskPriorityItemLabel, TaskPriorityItemWrapper } from './styled';

interface TaskPrioritiesListItemInterface {
  onClick: VoidFunction;
  grayscale?: boolean;
  priorityType: string;
  label: string;
  isCrossed?: boolean;
}

const TaskPrioritiesListItem: FC<TaskPrioritiesListItemInterface> = ({
  onClick,
  grayscale = false,
  priorityType,
  label,
  isCrossed,
}) => {
  return (
    <TaskPriorityItemWrapper onClick={onClick}>
      <TaskPriorityFlag
        onClick={null}
        grayscale={grayscale}
        hideBorder
        size="lg"
        priorityType={priorityType}
        isCrossed={isCrossed}
      />
      <TaskPriorityItemLabel>{label}</TaskPriorityItemLabel>
    </TaskPriorityItemWrapper>
  );
};

export default TaskPrioritiesListItem;
