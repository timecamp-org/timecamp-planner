import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { View, Text } from 'react-native'
import { getAlias } from 'models/domain/NotificationsModel/utils'

import ObjectName from './NotificationObjectName'
import { EntityType } from 'models/domain/EntityModel/types'

Component.propTypes = {
  style: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  containerId: PropTypes.string,
  containerType: PropTypes.string,
  containerValue: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
  userName: PropTypes.string,
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{`${props.userName} moved ${getAlias(props.targetType)}`}</Text>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue}/>
      <Text style={styles.textElement}>{props.targetType === EntityType.TASK_LIST ? 'in' : 'to'}</Text>
      <ObjectName objectId={props.containerId} objectValue={props.containerValue}/>
      {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  )
}

export default Component
