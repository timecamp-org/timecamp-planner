import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { doNothing } from 'common/utils'

NumericInput.propTypes = {
  value: PropTypes.number,
  increment: PropTypes.func,
  decrement: PropTypes.func,
}

NumericInput.defaultProps = {
  value: 0,
  increment: doNothing,
  decrement: doNothing,
}

function NumericInput(props) {
  return (
    <View style={styles.component}>
      <TouchableOpacity
        style={StyleSheet.flatten([styles.button, styles.leftButton])}
        onPress={props.decrement}
      >
        <Text style={styles.buttonContent}>{'-'}</Text>
      </TouchableOpacity>
      <View style={styles.valueContainer}>
        <Text>{props.value}</Text>
      </View>
      <TouchableOpacity
        style={StyleSheet.flatten([styles.button, styles.rightButton])}
        onPress={props.increment}
      >
        <Text style={styles.buttonContent}>{'+'}</Text>
      </TouchableOpacity>
    </View>
  )
}


export default NumericInput
