import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { View, Text } from 'react-native'

InvitationJoinedText.propTypes = {
  className: PropTypes.string,
  actorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userValue: PropTypes.string.isRequired,
  projectId: PropTypes.string,
}

InvitationJoinedText.defaultProps = {
}

function InvitationJoinedText(props) {
  return (
    <View style={props.style ? props.style : styles.Component}>
      <Text style={styles.textElement}>{`${props.userValue} joined your WorkSpace using your shared link.`}</Text>
    </View>
  )
}

export default InvitationJoinedText
