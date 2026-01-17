import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'

import HumanMessage from 'commonComponents/HumanMessage';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'commonComponents/Icons';

const iconSize = 16;

Alert.propTypes = {
  className: PropTypes.string,
  model: PropTypes.shape({
    kind: PropTypes.string,
    submessages: PropTypes.object,
    text: PropTypes.string,
  }),
};

Alert.defaultProps = {
  className: '',
};

function Alert(props) {
  return (
    <div
      className={`${getClassName(props.model.kind)} ${
        props.className || styles.Component
      }`}
    >
      {renderIcon(props.model.kind)}
      <HumanMessage
        model={props.model}
        className={styles.humanMessage}
        maxRows={2}
      />
    </div>
  );
}

function renderIcon(kind) {
  switch (kind) {
    case HumanMessageKind.error: {
      return <AlertCircle className={styles.icon} size={iconSize} />
    }
    case HumanMessageKind.warning: {
      return <AlertTriangle className={styles.icon} size={iconSize} />
    }
    case HumanMessageKind.success: {
      return <CheckCircle className={styles.icon} size={iconSize} />
    }
    case HumanMessageKind.information: {
      return <Info className={styles.icon} size={iconSize} />
    }
    default: {
      return null;
    }
  }
}

function getClassName(kind) {
  switch (kind) {
    case HumanMessageKind.error: {
      return styles.error
    }
    case HumanMessageKind.warning: {
      return styles.warning
    }
    case HumanMessageKind.success: {
      return styles.success
    }
    case HumanMessageKind.information: {
      return styles.information
    }
    default: {
      return '';
    }
  }
}

export default Alert;
