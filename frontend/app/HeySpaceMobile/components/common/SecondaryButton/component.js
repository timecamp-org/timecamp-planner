import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

import styles from './styles'

SecondaryButton.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
  isDisabled: PropTypes.bool,
  onPress: PropTypes.func,
  children: PropTypes.object,
}

SecondaryButton.defaultProps = {
  style: {},
  text: '',
  isDisabled: false,
}

export default function SecondaryButton(props) {
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([props.isDisabled ? styles.disabled : styles.component, props.style])}
      onPress={props.onPress}
      disabled={props.isDisabled}
    >
    {props.text ? renderText(props) : props.children}
    </TouchableOpacity>
  )
}

function renderText(props) {
  return (
    <Text style={styles.text}>
      {props.text}
    </Text>
  )
}
