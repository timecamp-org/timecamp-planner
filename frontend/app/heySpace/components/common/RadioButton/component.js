import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';

import styles from './styles.css';

RadioButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  shouldColorCheckedLabel: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  value: PropTypes.string,
  color: PropTypes.string,
};

RadioButton.defaultProps = {
  label: '',
  isChecked: false,
  isDisabled: false,
  shouldColorCheckedLabel: false,
  value: '',
  onChange: doNothing,
  onClick: doNothing,
};

function RadioButton(props) {
  const inputName = Math.random().toString();
  function onClick(event) {
    props.onClick();
  }
  return (
    <div
      className={`
    ${props.className || styles.component}
    ${props.isDisabled ? styles.disabled : ''}
    `}
      onClick={onClick}
    >
      <input
        id={inputName}
        name={inputName}
        type="radio"
        checked={props.isChecked}
        onChange={props.onChange}
        value={props.value}
        disabled={props.isDisabled}
      />
      <label
        htmlFor={inputName}
        className={props.isDisabled ? styles.disabledLabel : styles.labelText}
        style={{
          color: props.isChecked && props.shouldColorCheckedLabel ? props.color : null,
        }}
      >
        {props.label}
      </label>
    </div>
  );
}

export default RadioButton;
