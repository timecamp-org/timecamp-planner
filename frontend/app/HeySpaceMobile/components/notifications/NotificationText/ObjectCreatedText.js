import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Text } from 'react-native'

import ObjectName from './NotificationObjectName'
import ObjectType from './NotificationObjectType'

Component.propTypes = {
  style: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  taskId: PropTypes.string,
  taskValue: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{`${props.userName} created new `}</Text>
      <ObjectType
        objectId={props.targetId} 
        objectType={props.targetType}
        objectValue={props.targetValue}
        taskListId={props.taskListId}
        taskListValue={props.taskListValue}
      />
      {props.projectId ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.projectId ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  )

}

export default Component
