import { ButtonBase } from '@mui/material';
import { useDispatch } from 'react-redux';

import { Id } from 'common/utils/identifier';
import AssigneesController from 'commonComponents/AssigneesController';
import ChecklistProgress from 'commonComponents/ChecklistProgress';
import { GripDotsVertical } from 'commonComponents/Icons/fontawesome/GripDotsVertical';
import TaskNameOutput from 'components/tasks/taskName/TaskNameOutput/withTooltip';
import { onSetOpenedCardDetailsModalId } from 'models/domain/AppModel/actions';
import { EntityType } from 'models/domain/EntityModel/types';

import styles from './styles.css';

export const TaskNameCell = ({
  taskId,
  showAssignees,
  showHandle,
}: {
  taskId: string;
  showAssignees: boolean;
  showHandle: boolean;
}) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-shadow
  const onOpenCardDetailsModal = (taskId: Id) => dispatch(onSetOpenedCardDetailsModalId(taskId));

  return (
    <ButtonBase onClick={() => onOpenCardDetailsModal(taskId)} className={styles.nameCell}>
      {showHandle && <GripDotsVertical className={styles.handle} />}
      <TaskNameOutput taskId={taskId} className={styles.taskName} />
      <ChecklistProgress taskId={taskId} hideOnEmpty />
      {showAssignees && (
        <AssigneesController
          objectType={EntityType.TASK_DATA}
          objectId={taskId}
          maxAssigneesRenderCount={2}
          shouldClosePopoveronSelfUnassign
          shouldRenderTitle={false}
          shouldRenderIfNoAssignees={false}
          isEditable
          hideOnEmpty
          variant="minimized"
        />
      )}
    </ButtonBase>
  );
};
