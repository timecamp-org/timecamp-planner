import React from 'react';

import { Button } from '@mui/material';
import styled from 'styles/styled';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { Check } from 'commonComponents/Icons/fontawesome/Check';
import PopoverContent from 'commonComponents/PopoverContent';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation';
import UniversalPopover from 'commonComponents/UniversalPopover';
import { getConditionalClass } from 'utils/getConditionalClass';

import TaskProgressEstimateEditable from '../TaskProgressEstimateEditable';

import { TaskProgressWithPopoverHookInterface, useComponent } from './hook';
import styles from './styles.css';

const popperModifiers = {
  offset: {
    offset: `0, 16`,
  },
};

const ColoredButton = styled(Button)<{ $labelColor: string }>`
  ${({ $labelColor }) => $labelColor && `color: ${$labelColor};`};
`;

export type TaskProgressWithPopoverInterface = {
  taskId: Id;
  targetClassName?: string;
  closedPopperNoProgressTargetClassName?: string;
  buttonClassName?: string;
  checkmarkClassName?: string;
  checkmarkColor?: string;
  hideOnEmpty?: boolean;
  ignoreDebounce?: boolean;
  onSetIsPopoverOpen?: (isOpen: boolean) => void;
  data?: Partial<TaskProgressWithPopoverHookInterface>;
  color?: string;
};

const defaultProps = {
  showEmptyProgress: false,
  ignoreDebounce: false,
  onSetIsPopoverOpen: doNothing,
};

const TaskProgressWithPopover: React.FC<TaskProgressWithPopoverInterface> = (props) => {
  const hook = useComponent(props);

  return (
    <StopClickEventPropagation className={styles.progressWrapper}>
      {hook.isOpen ? renderPopover(props, hook) : renderProgress(props, hook)}
    </StopClickEventPropagation>
  );
};

function renderPopover(props: TaskProgressWithPopoverInterface, hook: TaskProgressWithPopoverHookInterface) {
  return (
    <UniversalPopover
      isPopoverOpened={hook.isOpen}
      targetComponent={renderProgress(props, hook)}
      targetClassName={props.targetClassName}
      popperComponent={renderPopoverContent(props, hook)}
      popperPlacement={'bottom'}
      popperModifiers={popperModifiers}
    />
  );
}

function renderProgress(props: TaskProgressWithPopoverInterface, hook: TaskProgressWithPopoverHookInterface) {
  if (props.hideOnEmpty && !hook.isOpen && hook.taskProgress === 0) {
    return <div className={styles.empty}></div>;
  }

  const isTaskDone = hook.taskProgress === 100;

  return (
    <div className={hook.isOpen ? null : props.targetClassName}>
      {isTaskDone ? renderCheckmark(props, hook) : renderProgressButton(props, hook)}
    </div>
  );
}

function renderCheckmark(props: TaskProgressWithPopoverInterface, hook: TaskProgressWithPopoverHookInterface) {
  return (
    <button onClick={hook.onClick} className={styles.checkmarkWrapper}>
      <Check className={props.checkmarkClassName || styles.checkmark} />
    </button>
  );
}

function renderProgressButton(props: TaskProgressWithPopoverInterface, hook: TaskProgressWithPopoverHookInterface) {
  const hasClosedNoProgressClass = !hook.isOpen && hook.taskProgress === 0;

  return (
    <ColoredButton
      onClick={hook.onClick}
      className={`${props.buttonClassName || styles.taskProgress} ${getConditionalClass(
        styles.progressZero,
        !hook.taskProgress,
      )}
      ${getConditionalClass(props.closedPopperNoProgressTargetClassName, hasClosedNoProgressClass)}
      ${getConditionalClass(styles.active, hook.isOpen)}
      `}
      $labelColor={props.color}
    >
      {`${hook.taskProgress}%`}
    </ColoredButton>
  );
}

function renderPopoverContent(props: TaskProgressWithPopoverInterface, hook: TaskProgressWithPopoverHookInterface) {
  return (
    <PopoverContent onClickOutside={hook.onClosePopover} isVisible={hook.isOpen}>
      <TaskProgressEstimateEditable
        taskId={props.taskId}
        // @ts-ignore
        ignoreDebounce={props.ignoreDebounce}
        // @ts-ignore
        onChangeTaskProgressCallback={hook.onClosePopover}
      />
    </PopoverContent>
  );
}

TaskProgressWithPopover.defaultProps = defaultProps;

export default TaskProgressWithPopover;
