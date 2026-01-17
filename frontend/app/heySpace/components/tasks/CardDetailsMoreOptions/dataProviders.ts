import { Id } from 'common/utils/identifier';
import {
  selectListIdByTaskId,
  selectListIsArchived,
  selectProjectNotArchivedListIdsInOrder,
} from 'models/domain/ListsModel/selectors';
import * as TasksModelSelectors from 'models/domain/TasksModel/selectors';
import { useSelector } from 'react-redux';

export const selectTaskData = (taskId: Id) =>
  useSelector((state) => {
    const listId = selectListIdByTaskId(state, { taskId });
    const projectId = TasksModelSelectors.selectProjectIdByTaskId(state, {
      taskId,
    });
    return {
      listId,
      isListArchived: selectListIsArchived(state, { listId }),
      isTaskArchived: TasksModelSelectors.selectIsTaskArchived(state, {
        taskId,
      }),
      projectId,
      listIds: selectProjectNotArchivedListIdsInOrder(state, { projectId }),
      taskName: TasksModelSelectors.selectTaskName(state, {
        taskId,
      }),
    };
  });
