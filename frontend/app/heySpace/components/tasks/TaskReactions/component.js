import PropTypes from 'prop-types';

import TaskReactionList from 'components/tasks/TaskReactionList';
import TaskReactionPicker from 'components/tasks/TaskReactionPicker';

import styles from './styles.css';

TaskReactions.propTypes = {
  taskId: PropTypes.string.isRequired,
  shouldShowReactionPicker: PropTypes.bool,
};

TaskReactions.defaultProps = {
  shouldShowReactionPicker: true,
};

function TaskReactions(props) {
  return (
    <div className={styles.Component}>
      <TaskReactionList taskId={props.taskId} />
      {props.shouldShowReactionPicker && <TaskReactionPicker taskId={props.taskId} />}
    </div>
  );
}

export default TaskReactions;
