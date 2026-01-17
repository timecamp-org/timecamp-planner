import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';

import styles from './styles.css';

MaterialSwitch.propTypes = {
  className: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

MaterialSwitch.defaultProps = {
  className: '',
  isChecked: false,
  isDisabled: false,
  onClick: doNothing,
};

function MaterialSwitch({ isChecked, isDisabled, onClick, className, color }) {
  return (
    <div
      className={`${isDisabled ? styles.materialSwitchDisabled : styles.materialSwitch} ${className}`}
      onClick={onClick}
    >
      <div
        className={`${isChecked ? styles.trackChecked : styles.track}`}
        style={isChecked ? { background: color } : null}
      />
      <div
        className={`${isChecked ? styles.knobChecked : styles.knob}`}
        style={isChecked ? { background: color } : null}
      />
    </div>
  );
}

export default MaterialSwitch;
