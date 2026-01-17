import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import Emoji from 'commonComponents/Emoji'

UserStatus.propTypes = {
  size: PropTypes.number,
  title: PropTypes.string,
  emojiCode: PropTypes.string,
}

UserStatus.defaultProps = {
  size: 14,
  title: '',
  emojiCode: null,
}

export default function UserStatus(props) {
  return (
    <div className={props.className || styles.Component}>
      {
        props.emojiCode &&
        <span className={styles.emoji}>
          <Emoji
            colonsEmojiCode={props.emojiCode}
            size={props.size}
          />
        </span>
      }
      <span className={styles.title}>{props.title}</span>
    </div>
  )
}
