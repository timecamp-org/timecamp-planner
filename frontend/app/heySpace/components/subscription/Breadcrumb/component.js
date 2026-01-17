import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { Checkmark } from 'commonComponents/Icons';

Breadcrumb.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
  label: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

Breadcrumb.defaultProps = {
  isValid: false,
  label: '',
  isActive: false,
};

function Breadcrumb(props) {
  // eslint-disable-line react/prefer-stateless-function
  const Icon = props.icon;
  return (
    <div
      className={`${styles.Component} ${props.isActive ? styles.active : ''}`}
    >
      <Icon className={`${styles.icon}`} />
      {props.isValid ? <Checkmark className={styles.checkmark} /> : null}
      <div className={styles.label}>{props.label}</div>
    </div>
  );
}

export default Breadcrumb;
