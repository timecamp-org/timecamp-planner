import React from 'react'
import PropTypes from 'prop-types'
import { Emoji } from 'emoji-mart'

EmojiComponent.propTypes = {
  colonsEmojiCode: PropTypes.string.isRequired,
  size: PropTypes.number,
}

EmojiComponent.defaultProps = {
  size: 24,
}

function EmojiComponent(props) {
  return <Emoji
    emoji={props.colonsEmojiCode}
    size={props.size}
    fallback={(_, fallbackProps) => (
      <span>{fallbackProps.emoji}</span>
    )}
  />
}

export default EmojiComponent
