import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Text } from 'react-native'

import ObjectName from './NotificationObjectName'
import ObjectType from './NotificationObjectType'
import MessageText from '../../chat/MessageText'

Component.propTypes = {
  style: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  projectValue: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  messageValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  userName: PropTypes.string,
}

Component.defaultProps = {
  messageValue: {},
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <View style={styles.notificationDetails}>
        <Text style={styles.textElement}>{` ${props.userName} added your message`}</Text>
        <ObjectType
          taskListId={props.taskListId}
          taskListValue={props.taskListValue}
        />
        {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
        {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
      </View>
      <View style={styles.commentMessage}>
        <MessageText messageId={props.messageId} text={props.messageValue}/>
      </View>
    </View>
  )
}

export default Component
