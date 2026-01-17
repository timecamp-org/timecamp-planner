import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player/lazy'

import styles from './styles.css'

Player.propTypes = {
  className: PropTypes.string,
  placeholderClassName: PropTypes.string,
  url: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
}


Player.defaultProps = {
  className: '',
  width: 360,
  height: 200,
}

function Player(props) {
  const [isReady, onSetIsReady] = useState(false)
  return (
    <div className={`${styles.player} ${isReady ? null : props.placeholderClassName || styles.placeholder}`}>
      <ReactPlayer
        url={props.url}
        controls={true}
        width={props.width}
        height={props.height}
        onReady={() => onSetIsReady(true)}
      />
    </div>
  )
}

export default Player
