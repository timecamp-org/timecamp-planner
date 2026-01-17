import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

import IsTyping from 'components/chat/IsTyping';
import { useTranslation } from 'i18n';

MessageBoardBottom.propTypes = {
  objectId: PropTypes.string.isRequired,
  isRightPanelOpened: PropTypes.bool,
};

MessageBoardBottom.defaultProps = {
  isRightPanelOpened: true,
};

function MessageBoardBottom(props) {
  const { t } = useTranslation();
  return (
    <div className={props.isRightPanelOpened ? styles.Component : styles.ComponentRightPanelHidden}>
      <IsTyping objectId={props.objectId} />
      <div>
        <span className={styles.bold}>{t('*bold*')}</span>
        <span className={styles.italic}>{t('_italic_')}</span>
        <span className={styles.strikethrough}>{t('~strikethrough~')}</span>
        <span className={styles.strikethrough}>{t('@mention someone')}</span>
      </div>
    </div>
  );
}

export default MessageBoardBottom;
