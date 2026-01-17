import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import Emoji from 'commonComponents/Emoji'

UserStatusEmoji.propTypes = {
  size: PropTypes.number,
  emojiCode: PropTypes.string,
}

UserStatusEmoji.defaultProps = {
  size: 14,
  emojiCode: null,
}

export default function UserStatusEmoji(props) {
  if (!props.emojiCode) {
    return null
  }
  return (
    <span className={props.className || styles.Component}>
      <Emoji
        colonsEmojiCode={props.emojiCode}
        size={props.size}
      />
    </span>
  )
}
