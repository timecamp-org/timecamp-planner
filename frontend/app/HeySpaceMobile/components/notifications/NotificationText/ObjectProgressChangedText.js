import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styles from './styles';
import { View, Text } from 'react-native';

import ObjectName from './NotificationObjectName';

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

Component.defaultProps = {};

function Component(props) {
  const progressChange = props.activityChanges.find((change) => change.get('propertyName') === 'progress');
  let newProgress;
  if (progressChange) {
    newProgress = progressChange.get('new');
  }
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{`${props.userName} changed task progress into ${newProgress}% on`}</Text>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  );
}

export default Component;
