import React from 'react';

import { Id } from 'common/utils/identifier';
import useComponent from 'commonComponents/ChecklistProgress/hook';
import { CheckList } from 'commonComponents/Icons/fontawesome/CheckList';

import styles from './styles.css';

export type ChecklistProgressInterface = {
  taskId: Id;
  shouldRenderIcon?: boolean;
  renderBrackets?: boolean;
  className?: string;
  hideOnEmpty?: boolean;
  color?: string;
};

const defaultProps: Partial<ChecklistProgressInterface> = {
  shouldRenderIcon: true,
};

const ChecklistProgress: React.FC<ChecklistProgressInterface> = (props) => {
  const hook = useComponent(props);
  const style = { color: props.color };

  if (props.hideOnEmpty && !hook.progress) {
    return null;
  }

  return (
    <div className={props.className || styles.component} style={style}>
      {props.shouldRenderIcon && <CheckList className={styles.icon} />}
      <div className={styles.counter}>
        <span>
          {props.renderBrackets && '('}
          {hook.itemsDone}
        </span>
        <span>{'/'}</span>
        <span>
          {hook.itemsTotal}
          {props.renderBrackets && ')'}
        </span>
      </div>
    </div>
  );
};

ChecklistProgress.defaultProps = defaultProps;

export default ChecklistProgress;
