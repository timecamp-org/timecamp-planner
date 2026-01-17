import React from 'react'
import { Text } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

MessageInternalLink.propTypes = {
  text: PropTypes.string.isRequired,
  key: PropTypes.string,
  onPress: PropTypes.func.isRequired,
}

function MessageInternalLink(props) {
  return (
    <Text
      style={styles.link}
      key={props.key}
      onPress={props.onPress}
    >
      {props.text}
    </Text>
  )
}

export default MessageInternalLink
