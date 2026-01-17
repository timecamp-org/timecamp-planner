import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Text } from 'react-native'
import { getAlias } from 'models/domain/NotificationsModel/utils'

import ObjectName from './NotificationObjectName'

Component.propTypes = {
  style: PropTypes.string,

  fileValue: PropTypes.string.isRequired,
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
        <Text style={styles.textElement}>{`${props.userName} attached ${props.fileValue} to ${getAlias(props.containerType)}`}</Text>
        <ObjectName objectId={props.containerId} objectValue={props.containerValue}/>
        {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
        {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
      </View>
    </View>
  )
}

export default Component
