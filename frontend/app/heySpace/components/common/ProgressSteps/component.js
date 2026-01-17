import PropTypes from 'prop-types';

import styles from './styles.css';

ProgressSteps.propTypes = {
  className: PropTypes.string,
  currentStep: PropTypes.number,
  stepsCount: PropTypes.number,
};

ProgressSteps.defaultProps = {
  currentStep: 0,
  stepsCount: 0,
};

function ProgressSteps(props) {
  return <div className={props.className || styles.Component}>{renderProgressSteps()}</div>;

  function renderProgressSteps() {
    const steps = [];
    for (let i = 1; i <= props.stepsCount; i++) {
      steps.push(renderStep(i));
    }
    return steps;
  }

  function renderStep(index) {
    return <div key={index} className={`${styles.circle} ${index === props.currentStep ? styles.completed : ''}`} />;
  }
}

export default ProgressSteps;
