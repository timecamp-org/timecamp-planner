import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'react-native'

GroupConversationName.propTypes = {
  conversationName: PropTypes.string,
  style: PropTypes.object,
  numberOfLines: PropTypes.number,
  ellipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
}

GroupConversationName.defaultProps = {
  numberOfLines: 1,
  ellipsizeMode: 'tail',
}

function GroupConversationName(props) {
  return (
    <Text
      style={props.style}
      numberOfLines={props.numberOfLines}
      ellipsizeMode={props.ellipsizeMode}
    >
      {props.conversationName}
    </Text>
  )
}

export default GroupConversationName
