import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { getAlias } from 'models/domain/NotificationsModel/utils'
import { View, Text } from 'react-native'

import ObjectName from './NotificationObjectName'
import MessageText from '../../chat/MessageText'

Component.propTypes = {
  messageId: PropTypes.string.isRequired,
  messageValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerValue: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
  userName: PropTypes.string,
}

Component.defaultProps = {
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <View style={styles.notificationDetails}>
        <Text style={styles.textElement}>{`${props.userName} commented on`}</Text>
        <Text style={styles.textElement}>{getAlias(props.containerType)}</Text>
        <ObjectName objectId={props.containerId} objectValue={props.containerValue}/>
        {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
        {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue}/> : null}
        <Text>{':'}</Text>
      </View>
      <View style={styles.commentMessage}>
        <MessageText messageId={props.messageId} text={props.messageValue}/>
      </View>
    </View>
  )
}

export default Component
