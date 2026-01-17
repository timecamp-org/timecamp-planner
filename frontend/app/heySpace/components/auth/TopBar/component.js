import React from 'react';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { doNothing } from 'common/utils';

import styles from './styles.css';

TopBar.defaultProps = {
  text: 'Want to set up new account?',
  buttonText: 'Sign in',
  onButtonClick: doNothing,
};

export default function TopBar(props) {
  return (
    <div className={styles.signIn}>
      {props.text}
      <SecondaryButton
        className={styles.signInButton}
        onClick={props.onButtonClick}
      >
        {props.buttonText}
      </SecondaryButton>
    </div>
  );
}
