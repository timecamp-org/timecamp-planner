import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import styles from './styles'
import { Text } from 'react-native'

DateOutput.propTypes = {
  timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  format: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,

  leftText: PropTypes.string, // TODO what is that for?
  rightText: PropTypes.string, // TODO what is that for?
}

DateOutput.defaultProps = {
  leftText: '',
  rightText: '',
  tabIndex: undefined,
}

function DateOutput(props) {
  return (
    <Text
      style={props.style}
    >
      <Text>{props.leftText}</Text>
      {props.timestamp ?
        <Text>{format(props.timestamp, props.format)}</Text>
        : <Text style={styles.placeholder}>{props.placeholder}</Text>
      }
      <Text>{props.rightText}</Text>
    </Text>
  )
}

export default DateOutput
