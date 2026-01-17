import * as TasksModelActions from 'models/domain/TasksModel/actions';
import * as TasksModelSelectors from 'models/domain/TasksModel/selectors';
import { TaskStatus } from 'models/domain/TasksModel/types';
import { useDispatch, useSelector } from 'react-redux';
import { usePopperContext } from "../../CardDetailsPopperContext";


export const useMarkAsDone = () => {
  const { taskId, closePopper, onAction } = usePopperContext();
  const dispatch = useDispatch();
  const isTaskDone = useSelector(state => TasksModelSelectors.selectTaskStatus(state, { taskId }) ===
    TaskStatus.COMPLETED);

  const markTaskAsDone = () => {
    dispatch(
      dispatch(TasksModelActions.onChangeStatus(
        taskId,
        isTaskDone ? TaskStatus.ACTIVE : TaskStatus.COMPLETED,
        true
      ))
    );
    closePopper();
    onAction();
  };

  return {
    isTaskDone,
    markTaskAsDone,
  };
};
