import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

ButtonShade.propTypes = {
  isBright: PropTypes.bool.isRequired,
  className: PropTypes.string,
  opacity: PropTypes.number.isRequired,
}

ButtonShade.defaultProps = {
  isBright: false,
  opacity: 0,
}

function ButtonShade(props) {
  return (
    <div className={props.className || styles.Component} style={getBackgroundColor(props)} />
  )
}

function getBackgroundColor(props) {
  const color = props.isBright
    ? `rgba(255, 255, 255, ${props.opacity})`
    : `rgba(0, 0, 0, ${props.opacity})`
  return { background: color }
}

export default ButtonShade
