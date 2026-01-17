import React, { memo } from 'react';

import ProjectColors from 'common/commonStyles/projectColors';
import { getColorWithAlpha } from 'common/utils/colors';
import { Id } from 'common/utils/identifier';
import AssigneesController from 'commonComponents/AssigneesController';
import ChecklistProgress from 'commonComponents/ChecklistProgress';
import { FloatingTaskSummary } from 'components/tasks/TaskFloatingSummary/FloatingTaskSummary';
import { EntityType } from 'models/domain/EntityModel/types';
import { getConditionalClass } from 'utils/getConditionalClass';

import TaskDatesOutput from '../../../tasks/TaskDatesOutput';
import TaskNameOutput from '../../../tasks/taskName/TaskNameOutput';
import TaskProgressWithPopover from '../../../tasks/taskProgress/TaskProgressWithPopover';

import useComponent from './hook';
import styles from './styles.css';

export type TimelineCardInterface = {
  cardId: Id;
  isSelected?: boolean;
  isResizeHandleVisible?: boolean;
  isCardMinimized?: boolean;
};

const defaultProps = {
  isResizeHandleVisible: false,
  isCardMinimized: false,
  isSelected: false,
};

const TimelineCard: ReactFCWithChildren<TimelineCardInterface> = (props) => {
  const hook = useComponent(props.cardId);

  const color = getColorWithAlpha(ProjectColors.getContrastColors(hook.cardColor)[100] || hook.cardColor, 0.6);
  const hasBorder = props.isSelected && props.isResizeHandleVisible;

  return (
    <FloatingTaskSummary id={props.cardId}>
      <div
        className={`
      ${styles.component} 
      ${getConditionalClass(styles.selected, hasBorder)}
      `}
        style={{
          color,
          borderColor: hasBorder ? hook.cardColor : color,
          backgroundColor: color,
        }}
      >
        <div className={styles.contentWrapper}>{renderContent(props, hook)}</div>
      </div>
    </FloatingTaskSummary>
  );
};

function renderContent(props: TimelineCardInterface, hook) {
  const contrastColor = ProjectColors.getContrastColors(hook.cardColor)[800] || 'var(--color-gray-800)';

  return (
    <div className={`${styles.itemLeft} ${props.isCardMinimized ? styles.noPadding : ''}`}>
      <div className={`${styles.sticky} ${styles.flexColumn}`}>
        <div className={`${styles.itemRight} ${props.isCardMinimized ? styles.noPadding : ''}`}>
          <div className={`${styles.sticky} ${styles.flexRow} `}>
            <TaskNameOutput taskId={props.cardId} color={contrastColor} />
            {hook.taskProgress > 0 && (
              <TaskProgressWithPopover
                buttonClassName={styles.taskProgress}
                taskId={props.cardId}
                color={contrastColor}
              />
            )}
            {hook.taskChecklistItemCount > 0 && (
              <ChecklistProgress
                className={styles.checklistProgress}
                taskId={props.cardId}
                shouldRenderIcon={false}
                color={contrastColor}
              />
            )}
            <AssigneesController
              objectType={EntityType.TASK_DATA}
              objectId={props.cardId}
              maxAssigneesRenderCount={2}
              shouldRenderTitle={false}
              isEditable
              color={contrastColor}
              variant="minimized"
            />
          </div>
        </div>

        <TaskDatesOutput className={styles.datesWrapper} taskId={props.cardId} />
      </div>
    </div>
  );
}

TimelineCard.defaultProps = defaultProps;

export default memo(TimelineCard);
