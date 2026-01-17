import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

import { timestampToDateFormat } from 'common/utils/dateOperations'

TaskDueDate.propTypes = {
  taskDueDate: PropTypes.number,
  alwaysVisible: PropTypes.bool,
}

TaskDueDate.defaultProps = {
  alwaysVisible: false,
}

export default function TaskDueDate(props) {
  if (props.alwaysVisible || props.taskDueDate) {
    return (
      <Text style={props.styles}>
        {timestampToDateFormat(props.taskDueDate)}
      </Text>
    )
  } else {
    return null
  }
}
