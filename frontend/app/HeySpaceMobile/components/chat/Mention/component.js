import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { StyleSheet } from 'react-native'
import styles from './styles'

Mention.propTypes = {
  displayValue: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

Mention.defaultProps = {
  displayValue: '',
  color: '',
}

export default function Mention(props) {
  return (
    <Text style={StyleSheet.flatten([styles.mention, { color: props.color }])}>
      {`@${props.displayValue}`}
    </Text>
  )
}
