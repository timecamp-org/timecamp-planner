import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'

import { View, TouchableOpacity, StyleSheet } from 'react-native'

RadioButton.propTypes = {
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  style: PropTypes.object,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
}

RadioButton.defaultProps = {
  isSelected: false,
  isDisabled: false,
  onPress: doNothing,
  onLongPress: doNothing,
}

function RadioButton(props) {
  return (
    <TouchableOpacity
      style={getWrapperStyles(props)}
      disabled={props.isDisabled}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      {props.isSelected && <View
        style={getViewStyles(props)}
      />
      }
    </TouchableOpacity>
  )
}

function getWrapperStyles(props) {
  return StyleSheet.flatten([
    styles.outerCircle,
    props.style || {},
    props.isDisabled ? styles.disabled : {},
  ])
}

function getViewStyles(props) {
  return StyleSheet.flatten([
    styles.innerCircle,
    props.isDisabled ? styles.disabledInner : {},
  ])
}

export default RadioButton
