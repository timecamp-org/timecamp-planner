import React from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { getFormattedDateForDateLine } from 'common/utils/dateOperations'

import styles from './styles'

DateSeparator.propTypes = {
  timestamp: PropTypes.number.isRequired,
}

export default function DateSeparator(props) {
  return (
    <View style={styles.separator}>
      <View style={styles.lineLeft}></View>
      <Text style={styles.text} numberOfLines={1}>{getFormattedDateForDateLine(props.timestamp)}</Text>
      <View style={styles.lineRight}></View>
    </View>
  )
}
