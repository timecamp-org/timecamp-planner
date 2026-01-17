import React from 'react';

import styles from './styles.css';
import Logo from '-!svg-react-loader?name=BrandLogo!styles/assets/heyspace_4.svg';

const BrandLogo = (props) => (
  <div className={props.className || styles.Component}>
    <Logo className={styles.icon} />
    <span className={styles.text}>{'Planner'}</span>
  </div>
);

export default BrandLogo;
