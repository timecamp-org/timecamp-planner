import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import styles from './styles'
import { doNothing } from '../../../../common/utils'

PrimaryButton.propTypes = {
  style: PropTypes.object,
  text: PropTypes.string,
  isDisabled: PropTypes.bool,
  children: PropTypes.object,
  onPress: PropTypes.func,
}

PrimaryButton.defaultProps = {
  style: {},
  text: '',
  isDisabled: false,
  onPress: doNothing,
}

export default function PrimaryButton(props) {
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
    <Text style={styles.textElement}>
      {props.text}
    </Text>
  )
}
