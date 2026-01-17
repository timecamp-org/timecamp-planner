import React from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'

import styles from './styles'

Separator.propTypes = {
  text: PropTypes.string,
}

Separator.defaultProps = {
  text: 'or',
}

export default function Separator(props) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.textElement}>
        {props.text}
      </Text>
      <View style={styles.line} />
    </View>
  )
}
