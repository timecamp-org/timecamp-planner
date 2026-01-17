import React from 'react'
import PropTypes from 'prop-types'

UserNickname.propTypes = {
  className: PropTypes.string,
  nickname: PropTypes.string,
}

UserNickname.defaultProps = {
  className: '',
  nickname: '',
}

function UserNickname(props) {
  return (
    <div className={props.className}>
      {props.nickname}
    </div>
  )
}

export default UserNickname
