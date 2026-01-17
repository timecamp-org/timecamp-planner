import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import colorStyles from 'styles/colors.css';
import ObjectColors from 'styles/objectColors';

import HorizontalDivider from 'commonComponents/HorizontalDivider';
import { i18n } from 'i18n';

NewMessagesSeparator.propTypes = {
  color: PropTypes.string,
};

NewMessagesSeparator.defaultProps = {
  color: colorStyles.wisteriaColor,
};

function NewMessagesSeparator(props) {
  const textColorClassName = ObjectColors.getColorSpecificClassName(props.color, 'text');
  return (
    <div className={styles.Component}>
      <div className={styles.newMessagesSeparator}>
        <HorizontalDivider className={styles.horizontalDivider} color={props.color} />
        <div className={`${styles.text} ${textColorClassName}`}>{i18n.t('New messages')}</div>
        <HorizontalDivider className={styles.horizontalDivider} color={props.color} />
      </div>
    </div>
  );
}

export default NewMessagesSeparator;
