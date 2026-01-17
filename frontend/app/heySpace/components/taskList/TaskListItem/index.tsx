import React, { memo, MouseEventHandler } from 'react';

import { List } from 'immutable';
import ReactResizeDetector from 'react-resize-detector';

import { Id } from 'common/utils/identifier';
import Badge from 'commonComponents/Badge';
import ChecklistProgress from 'commonComponents/ChecklistProgress';
import { CalendarDays } from 'commonComponents/Icons/fontawesome/CalendarDays';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import {
  PopoverOpenContextProvider,
  usePopoverOpenContext,
} from 'commonComponents/UniversalPopover/PopoverOpenContext';
import { PropertyButton } from 'components/buttons/PropertyButton';
import CardStartAndDueDateController from 'components/tasks/CardStartAndDueDateController';
import TaskPrioritiesPicker from 'components/tasks/TaskPriority/TaskPrioritiesPicker/TaskPrioritiesPicker';
import { DateFormat } from 'models/domain/UsersModel/constants/timeSettings';
import { getConditionalClass } from 'utils/getConditionalClass';

import { BadgeNotificationType } from '../../common/Badge/types';
import CardDetailsMoreOptions from '../../tasks/CardDetailsMoreOptions';
import TaskNameOutput from '../../tasks/taskName/TaskNameOutput';
import TaskProgressWithPopover from '../../tasks/taskProgress/TaskProgressWithPopover';
import TaskReactions from '../../tasks/TaskReactions';
import { TaskEstimates } from '../TaskEstimates';

import useComponent, { TaskListItemHookInterface } from './hook';
import { renderAssigneeWithPopover } from './renderers/assigneesWithPopover';
import { renderDueDateWithPopover } from './renderers/dueDate';
import { renderEstimatedEffortWithPopover } from './renderers/estimatedEffortWithPopover';
import { renderTagList } from './renderers/tagsList';
import { renderTimeEstimates } from './renderers/timeEstimates';
import styles from './styles.css';

export type TaskListItemInterface = {
  taskId: string;
};

const defaultProps = {};

const TaskListItem: React.FC<TaskListItemInterface> = (props) => {
  const hook = useComponent(props.taskId);

  return (
    <div className={styles.Component} onMouseEnter={hook.onMouseEnter} onMouseLeave={hook.onMouseLeave}>
      {hook.notificationsCount > 0 && (
        <Badge
          className={styles.badge}
          objectType={BadgeNotificationType.TASK}
          objectId={props.taskId}
          color={hook.taskColor}
        />
      )}

      {renderCard(props, hook)}
    </div>
  );
};

function renderCard(props: TaskListItemInterface, hook: TaskListItemHookInterface) {
  return (
    <div className={styles.card} onClick={hook.onClick}>
      <PureCard
        hook={hook}
        taskId={props.taskId}
        taskColor={hook.taskColor}
        shouldRenderExtensions={hook.shouldRenderExtensions}
        isEstimatesExtensionEnabled={hook.isEstimatesExtensionEnabled}
        hasAccessToEstimates={hook.hasAccessToEstimates}
        isTaskVotingExtensionEnabled={hook.isTaskVotingExtensionEnabled}
        taskEstimatedEffort={hook.taskEstimatedEffort}
        taskEstimatedHours={hook.taskEstimatedHours}
        tagCount={hook.tagCount}
        taskDueDate={hook.taskDueDate}
        taskProgress={hook.taskProgress}
        isHoveringEfforts={hook.isHoveringEfforts}
        isAssigneePickerOpen={hook.isAssigneePickerOpen}
        taskAssignees={hook.taskAssignees}
        taskChecklistItemCount={hook.taskChecklistItemCount}
        onSetIsTaskProgressPopoverOpen={hook.onSetIsTaskProgressPopoverOpen}
        onSetIsAssigneePickerOpen={hook.onSetIsAssigneePickerOpen}
        onEstimatedEffortsEnter={hook.onEstimatedEffortsEnter}
        onEstimatedEffortsLeave={hook.onEstimatedEffortsLeave}
      />
      <ReactResizeDetector handleHeight skipOnMount onResize={hook.onResize} />
    </div>
  );
}

export type PureCardInterface = {
  taskId: string;
  taskColor: string;
  shouldRenderExtensions: boolean;
  isEstimatesExtensionEnabled: boolean;
  hasAccessToEstimates: boolean;
  isTaskVotingExtensionEnabled: boolean;
  taskEstimatedEffort: number;
  taskEstimatedHours: number;
  tagCount: number;
  taskDueDate: number;
  taskProgress: number;
  isHoveringEfforts: boolean;
  isAssigneePickerOpen: boolean;
  taskAssignees: List<Id>;
  taskChecklistItemCount: number;
  hook: TaskListItemHookInterface;

  onSetIsTaskProgressPopoverOpen: (isOpen: boolean) => void;
  onSetIsAssigneePickerOpen: (isOpen: boolean) => void;
  onEstimatedEffortsEnter: MouseEventHandler;
  onEstimatedEffortsLeave: MouseEventHandler;
};

const PureCard: React.FC<PureCardInterface> = memo((props) => (
  <>
    <div className={styles.taskColor} style={{ backgroundColor: props.taskColor }} />

    <div className={styles.headerRow}>
      <TaskNameOutput taskId={props.taskId} className={styles.taskName} shouldHighlightSearchPhrase />
      <div className={styles.right}>
        <TaskProgressWithPopover
          onSetIsPopoverOpen={props.onSetIsTaskProgressPopoverOpen}
          taskId={props.taskId}
          ignoreDebounce
        />
      </div>
    </div>

    {renderCardDetails(props)}

    <div className={`${styles.row} ${styles.emptyRowSpacing}`}>
      <StopClickEventPropagation className={styles.emptyRowLeft}>
        <PopoverOpenContextProvider>
          <EmptyPropertyContainer {...props} isHovering={props.hook.isHovering} />
        </PopoverOpenContextProvider>
      </StopClickEventPropagation>
      <StopClickEventPropagation className={styles.emptyRowRight}>
        <CardDetailsMoreOptions
          taskId={props.taskId}
          iconClassName={`${styles.moreButtonIcon} ${styles.emptyProperty} ${getConditionalClass(
            styles.visible,
            props.hook.isHovering,
          )}`}
          onSetIsPopperOpen={props.hook.onSetIsMorePopoverOpen}
          onAction={() => props.hook.onMouseLeave(null)}
        />
      </StopClickEventPropagation>
    </div>
  </>
));

function renderCardDetails(props: PureCardInterface) {
  const { isEstimatesExtensionEnabled, taskDueDate } = props;
  const { hasAssignees, hasChecklistProgress, hasDetails, hasEstimate, hasTags, hasEstimatedEffort, hasPriority } =
    props.hook;

  const renderPointEstimate = isEstimatesExtensionEnabled && hasEstimatedEffort;
  const hasSpacing = !!(hasChecklistProgress || taskDueDate || hasEstimate);

  return (
    <div className={`${styles.cardDetails} ${getConditionalClass(styles.detailsSpacing, !!hasDetails)}`}>
      <div className={`${styles.row} ${getConditionalClass(styles.detailsSpacing, hasSpacing)}`}>
        <div className={styles.rowLeft}>
          <ChecklistProgress className={styles.checklistProgress} taskId={props.taskId} hideOnEmpty />
          {renderPointEstimate && renderEstimatedEffortWithPopover(props)}
          {renderTimeEstimates(props, true)}
        </div>

        <div className={styles.rowRight}>{taskDueDate && renderDueDateWithPopover(props, DateFormat.DayMonthYear)}</div>
      </div>
      <div
        className={`${styles.row} ${styles.spaceBetween} ${getConditionalClass(
          styles.emptyRow,
          !hasTags && !hasAssignees,
        )}`}
      >
        <div className={styles.rowLeft}>{renderTagList({ cardProps: props, showAddTagOnBelowMaxLimit: true })}</div>
        <div className={styles.rowRight}>
          {props.isTaskVotingExtensionEnabled && (
            <StopClickEventPropagation>
              <TaskReactions taskId={props.taskId} showComponentCondition="hasValue" />
            </StopClickEventPropagation>
          )}
          {hasAssignees && renderAssigneeWithPopover(props)}

          {hasPriority && (
            <StopClickEventPropagation>
              <TaskPrioritiesPicker taskId={props.taskId} size="xxs" hideBorder />
            </StopClickEventPropagation>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyPropertyContainer(props: PureCardInterface & { isHovering: boolean }) {
  const { taskId, isHovering, isEstimatesExtensionEnabled } = props;
  const { hasPriority, hasAssignees, hasChecklistProgress, hasTags, hasEstimateHours, hasEstimatePoints } = props.hook;

  const { isOpen: isPopoverOpen } = usePopoverOpenContext();

  const showTimeEstimatesPicker = !hasEstimateHours;
  const showPointEstimate = isEstimatesExtensionEnabled && !hasEstimatePoints;
  const showDatePicker = !props.taskDueDate;
  const isVisible = isHovering || isPopoverOpen;

  return (
    <StopClickEventPropagation>
      <div className={`${styles.emptyPropertyContainer} ${getConditionalClass(styles.visible, isVisible)}`}>
        {!hasChecklistProgress && <ChecklistProgress className={styles.checklistProgressEmpty} taskId={props.taskId} />}

        {!hasTags && renderTagList({ cardProps: props, showTagsOnEmpty: true })}

        {showTimeEstimatesPicker && (
          <StopClickEventPropagation>
            <TaskEstimates taskId={props.taskId} toggleButtonClass={styles.emptyPropertyButtonSize} size="xxs" />
          </StopClickEventPropagation>
        )}

        {showPointEstimate && renderEstimatedEffortWithPopover(props)}
        {!hasAssignees && renderAssigneeWithPopover(props)}
        {showDatePicker && (
          <CardStartAndDueDateController
            taskId={taskId}
            // eslint-disable-next-line no-shadow
            targetRenderer={({ isHovering, onSetIsPickerOpen, isPickerOpen }) => (
              <PropertyButton
                className={styles.emptyPropertyButtonSize}
                onClick={() => onSetIsPickerOpen(!isPickerOpen)}
                isActive={isHovering}
                icon={<CalendarDays size="xxs" />}
              />
            )}
          />
        )}

        {props.isTaskVotingExtensionEnabled && <TaskReactions taskId={props.taskId} showComponentCondition="noValue" />}

        {!hasPriority && (
          <TaskPrioritiesPicker taskId={props.taskId} size="xxs" grayscale className={styles.emptyPropertyButtonSize} />
        )}
      </div>
    </StopClickEventPropagation>
  );
}
TaskListItem.defaultProps = defaultProps;

export default memo(TaskListItem);
