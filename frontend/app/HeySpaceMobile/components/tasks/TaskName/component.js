import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

TaskName.propTypes = {
  taskName: PropTypes.string.isRequired,
}

TaskName.defaultProps = {
  taskName: '',
}

export default function TaskName(props) {
  return (
    <Text style={props.styles}>
      {props.taskName}
    </Text>
  )
}
