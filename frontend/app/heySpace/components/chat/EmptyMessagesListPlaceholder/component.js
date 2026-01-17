import React from 'react';
import styles from './styles.css';
import { i18n, i18mark } from 'i18n';

EmptyMessagesListPlaceholder.defaultProps = {
  title: i18mark('No messages yet'),
  subTitle: i18mark(`Don’t be shy, send a message to your team and fill this empty project.`),
};

function EmptyMessagesListPlaceholder(props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        <div className={props.mascotClassName ? props.mascotClassName : styles.mascot} />
        <div className={styles.title}>{i18n.t(props.title)}</div>
        <div className={`${styles.subTitle} ${props.subtitleClassName}`} onClick={props.onSubtitleClick}>
          {i18n.t(props.subTitle)}
        </div>
      </div>
    </div>
  );
}

export default EmptyMessagesListPlaceholder;
