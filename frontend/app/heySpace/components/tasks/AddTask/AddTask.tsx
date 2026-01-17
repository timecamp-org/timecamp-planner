import { Button } from '@mui/material';

import { Id } from 'common/utils/identifier';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import useComponent from './hook';

export type AddTaskInterface = {
  projectId?: Id;
  shouldAutoAssign?: boolean;
  taskCreateSource: TaskCreateSource;
  className?: string;
};

export const AddTask: ReactFCWithChildren<AddTaskInterface> = (props) => {
  const { onClick } = useComponent(props);
  const { className, children } = props;

  return (
    <Button variant="text-reversed" className={className} onClick={onClick}>
      {children}
    </Button>
  );
};
