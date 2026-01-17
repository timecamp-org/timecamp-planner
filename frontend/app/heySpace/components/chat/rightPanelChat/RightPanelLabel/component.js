import React from 'react';

import PropTypes from 'prop-types';

import { AlignLeft, Members, Settings, Filters, Puzzle } from 'commonComponents/Icons';
import { useTranslation } from 'i18n';
import colorStyles from 'styles/colors.css';

import { CARD_LIST, MEMBERS, SETTINGS, FILTERS, ADDONS } from '../utils/panelNames';

import styles from './styles.css';

RightPanelLabel.propTypes = {
  currentPanelName: PropTypes.string.isRequired,
};

RightPanelLabel.defaultProps = {
  currentPanelName: CARD_LIST,
  color: colorStyles.wisteriaColor,
};

function RightPanelLabel(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component} style={{ color: props.color }}>
      {getIcon(props.currentPanelName, props.color)}
      <div className={styles.panelName}>{t(props.currentPanelName)}</div>
    </div>
  );
}

function getIcon(item) {
  switch (item) {
    case CARD_LIST:
      return <AlignLeft className={styles.icon} />;
    case MEMBERS:
      return <Members className={styles.icon} />;
    case SETTINGS:
      return <Settings className={styles.icon} />;
    case FILTERS:
      return <Filters className={styles.icon} />;
    case ADDONS:
      return <Puzzle className={styles.icon} />;
    default:
      return null;
  }
}

export default RightPanelLabel;
