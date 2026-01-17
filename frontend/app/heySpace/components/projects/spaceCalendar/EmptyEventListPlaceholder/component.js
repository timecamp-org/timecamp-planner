import React from 'react';
import styles from './styles.css';
import { i18n, i18mark } from 'i18n';

EmptyEventListPlaceholder.defaultProps = {
  title: i18mark('Hmm… no events in this time period.'),
  subTitle: i18mark(
    `It seems there is nothing scheduled for this time. Change the timeframe or simply create some tasks.`
  ),
};

function EmptyEventListPlaceholder(props) {
  return (
    <div className={props.className || styles.Component}>
      <div className={props.mascotClassName ? props.mascotClassName : styles.mascot} />
      <div className={styles.title}>{i18n.t(props.title)}</div>
      <div className={styles.subTitle}>{i18n.t(props.subTitle)}</div>
    </div>
  );
}

export default EmptyEventListPlaceholder;
