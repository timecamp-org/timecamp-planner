import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import { blackColor } from 'styles/colors.css'

HorizontalSeparator.propTypes = {
  className: PropTypes.string,

  color: PropTypes.string,
  text: PropTypes.string,
}

HorizontalSeparator.defaultProps = {
  classname: undefined,

  color: blackColor,
  text: '',
}

function HorizontalSeparator(props) {
  return (
    <div className={props.className}>
      <div
        className={styles.line}
        style={{ backgroundColor: props.color }}
      />
      <div className={styles.text} style={{ color: props.color }}>
        {props.text}
      </div>
      <div
        className={styles.line}
        style={{ backgroundColor: props.color }}
      />
    </div>
  )
}

export default HorizontalSeparator
