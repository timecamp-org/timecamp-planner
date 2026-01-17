import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import { TaskEstimates } from 'components/taskList/TaskEstimates';
import { getConditionalClass } from 'utils/getConditionalClass';

import { PureCardInterface } from '..';
import styles from '../styles.css';

export function renderTimeEstimates({ taskId }: PureCardInterface, hideOnEmpty?: boolean) {
  return (
    <StopClickEventPropagation>
      <TaskEstimates
        taskId={taskId}
        toggleButtonClass={`${styles.estimateButton} ${getConditionalClass(
          styles.emptyPropertyButtonSize,
          !hideOnEmpty
        )}`}
        hideOnEmpty={hideOnEmpty}
        size="sm"
      />
    </StopClickEventPropagation>
  );
}
