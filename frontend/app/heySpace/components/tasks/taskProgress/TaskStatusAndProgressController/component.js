import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import TaskProgressEstimate from '../TaskProgressEstimate';
import TaskCompletionStatusController from '../../TaskCompletionStatusController';
import { useTranslation } from 'i18n';

TaskStatusAndProgressController.propTypes = {
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  onBlur: PropTypes.func,
};

TaskStatusAndProgressController.defaultProps = {
  onBlur: doNothing,
};

function TaskStatusAndProgressController(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className} tabIndex={'-1'} onBlur={props.onBlur}>
      <TaskCompletionStatusController
        taskId={props.taskId}
        color={props.color}
      />
      <div className={styles.taskProgressWrapper}>
        <div className={styles.controllerTitle}>{t('Progress:')}</div>
        <TaskProgressEstimate taskId={props.taskId} />
      </div>
    </div>
  );
}

export default TaskStatusAndProgressController;
