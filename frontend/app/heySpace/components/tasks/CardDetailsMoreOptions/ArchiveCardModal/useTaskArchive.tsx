import { useDispatch } from 'react-redux';

import { useAlertNotification } from 'common/hooks/useAlertNotification';
import { Id } from 'common/utils/identifier';
import { i18n } from 'i18n';
import * as TasksModelActions from 'models/domain/TasksModel/actions';

import { usePopperContext } from '../CardDetailsPopperContext';
import { selectTaskData } from '../dataProviders';

export const useTaskArchive = () => {
  const {
    taskId,
    showArchiveModal,
    showMoveAndUnarchiveModal,
    hideArchiveModal,
    hideMoveAndUnarchiveModal,
    closePopper,
    onAction,
  } = usePopperContext();
  const dispatch = useDispatch();

  const { isListArchived, isTaskArchived, listIds, projectId, taskName } = selectTaskData(taskId);

  const onAlert = useAlertNotification({ id: `task-${taskId}-archived` });

  const archiveTask = () => {
    dispatch(TasksModelActions.onArchiveTask(taskId));
    onAlert(
      i18n.t(`You've successfully archived task: {{cardName}}`, {
        cardName: taskName,
      })
    );
    closePopper();
    onAction();
  };

  const unarchiveTask = () => {
    dispatch(TasksModelActions.onUnarchiveTask(taskId));
    onAlert(
      i18n.t(`You've successfully unarchived task: {{cardName}}`, {
        cardName: taskName,
      })
    );
    closePopper();
    onAction();
  };

  const onToggleTaskArchive = () => {
    if (isTaskArchived) {
      unarchiveTask();

      return;
    }

    if (isListArchived) {
      showMoveAndUnarchiveModal();
    } else {
      showArchiveModal();
    }
  };

  const unarchiveAndChangeList = (destinationListId: Id) => {
    if (isTaskArchived) {
      dispatch(TasksModelActions.onUnarchiveTask(taskId));
    }
    dispatch(TasksModelActions.onMoveTask(taskId, undefined, destinationListId, projectId, projectId, false));
    onAlert(
      i18n.t(`You've successfully unarchived task: {{cardName}}`, {
        cardName: taskName,
      })
    );
    closePopper();
    onAction();
  };

  return {
    isTaskArchived: isTaskArchived || isListArchived,
    listIds,
    onToggleTaskArchive,
    showArchiveModal,
    showMoveAndUnarchiveModal,
    hideArchiveModal,
    hideMoveAndUnarchiveModal,
    unarchiveAndChangeList,
    archiveTask,
    unarchiveTask,
  };
};
