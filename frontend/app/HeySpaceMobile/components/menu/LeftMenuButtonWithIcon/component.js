import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { TouchableOpacity, View, Text } from 'react-native'

LeftMenuButtonWithIcon.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
}

function LeftMenuButtonWithIcon(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.buttonContent}>
        {props.icon}
        <Text
          style={styles.buttonText}
          numberOfLines={1}
        >
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default LeftMenuButtonWithIcon
