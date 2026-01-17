import React from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import styles from './styles'

TaskProgress.propTypes = {
  taskProgress: PropTypes.number,
  alwaysVisible: PropTypes.bool,
}

TaskProgress.defaultProps = {
  taskProgress: 0,
  alwaysVisible: false,
}

export default function TaskProgress(props) {
  if (props.alwaysVisible || props.taskProgress > 0) {
    return (
      <View style={styles.container}>
        <Text style={props.styles}>
          {`${props.taskProgress}%`}
        </Text>
      </View>
    )
  } else {
    return null
  }
}
