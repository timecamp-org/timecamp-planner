import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import colorStyles from 'styles/colors.css';

import styles from './styles.css';

TaskProgressEstimateEditableOptionButton.propTypes = {
  spaceColor: PropTypes.string,
  optionThreshold: PropTypes.number.isRequired,
  progressEstimate: PropTypes.number,
  tempProgressEstimate: PropTypes.number,

  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
};

TaskProgressEstimateEditableOptionButton.defaultProps = {
  spaceColor: colorStyles.dodgerBlueColor,
  progressEstimate: 0,
  tempProgressEstimate: 0,

  onMouseEnter: doNothing,
  onMouseLeave: doNothing,
  onClick: doNothing,
};

function TaskProgressEstimateEditableOptionButton(props) {
  return (
    <div
      className={`${styles[`optionButton--progress-${props.optionThreshold}`]} ${getOptionButtonClassName(
        props.optionThreshold,
        props.progressEstimate,
        props.tempProgressEstimate,
      )}`}
      onClick={(event) => props.onClick(event, props.optionThreshold)}
      onMouseEnter={() => props.onMouseEnter(props.optionThreshold)}
      onMouseLeave={(event) => props.onMouseLeave(event, props.optionThreshold)}
    >
      <div className={styles.optionThreshold}>{`${props.optionThreshold}%`}</div>
    </div>
  );
}

const getOptionButtonClassName = (optionThreshold, progressEstimate, tempProgressEstimate) =>
  Math.max(progressEstimate, tempProgressEstimate) >= optionThreshold ? styles.currentProgress : '';

export default TaskProgressEstimateEditableOptionButton;
