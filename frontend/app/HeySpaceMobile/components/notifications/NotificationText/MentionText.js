import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { View, Text } from 'react-native';

import EnhanceMentionText from './enhancers/EnhanceMentionText';
import ObjectName from './NotificationObjectName';
import MessageText from '../../chat/MessageText';

Component.propTypes = {
  style: PropTypes.string,

  messageId: PropTypes.string.isRequired,
  messageValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  projectId: PropTypes.string,
  projectValue: PropTypes.string,
  taskId: PropTypes.string,
  taskValue: PropTypes.string,
  isProjectGroupOrDirectChat: PropTypes.bool,
  userName: PropTypes.string,
};

Component.defaultProps = {
  isProjectGroupOrDirectChat: false,
};

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <View style={styles.notificationDetails}>
        {props.taskId ? (
          <Fragment>
            <Text style={styles.textElement}>{`${props.userName} mentioned you on task`}</Text>
            <ObjectName objectId={props.taskId} objectValue={props.taskValue} />
            <Text style={styles.textElement}>{'in'}</Text>
            <ObjectName objectId={props.projectId} objectValue={props.projectValue} />
          </Fragment>
        ) : (
          <Fragment>
            <Text style={styles.textElement}>{`${props.userName} mentioned you in ${
              props.isProjectGroupOrDirectChat ? 'conversation' : 'project'
            }`}</Text>
            <ObjectName objectId={props.projectId} objectValue={props.projectValue} />
          </Fragment>
        )}
        <Text>{':'}</Text>
      </View>
      <View style={styles.commentMessage}>
        <MessageText messageId={props.messageId} text={props.messageValue} />
      </View>
    </View>
  );
}

export default EnhanceMentionText(Component);
