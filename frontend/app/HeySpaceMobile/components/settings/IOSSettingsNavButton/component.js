import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { TouchableOpacity, Text } from 'react-native'
import { doNothing } from 'common/utils'

IOSSettingsNavButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  onPress: PropTypes.func,
}

IOSSettingsNavButton.defaultProps = {
  onPress: doNothing,
}

function IOSSettingsNavButton(props) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      {props.text
        ? <Text style={styles.text}>{props.text}</Text>
        : props.icon
      }
    </TouchableOpacity>
  )
}

export default IOSSettingsNavButton
