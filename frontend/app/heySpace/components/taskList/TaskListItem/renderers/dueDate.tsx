import DueDate from 'commonComponents/DueDate';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import CardStartAndDueDateController from 'components/tasks/CardStartAndDueDateController';

import { PureCardInterface } from '..';
import TaskSecondaryButton from '../../../buttons/SecondaryButton';
import styles from '../styles.css';

export function renderDueDateWithPopover(props: PureCardInterface, format: string) {
  return (
    <StopClickEventPropagation>
      <CardStartAndDueDateController
        taskId={props.taskId}
        // eslint-disable-next-line no-shadow
        targetRenderer={({ isHovering, onSetIsPickerOpen, isPickerOpen }, { dueDate }) => (
          <TaskSecondaryButton
            className={styles.taskDueDate}
            onClick={() => onSetIsPickerOpen(!isPickerOpen)}
            isActive={isHovering || isPickerOpen}
            taskId={props.taskId}
          >
            <DueDate className={styles.dueDate} dueDate={dueDate} taskId={props.taskId} format={format} />
          </TaskSecondaryButton>
        )}
      />
    </StopClickEventPropagation>
  );
}
