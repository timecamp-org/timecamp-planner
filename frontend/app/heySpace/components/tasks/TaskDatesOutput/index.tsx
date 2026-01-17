import React from 'react';

import { Id } from 'common/utils/identifier';

import useComponent, { TaskDatesOutputHookInterface } from './hook';
import styles from './styles.css';

export type TaskDatesOutputInterface = {
  taskId: Id;
  className?: string;
  data?: Partial<TaskDatesOutputHookInterface>;
};

const TaskDatesOutput: React.FC<TaskDatesOutputInterface> = (props) => {
  const { startDateString, dueDateString, color } = useComponent(props);

  return (
    <span
      className={props.className ? props.className : styles.datesWrapper}
      style={{ color }}
    >
      {startDateString && <span>{startDateString}</span>}
      {startDateString && dueDateString && <span>{' - '}</span>}
      {dueDateString && <span>{dueDateString}</span>}
    </span>
  );
};

export default TaskDatesOutput;
