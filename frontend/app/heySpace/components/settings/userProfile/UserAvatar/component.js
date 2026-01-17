import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

UserAvatar.propTypes = {
  className: PropTypes.string,

  userInitials: PropTypes.string,
  userAvatarUrl: PropTypes.string,
}

UserAvatar.defaultProps = {
  className: '',

  userInitials: '',
  userAvatarUrl: '',
}

function UserAvatar(props) {
  if (props.userAvatarUrl) {
    return (
      <div
        className={props.className || styles.Component}
      >
        <img
          role="presentation"
          className={`${styles.avatarImage} ${props.innerClassName}`}
          src={props.userAvatarUrl}
        />
      </div>
    )
  } else {
    return (
      <div
        className={props.className || styles.Component}
      >
        <div className={`${styles.initialsCircle} ${props.innerClassName}`}>
          <span className={styles.initials}>{props.userInitials}</span>
        </div>
      </div>
    )
  }
}

export default UserAvatar
