import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'
import { View, Text } from 'react-native'
import { ellipsizeInTheEnd } from 'common/utils'
import format from 'date-fns/format'

import ObjectName from './NotificationObjectName'
import ObjectType from './NotificationObjectType'
import { List } from 'immutable'

const propertiesWithoutValues = [
  'color',
]

Component.propTypes = {
  style: PropTypes.string,

  actorId: PropTypes.string.isRequired,
  projectId: PropTypes.string,
  targetId: PropTypes.string,
  targetValue: PropTypes.string,
  targetType: PropTypes.string,
  activityChanges: ImmutablePropTypes.list.isRequired,
  userName: PropTypes.string,
}

Component.defaultProps = {
  activityChanges: new List(),
}

function Component(props) {
  return (
    <View style={{ ...styles.Component, ...props.style }}>
      {props.activityChanges.map(renderChange)}
      <ObjectType
        objectId={props.targetId}
        objectType={props.targetType}
        objectValue={props.targetValue}
      />
      {props.projectId ? <Text style={styles.textElement}>{' in '}</Text> : null}
      {props.projectId ? <ObjectName objectId={props.projectId} objectValue={props.projectValue} /> : null}
    </View>
  )

  function renderChange(change, idx) {
    const propertyName = change.get('propertyName')
    const changeStatus = getChangeStatus(change)
    if (needsPropertyValue(change.get('propertyName'))) {
      return <React.Fragment key={idx}>
        {changeStatus === 'removed' ?
          <Text style={styles.textElement}>{`${props.userName} ${changeStatus} the ${humanReadableProperty(propertyName)} from`}</Text>
          :
          <React.Fragment>
            <Text style={styles.textElement}>{`${props.userName} ${changeStatus} the ${humanReadableProperty(propertyName)} to ${getChangeValue(change)}`}</Text>
            {shouldRenderComma(idx) ? <Text style={styles.comma}>{','}</Text> : <Text style={styles.textElement}>{' to'}</Text>}
          </React.Fragment>
        }
      </React.Fragment>
    } else {
      return renderPropertyName(change, idx)
    }
  }

  function renderPropertyName(change, idx) {
    const propertyName = change.get('propertyName')
    const changeStatus = getChangeStatus(change)
    return <View key={idx}>
      <Text style={styles.textElement}>{`${changeStatus} the ${humanReadableProperty(propertyName)}`}</Text>
      {shouldRenderComma(idx) ? <Text style={styles.comma}>{','}</Text> : null}
    </View>
  }

  function needsPropertyValue(property) {
    return !propertiesWithoutValues.includes(property)
  }

  function getChangeValue(change) {
    const newValue = change.get('new')
    switch (change.get('propertyName')) {
      case 'startDate':
      case 'endDate':
      case 'dueDate':
        return format(newValue, 'MMM D')
      default:
        return ellipsizeInTheEnd(newValue ? `${newValue}` : '', 18)
    }
  }

  function getChangeStatus(change) {
    const newValue = change.get('new')
    const oldValue = change.get('old')
    if ((!oldValue || oldValue === '') && (newValue && newValue !== '')) {
      return 'set'
    } else if ((oldValue && oldValue !== '') && (!newValue || newValue === '')) {
      return 'removed'
    } else {
      return 'changed'
    }
  }

  function shouldRenderComma(changeId) {
    return !isLastChange(changeId) && props.activityChanges.size > 1
  }

  function isLastChange(changeId) {
    return changeId === props.activityChanges.size - 1 && changeId > 0
  }

  function humanReadableProperty(property) {
    return property.replace(/([A-Z])/g, ' $1').toLowerCase()
  }
}

export default Component
