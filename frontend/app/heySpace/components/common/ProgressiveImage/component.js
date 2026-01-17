import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

import { doNothing } from 'common/utils'

ProgressiveImage.propTypes = {
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  imageUrl: PropTypes.string.isRequired,
  tinyImageUrl: PropTypes.string,
  isImageLoaded: PropTypes.bool,
  isTinyImageLoaded: PropTypes.bool,
  onClick: PropTypes.func,
  onLoadImage: PropTypes.func,
  onLoadTinyImage: PropTypes.func,
}

ProgressiveImage.defaultProps = {
  isImageLoaded: false,
  isTinyImageLoaded: false,
  onClick: doNothing,
  onLoadImage: doNothing,
  onLoadTinyImage: doNothing,
}

function ProgressiveImage(props) {
  return (
    <div className={props.className || styles.imagePlacegolder} style={props.containerStyle}>
      {props.tinyImageUrl && renderTinyImage(props)}
      {renderImage(props)}
    </div>
  )
}

function renderImage(props) {
  return (
    <img
      src={props.imageUrl}
      className={`${styles.image} ${props.isImageLoaded && styles.loaded}`}
      style={props.imageStyle}
      onClick={props.onClick}
      onLoad={props.onLoadImage}
    />
  )
}

function renderTinyImage(props) {
  return (
    <img
      src={props.tinyImageUrl}
      className={`${styles.tinyImage} ${props.isTinyImageLoaded && styles.loaded}`}
      onClick={props.onClick}
      style={props.imageStyle}
      onLoad={props.onLoadTinyImage}
    />
  )
}

export default ProgressiveImage
