import React from 'react'
import PropTypes from 'prop-types'
import { Map, List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { View } from 'react-native'

import Reaction from '../Reaction/message'
import styles from './styles'

MessageReactions.propTypes = {
  messageId: PropTypes.string.isRequired,
  messageReactions: ImmutablePropTypes.map,
  sortedReactionIds: ImmutablePropTypes.list.isRequired,
}

MessageReactions.defaultProps = {
  messageReactions: new Map(),
  sortedReactionIds: new List(),
}

function MessageReactions(props) {
  if (!props.messageReactions.size === 0) {
    return null
  } else {
    return (
      <View style={styles.component}>
        {props.sortedReactionIds.map(renderReaction)}
      </View>
    )
  }

  function renderReaction(emojiCode) {
    return (
      <Reaction
        messageId={props.messageId}
        key={emojiCode}
        emojiCode={emojiCode}
        userIds={props.messageReactions.get(emojiCode)}
      />
    )
  }
}

export default MessageReactions
