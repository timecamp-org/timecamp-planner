import { FC } from 'react';

import { doNothing } from 'common/utils';
import { Check } from 'commonComponents/Icons/fontawesome/Check';

import styles from './styles.css';

export type SpaceColoredCheckboxInterface = {
  className?: string;
  color?: string;
  label?: string;
  isChecked?: boolean;
  isDisabled?: boolean;
  onToggleStatus?: VoidFunction;
};

const defaultProps = {
  label: '',
  isChecked: false,
  isDisabled: false,
  onToggleStatus: doNothing,
};

const Checkbox: FC<SpaceColoredCheckboxInterface> = (props) => (
  <span onClick={props.onToggleStatus} className={props.className || styles.Component}>
    <div
      className={`
    ${styles.checkWrapper}
    ${props.isDisabled ? styles.disabled : ''}
    ${props.isChecked ? styles.checked : ''}
    `}
    >
      <Check className={styles.checkIcon} id={props.label} />
    </div>
    {props.label && <label htmlFor={props.label}>{props.label}</label>}
  </span>
);

Checkbox.defaultProps = defaultProps;

export default Checkbox;
