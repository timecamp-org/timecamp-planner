import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text } from 'react-native'

IOSSettingsSectionDivider.propTypes = {
  title: PropTypes.string,
}

function IOSSettingsSectionDivider(props) {
  return (
    <View style={styles.container}>
      {props.title && <Text style={styles.title}>{props.title}</Text>}
    </View>
  )
}

export default React.memo(IOSSettingsSectionDivider)
