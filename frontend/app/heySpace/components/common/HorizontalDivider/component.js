import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

HorizontalDivider.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
}

HorizontalDivider.defaultProps = {
  className: '',
}

function HorizontalDivider(props) {
  return <div
    className={props.className || styles.horizontalDivider}
    style={props.color ? { backgroundColor: props.color, borderColor: props.color } : null}
  />
}

export default HorizontalDivider
