import React, { LegacyRef, MouseEventHandler, RefObject } from 'react';

import Highlighter from 'react-highlight-words';

import { doNothing, ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';

import { useComponent } from './hook';
import styles from './styles.css';

export type TaskNameOutputInterface = {
  taskId?: Id;
  className?: string;
  taskName?: string;
  maxLength?: number;
  shouldHighlightSearchPhrase?: boolean;
  placeholder?: string;
  color?: string;

  onClick?: MouseEventHandler<HTMLSpanElement>;
  targetRef?: RefObject<HTMLSpanElement>;
  onSetRef?: LegacyRef<HTMLSpanElement>;
};

const defaultProps = {
  shouldHighlightSearchPhrase: false,
  onClick: doNothing,
  onSetRef: doNothing,
};

const TaskNameOutput: React.FC<TaskNameOutputInterface> = (props) => {
  const hook = useComponent(props.taskId);
  let taskName = hook.taskName || props.taskName;
  taskName = props.maxLength ? ellipsizeInTheEnd(taskName, props.maxLength) : taskName;

  return (
    <span
      className={props.className || styles.Component}
      ref={props.targetRef || props.onSetRef}
      onClick={props.onClick}
      style={{ color: props.color }}
    >
      {taskName === '' ? (
        <span className={styles.placeholder}>{props.placeholder}</span>
      ) : props.shouldHighlightSearchPhrase && hook.searchPhrase ? (
        <Highlighter searchWords={[hook.searchPhrase]} autoEscape textToHighlight={taskName} />
      ) : (
        taskName
      )}
    </span>
  );
};

TaskNameOutput.defaultProps = defaultProps;

export default TaskNameOutput;
