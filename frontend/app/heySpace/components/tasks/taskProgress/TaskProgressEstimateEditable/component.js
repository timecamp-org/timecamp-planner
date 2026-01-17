import React from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';
import styles from './styles.css';

import TaskProgressEstimateEditableOptionButton from '../TaskProgressEstimateEditableOptionButton';

TaskProgressEstimateEditable.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  progressEstimate: PropTypes.number,
  tempProgressEstimate: PropTypes.number,
  shouldRenderTooltip: PropTypes.bool,
  progressEstimateThresholdOptions: PropTypes.array.isRequired,

  onMouseEnterProgressBar: PropTypes.func,
  onMouseLeaveProgressBar: PropTypes.func,
  onMouseEnterOptionButton: PropTypes.func,
  onMouseLeaveOptionButton: PropTypes.func,

  onChangeProgressEstimate: PropTypes.func,
  onBlur: PropTypes.func,
};

TaskProgressEstimateEditable.defaultProps = {
  progressEstimate: 0,
  tempProgressEstimate: 0,
  shouldRenderTooltip: true,

  onMouseEnterProgressBar: doNothing,
  onMouseLeaveProgressBar: doNothing,
  onMouseEnterOptionButton: doNothing,
  onMouseLeaveOptionButton: doNothing,

  onChangeProgressEstimate: doNothing,
  onBlur: doNothing,
};

function TaskProgressEstimateEditable(props) {
  return (
    <div
      className={props.className || styles.progressBar}
      onMouseEnter={props.onMouseEnterProgressBar}
      onMouseLeave={props.onMouseLeaveProgressBar}
    >
      {props.progressEstimateThresholdOptions.map(renderOptionThreshold)}
    </div>
  );

  function renderOptionThreshold(optionThreshold) {
    return (
      <TaskProgressEstimateEditableOptionButton
        key={optionThreshold}
        spaceColor={props.color}
        optionThreshold={optionThreshold}
        progressEstimate={props.progressEstimate}
        tempProgressEstimate={props.tempProgressEstimate}
        onMouseEnter={props.onMouseEnterOptionButton}
        onMouseLeave={props.onMouseLeaveOptionButton}
        onClick={props.onChangeProgressEstimate}
      />
    );
  }
}

export default TaskProgressEstimateEditable;
