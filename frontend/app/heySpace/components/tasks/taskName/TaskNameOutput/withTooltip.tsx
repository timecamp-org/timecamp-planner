import TooltipedHoveredComponent from 'commonComponents/TooltipedHoveredComponent';
import React from 'react';
import Component, { TaskNameOutputInterface } from './index';

import useElementOverflow from 'hooks/useElementOverflow';
import { useComponent } from './hook';
import styles from './styles.css';

const TooltipedTaskNameOutput: React.FC<TaskNameOutputInterface> = (props) => {
  const hook = useComponent(props.taskId);
  const { isOverflow, targetRef } = useElementOverflow(hook.taskName);
  return (
    <TooltipedHoveredComponent
      className={styles.ellipsized}
      targetInnerClassName={styles.ellipsized}
      message={hook.taskName}
      isTooltipVisible={isOverflow}
      targetRef={targetRef}
    >
      <Component {...props} />
    </TooltipedHoveredComponent>
  );
};

export default TooltipedTaskNameOutput;
