import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Text } from 'react-native'
import { getAlias } from 'models/domain/NotificationsModel/utils'

import PersonFullName from '../../person/PersonFullName'
import ObjectName from './NotificationObjectName'

Component.propTypes = {
  style: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  containerValue: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
  userName: PropTypes.string,
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{`${props.userName} ${props.containerType === 'task' ? 'added' : 'invited'}`}</Text>
      {renderUserName(props.userId)}
      <Text style={styles.textElement}>{props.containerType === 'task' ? 'as assignee to ' : `to the ${props.isProjectPrivate ? 'private' : 'public'}`}</Text>
      <Text style={styles.textElement}>{getAlias(props.containerType)}</Text>
      <ObjectName
        objectType={props.containerType}
        objectId={props.containerId}
        objectValue={props.containerValue}
      />
      {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  )

  function renderUserName(userId) {
    if (props.userId === userId) {
      return <Text style={styles.textElement}>{'you'}</Text>
    } else {
      return <PersonFullName style={styles.userName} userId={userId} />
    }
  }

}

export default Component
