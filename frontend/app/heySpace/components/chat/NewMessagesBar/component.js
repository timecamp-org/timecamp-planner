import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import commonStyles from 'styles/common.css';
import { X } from 'commonComponents/Icons';

import { doNothing } from 'common/utils';
import colorStyles from 'styles/colors.css';
import { useTranslation } from 'i18n';

NewMessagesBar.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  sinceHour: PropTypes.string,
  sinceDate: PropTypes.string,
  color: PropTypes.string,

  onClick: PropTypes.func,
};

NewMessagesBar.defaultProps = {
  sinceHour: '',
  sinceDate: '',
  color: colorStyles.wisteriaColor,

  onClick: doNothing,
};

function NewMessagesBar(props) {
  const { t } = useTranslation();
  return (
    <div
      className={styles.Component}
      className={`${styles.Component} ${props.isVisible ? styles.visible : styles.hidden}`}
      onClick={props.onClick}
      style={{ backgroundColor: props.color, top: props.offsetTop }}
    >
      <div className={styles.text}>{renderMessage()}</div>
      <div className={styles.close}>
        <X size={parseInt(commonStyles.gridCellSize, 10) * 3} />
      </div>
    </div>
  );

  function renderMessage() {
    let result = t(` new messages `, { count: props.messageCount });

    if (props.sinceHour && props.sinceDate) {
      result += t(`since hour on day `, {
        sinceHour: props.sinceHour,
        sinceDate: props.sinceDate,
      });
    }

    return result;
  }
}

export default memo(NewMessagesBar);
