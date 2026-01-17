import { useSelector } from 'react-redux';

import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors';

import { usePopperContext } from '../../CardDetailsPopperContext';

export const useTaskDetails = () => {
  const { taskId } = usePopperContext();
  const projectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId }));

  return { taskId, projectId };
};
