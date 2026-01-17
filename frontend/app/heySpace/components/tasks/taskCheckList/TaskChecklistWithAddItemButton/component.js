import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import TaskChecklist from '../TaskChecklist';
import ChecklistItemAddButton from '../ChecklistItemAddButton';

TaskChecklistWithAddItemButton.propTypes = {
  taskId: PropTypes.string.isRequired,
  className: PropTypes.string,
  listClassName: PropTypes.string,
  buttonClassName: PropTypes.string,
  isChecklistEmpty: PropTypes.bool,
};

TaskChecklistWithAddItemButton.defaultProps = {
  isChecklistEmpty: true,
};

function TaskChecklistWithAddItemButton(props) {
  return (
    <div className={props.className || styles.component}>
      {!props.isChecklistEmpty ? (
        <TaskChecklist
          color={props.color}
          className={props.listClassName}
          taskId={props.taskId}
        />
      ) : null}
      <ChecklistItemAddButton
        color={props.color}
        className={props.buttonClassName}
        taskId={props.taskId}
      />
    </div>
  );
}

export default TaskChecklistWithAddItemButton;
