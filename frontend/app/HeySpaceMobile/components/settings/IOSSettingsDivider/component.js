import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { gridCellSize } from 'styles/common'

import { View, StyleSheet } from 'react-native'

IOSSettingsDivider.propTypes = {
  fullWidth: PropTypes.bool,
}

IOSSettingsDivider.defaultProps = {
  fullWidth: false,
}

function IOSSettingsDivider(props) {
  return (
    <View style={StyleSheet.flatten([styles.wrapper, props.fullWidth ? {} : { paddingLeft: 3 * gridCellSize }])}>
      <View style={styles.divider} />
    </View>
  )
}

export default React.memo(IOSSettingsDivider)
