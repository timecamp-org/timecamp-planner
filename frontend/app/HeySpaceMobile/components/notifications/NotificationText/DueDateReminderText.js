import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Text } from 'react-native'
import { getAlias } from 'models/domain/NotificationsModel/utils'

import ObjectName from './NotificationObjectName'
import { Map } from 'immutable'

Component.propTypes = {
  style: PropTypes.string,
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
}

Component.defaultProps = {
  content: new Map({ content: '' }),
}

function Component(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{'You have upcoming due date'}</Text>
      <Text style={styles.textElement}>{`to ${getAlias(props.targetType)}`}</Text>
      <ObjectName objectType={props.targetType} objectId={props.targetId} />
      {props.isContainerNameVisible ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.isContainerNameVisible ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  )
}

export default Component
