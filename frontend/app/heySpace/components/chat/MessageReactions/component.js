import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'immutable-prop-types'
import { Map, List } from 'immutable'
import styles from './styles.css'

import Reaction from 'commonComponents/Reaction/message'

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
      <div className={`${props.messageReactions.size === 0 ? '' : props.className || styles.Component}`}>
        { props.sortedReactionIds.map((emojiCode) =>
          <Reaction
            messageId={props.messageId}
            key={emojiCode}
            emojiCode={emojiCode}
            userIds={props.messageReactions.get(emojiCode)}
          />)
        }
      </div>
    )
  }
}

export default MessageReactions
