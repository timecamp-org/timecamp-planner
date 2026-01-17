import React from 'react';

import EmptyState from 'commonAssets/emptyState/Empty_State_26.png';

import styles from './styles.css';

const TryingToLogInMessage = (props) => (
  <div className={styles.Component}>
    <img src={EmptyState} className={styles.mascot} />
    <div className={styles.title}>{props.text}</div>
  </div>
);

export default TryingToLogInMessage;
