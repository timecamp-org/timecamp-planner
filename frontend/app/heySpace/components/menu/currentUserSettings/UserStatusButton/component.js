import React from 'react';
import PropTypes from 'prop-types';
import { doNothing, ellipsizeInTheEnd } from 'common/utils';

import styles from './styles.css';
import { useTranslation } from 'i18n';

import { Emot } from 'commonComponents/Icons';
import Emoji from 'commonComponents/Emoji';

UserStatusButton.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  emojiCode: PropTypes.string,

  onClick: PropTypes.func,
};

UserStatusButton.defaultProps = {
  className: '',
  title: '',
  emojiCode: null,

  onClick: doNothing,
};

function UserStatusButton(props) {
  const { t } = useTranslation();
  return (
    <div onClick={props.onClick} className={props.className}>
      <div className={styles.iconWrapper}>
        {props.emojiCode ? <Emoji colonsEmojiCode={props.emojiCode} size={14} /> : <Emot className={styles.icon} />}
      </div>

      {props.title ? `Status - ${ellipsizeInTheEnd(props.title, 20)}` : t('Set your status')}
    </div>
  );
}

export default UserStatusButton;
