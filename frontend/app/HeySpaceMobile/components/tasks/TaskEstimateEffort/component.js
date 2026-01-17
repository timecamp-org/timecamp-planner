import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

TaskEstimateEffort.propTypes = {
  taskDueDate: PropTypes.number,
  alwaysVisible: PropTypes.bool,
}

TaskEstimateEffort.defaultProps = {
  alwaysVisible: false,
}

export default function TaskEstimateEffort(props) {
  if (props.alwaysVisible || props.taskEstimateEffort > 0) {
    return (
      <Text style={props.styles}>
        {props.taskEstimateEffort}
      </Text>
    )
  } else {
    return null
  }
}
