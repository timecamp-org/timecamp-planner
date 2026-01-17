import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { Text } from 'react-native';

import ObjectName from './NotificationObjectName';

Component.propTypes = {
  objectId: PropTypes.string,
  objectValue: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
};

function Component(props) {
  const isLabel = props.taskListId === props.objectId;
  if (isLabel) {
    return (
      <Fragment>
        <Text style={styles.textElement}>{'list'}</Text>
        <ObjectName objectId={props.objectId} objectValue={props.objectValue} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        {props.objectId ? (
          <Fragment>
            <Text style={styles.textElement}>{'task'}</Text>
            <ObjectName objectId={props.objectId} objectValue={props.objectValue} />
          </Fragment>
        ) : null}
        {props.taskListId ? (
          <Fragment>
            <Text style={styles.textElement}>{'on'}</Text>
            <ObjectName objectId={props.taskListId} objectValue={props.taskListValue} />
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}

export default Component;
