import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { View, Text } from 'react-native'

import PersonFullName from '../../person/PersonFullName'
import ObjectName from './NotificationObjectName'
import ObjectType from './NotificationObjectType'
import { EntityStatus } from 'models/domain/EntityModel/types'

import { List } from 'immutable'

Component.propTypes = {
  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  taskListId: PropTypes.string,
  taskListValue: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
}

Component.defaultProps = {
  activityChanges: new List(),
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      {renderUserName()}
      {props.activityChanges.map(renderChange)}
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

  function renderUserName() {
    return <PersonFullName style={styles.userName} userId={props.actorId} />
  }

  function renderChange(change, idx) {
    const newValue = change.get('new')
    if (change.get('propertyName') === 'isArchived' || (change.get('propertyName') === 'status' && newValue === EntityStatus.ARCHIVED)) {
      return <Text key={idx} style={styles.textElement}>{newValue ? 'archived' : 'unarchived'}</Text>
    } else {
      return null
    }
  }
}

export default Component
