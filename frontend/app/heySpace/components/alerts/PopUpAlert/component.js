import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';

import * as Icons from 'commonComponents/Icons';
import {
  error,
  warning,
  success,
  information,
} from 'models/component/PopUpAlertsModel/constants/kinds';
import { Alert } from 'models/component/PopUpAlertsModel/models';
import HumanMessage from 'commonComponents/HumanMessage';

import * as actionTypes from 'models/component/PopUpAlertsModel/constants/actionsTypes';
import { wifiOff } from 'models/component/PopUpAlertsModel/constants/alertLeftIcons';

const iconSize = 16;

PopUpAlert.propTypes = {
  alert: PropTypes.instanceOf(Alert).isRequired,
  topOffset: PropTypes.object,
  shouldHaveLeftMargin: PropTypes.bool.isRequired,

  onClosePopUpAlert: PropTypes.func.isRequired,
};

PopUpAlert.defaultProps = {
  shouldHaveLeftMargin: true,

  onClosePopUpAlert: doNothing,
};

function PopUpAlert(props) {
  const { t } = useTranslation();
  return (
    <div
      className={`${styles.Component}
      ${getKindClassName(props.alert.kind)}
      ${props.shouldHaveLeftMargin ? styles.leftOffset : ''}
    `}
      style={props.topOffset}
    >
      {renderIcon(props.alert.kind, props.alert.leftIcon)}
      <div className={styles.humanMessage}>
        <HumanMessage
          className={styles.text}
          model={props.alert}
          isColorOverrided
        />
      </div>
      {props.alert.actions.map(renderAction)}
    </div>
  );

  function renderAction(action, index) {
    const key = `${action}_${index}`;
    switch (action) {
      case actionTypes.close: {
        return (
          <div
            key={key}
            className={styles.close}
            onClick={() => props.onClosePopUpAlert(props.alert.id)}
          >
            <Icons.X size={iconSize} />
          </div>
        );
      }
      case actionTypes.refreshPage: {
        return (
          <div
            key={key}
            className={styles.refreshPage}
            onClick={() => window.location.reload()}
          >
            <Icons.Refresh className={styles.refreshPageIcon} size={iconSize} />
            {t('REFRESH APP')}
          </div>
        );
      }
      default: {
        return null;
      }
    }
  }

  function renderIcon(kind, leftIcon) {
    const icon = leftIcon || kind;

    switch (icon) {
      case error: {
        return <Icons.AlertCircle className={styles.icon} size={iconSize} />;
      }
      case warning: {
        return <Icons.AlertTriangle className={styles.icon} size={iconSize} />;
      }
      case success: {
        return <Icons.CheckCircle className={styles.icon} size={iconSize} />;
      }
      case information: {
        return <Icons.InfoCircle className={styles.icon} size={iconSize} />;
      }
      case wifiOff: {
        return <Icons.WifiOff className={styles.icon} size={iconSize} />;
      }
      default: {
        return null;
      }
    }
  }

  function getKindClassName(kind) {
    switch (kind) {
      case error: {
        return styles.error;
      }
      case warning: {
        return styles.warning;
      }
      case success: {
        return styles.success;
      }
      case information: {
        return styles.information;
      }
      default: {
        return '';
      }
    }
  }
}

export default PopUpAlert;
