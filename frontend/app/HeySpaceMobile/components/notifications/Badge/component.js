import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, Text, StyleSheet } from 'react-native'
import { blackColor, wisteriaColor } from 'common/commonStyles/colors'

Badge.propTypes = {
  color: PropTypes.string,
  textColor: PropTypes.string,
  count: PropTypes.number,
  style: PropTypes.object,
  smallTextStyle: PropTypes.object,
  normalTextStyle: PropTypes.object,
}

Badge.defaultProps = {
  color: wisteriaColor,
  textColor: blackColor,
  count: 0,
}

function Badge(props) {
  if (props.count <= 0) {
    return null
  } else {
    return (
      <View style={StyleSheet.flatten([styles.container, props.style || {}, { backgroundColor: props.color }])}>
        <Text style={props.count > 9 ? StyleSheet.flatten([styles.smallText, props.smallTextStyle, { color: props.textColor }]) : StyleSheet.flatten([styles.normalText, props.normalTextStyle, { color: props.textColor }])}>
          {props.count > 100
            ? '99+'
            : props.count}
        </Text>
      </View>
    )
  }
}

export default Badge
