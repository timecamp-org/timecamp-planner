import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles';
import { View, Text } from 'react-native';

import ObjectName from './NotificationObjectName';
import { List } from 'immutable';

Component.propTypes = {
  style: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
  userName: PropTypes.string,
};

Component.defaultProps = {
  activityChanges: new List(),
};

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text>{`${props.userName} ${renderChange()}`}</Text>
      <Text style={styles.textElement}>{props.targetType === 'task' ? 'a task' : 'project'}</Text>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  );

  function renderChange() {
    const change = props.activityChanges.find((change) => change.get('propertyName') === 'status');
    if (!change) {
      return null;
    }

    const newValue = change.get('new');
    switch (newValue) {
      case 'complete': {
        return 'completed';
      }
      case 'incomplete': {
        return 'uncompleted';
      }
      default: {
        return null;
      }
    }
  }
}

export default Component;
