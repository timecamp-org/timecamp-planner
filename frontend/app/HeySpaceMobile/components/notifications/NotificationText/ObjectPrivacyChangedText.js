import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { View, Text } from 'react-native'

import PersonFullName from '../../person/PersonFullName'
import ObjectName from './NotificationObjectName'
import { List } from 'immutable'

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
}

Component.defaultProps = {
  activityChanges: new List(),
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{`${props.userName} made `}</Text>
      <ObjectName objectId={props.targetId} objectValue={props.targetValue} />
      {props.activityChanges.map(renderChange)}
    </View>
  )

  function renderUserName() {
    return <PersonFullName style={styles.userName} userId={props.actorId} />
  }

  function renderChange(change, idx) {
    const newValue = change.get('new')
    if (change.get('propertyName') === 'isPrivate') {
      return <Text key={idx} style={styles.textElement}>{newValue ? 'private' : 'public'}</Text>
    } else {
      return null
    }
  }
}

export default Component
