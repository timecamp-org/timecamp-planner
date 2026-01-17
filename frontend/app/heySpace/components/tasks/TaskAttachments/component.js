import React from 'react';
import styles from './styles.css';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import TaskAttachment from '../TaskAttachment';

TaskAttachments.propTypes = {
  taskAttachmentsIds: ImmutablePropTypes.list,
  taskId: PropTypes.string.isRequired,
  color: PropTypes.string,
  onDeleteFile: PropTypes.func.isRequired,
};

TaskAttachments.defaultProps = {
  taskAttachmentsIds: new List(),
  onDeleteFile: doNothing,
};

function TaskAttachments(props) {
  return (
    <div className={styles.taskAttachments}>
      {props.taskAttachmentsIds.map(renderAttachment)}
    </div>
  );

  function renderAttachment(taskAttachmentId) {
    return (
      <TaskAttachment
        key={taskAttachmentId}
        id={taskAttachmentId}
        color={props.color}
        taskId={props.taskId}
        onDeleteFile={() => props.onDeleteFile(taskAttachmentId)}
      />
    );
  }
}

export default TaskAttachments;
