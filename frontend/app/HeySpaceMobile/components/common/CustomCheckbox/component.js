import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { whiteTwoColor, wisteriaColor } from 'common/commonStyles/colors'

import { StyleSheet, TouchableOpacity } from 'react-native'
import Tick from 'Icons/Tick'

CustomCheckbox.propTypes = {
  isChecked: PropTypes.bool,
  color: PropTypes.string,
  onPress: PropTypes.func.isRequired,
}

CustomCheckbox.defaultProps = {
  isChecked: false,
  color: wisteriaColor,
}

function CustomCheckbox(props) {
  return (
    <TouchableOpacity
      style={StyleSheet.flatten([styles.container, { borderColor: props.color, backgroundColor: `${props.isChecked ? props.color : 'transparent'}` }, props.style])}
      onPress={props.onPress}
    >
      {props.isChecked
        ? <Tick style={styles.tickIcon} color={whiteTwoColor}/>
        : null
      }
    </TouchableOpacity>
  )
}

export default CustomCheckbox
