import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { Copy as CopyIcon } from 'commonComponents/Icons';
import { doNothing } from 'common/utils';

import styles from './styles.css';

UserInputWithCopy.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  inputInnerClassName: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  isDisabled: PropTypes.bool,
  onSetRef: PropTypes.func,
  onClick: PropTypes.func,
};

UserInputWithCopy.defaultProps = {
  value: '',
  label: '',
  isDisabled: false,
  onSetRef: doNothing,
  onClick: doNothing,
};

function UserInputWithCopy(props) {
  return (
    <div className={props.className || styles.Component}>
      <span className={styles.label}>{props.label}</span>
      <div className={styles.inputWithButton}>
        <UserInput
          className={props.inputClassName || styles.input}
          innerClassName={props.inputInnerClassName || styles.inputInner}
          value={props.value}
          isDisabled={props.isDisabled}
          onSetInnerRef={props.onSetRef}
        />
        <SecondaryButton className={styles.copyButton} onClick={props.onClick}>
          <CopyIcon />
        </SecondaryButton>
      </div>
    </div>
  );
}

export default UserInputWithCopy;
